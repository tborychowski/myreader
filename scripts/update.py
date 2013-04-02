#!/usr/bin/python
# Download RSS feeds in Python
# Only works with sqlite and standard RSS/Atom feeds
# Not compatible with native load in selfoss
import os
import sys
import json
import time
import sqlite3
import hashlib
import urllib2
import tempfile
import calendar
import datetime
import HTMLParser
import feedparser
import ConfigParser
import lxml.html as lh

def geticon(link):
    icondir = os.path.dirname(__file__) + "/../data/favicons/"
    favicon = "%s/favicon.ico" % "/".join(link.split("/")[:3])
    try:
        doc = lh.parse(urllib2.urlopen(link))
        favicons = doc.xpath('//link[@rel="shortcut icon"]/@href')
        if len(favicons) > 0:
            favicon = favicons[0]
            if favicon.startswith("/"):
                favicon = "/".join(link.split("/")[:3]) + favicon
    except Exception, e:
        print "Error getting favicon for %s" % (link)
        print e
    md5 = hashlib.md5(favicon).hexdigest()
    if not os.path.exists(icondir + md5 + ".png"):
        try:
            f = tempfile.NamedTemporaryFile(delete=False)
            f.write(urllib2.urlopen(favicon).read())
            fn = f.name
            f.close()
            os.system("convert %s %s" % (fn, icondir + md5 + ".png"))
            os.remove(fn)
        except Exception, e:
            print e
    return md5 + ".png"

lasttime = int(sys.argv[1]) if len(sys.argv) > 1 else 0

config = ConfigParser.RawConfigParser()
config.readfp(open(os.path.dirname(__file__) + "/../defaults.ini"))
config.read(os.path.dirname(__file__) + "/../config.ini")

if config.get("globals","db_type") != "sqlite":
    print "Only works with sqlite database, sorry..."
    sys.exit(1)

db = sqlite3.connect(os.path.dirname(__file__) + "/../" + config.get("globals","db_file"))
db.row_factory = sqlite3.Row

sources = db.cursor()
items = db.cursor()
error = db.cursor()
for source in sources.execute("SELECT * FROM sources WHERE spout = 'spouts\\rss\\feed'"):
    icon = ""
    items.execute("SELECT * FROM items WHERE source=? ORDER BY datetime DESC LIMIT 1", [source["id"]])
    item = items.fetchone()
    if item:
        icon = item["icon"]
    if lasttime:
        if not item or item["datetime"] < str(datetime.datetime.now()-datetime.timedelta(seconds=lasttime)):
            continue
    try:
        feed = feedparser.parse(json.loads(HTMLParser.HTMLParser().unescape(source["params"]))["url"])
    except Exception, e:
        print "Error fetching %s: %s" % (source["title"],e)
        error.execute("UPDATE sources SET error=? WHERE id=?", [str(e),source["id"]])
        continue
    if source["error"]:
        error.execute("UPDATE sources SET error='' WHERE id=?", [source["id"]])
    if not feed.entries:
        print "No articles for %s %s" % (source["title"], json.loads(HTMLParser.HTMLParser().unescape(source["params"]))["url"])
    for entry in feed.entries:
        if not entry.get("id"):
            entry["id"] = entry.link
        if not entry.get("title"):
            entry["title"] = source["title"]
        items.execute("SELECT * FROM items WHERE uid=?", [entry.id])
        item = items.fetchone()
        if item:
            pass
        else:
            content = ''
            if "content" in entry:
                content = entry.content[0].value
            elif "summary_detail" in entry:
                content = entry.summary_detail.value
            if not content:
                raise Exception("No summary_detail")
            if "updated_parsed" in entry and entry.updated_parsed:
                date = datetime.datetime.fromtimestamp(calendar.timegm(entry.updated_parsed))
            else:
                date = datetime.datetime.now()
            if date < datetime.datetime.now()-datetime.timedelta(days=config.getint("globals","items_lifetime")):
                continue
            items.execute("INSERT INTO items(datetime,title,content,thumbnail,icon,unread,starred,source,uid,link) VALUES (?,?,?,?,?,?,?,?,?,?)", [
              date,
              entry.title,
              content,
              '',
              icon or geticon(entry.link),
              1,
              0,
              source["id"],
              entry.get("id") or entry.link,
              entry.link ])
    db.commit()
items.execute("DELETE FROM items WHERE datetime < ?",[datetime.datetime.now()-datetime.timedelta(days=config.getint("globals","items_lifetime"))])
db.commit()
db.close()
