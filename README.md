MyReader
=======

Project is based on Selfos (http://selfoss.aditu.de).
The front-end is completely rewritten. Back-end is less modified (but there is a plan to move to laravel someday);


INSTALLATION
------------

1. Upload all files of this folder
2. Make directories data/cache, data/favicons, data/logs, data/thumbnails, data/sqlite and public/ writable
3. Enter your BD credentials into config.ini (see below) (DB will be created automatically)
4. Create cronjob for updating feeds: wget http://yourdomain.com/update 
   (you can also execute update.php from commandline)


CONFIGURATION
-------------

1. Copy defaults.ini to config.ini
2. Edit config.ini and delete any lines you do not wish to override
3. Do not delete the [globals] line
4. See http://selfoss.aditu.de/ for examples



UPDATE
------

1. backup your database and your "data" folder
2. (IMPORTANT: don't delete the "data" folder) delete all old files and folders excluding the folder "data"
3. upload all new files and folders excluding the data folder (IMPORTANT: also upload the invisible .htaccess files)
4. Rename your folder /data/icons into /data/favicons
5. Delete the files /public/all.css and /public/all.js
6. Clean your browser cache
7. insert your current database connection and your individual configuration in config.ini. Important: we change the config.ini and add new options in newer versions. You have to update the config.ini too.



OPML Import
-----------

Visit http://yourdomain.com/opml to import an OPML File. 
If you want to import from google reader open: http://www.google.com/reader/subscriptions/export do download 
an xml file with your subscriptions and import the file.

