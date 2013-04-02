<?PHP

namespace daos\mysql;

/**
 * Class for accessing persistent saved items -- mysql
 *
 * @package    daos
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Tobias Zeising <tobias.zeising@aditu.de>
 * @author     Harald Lapp <harald.lapp@gmail.com>
 */
class Items extends Database {

    /**
     * indicates whether last run has more
     * results or not
     * @var bool
     */
    private $hasMore = false;

    
    /**
     * mark item as read
     *
     * @return void
     * @param int $id
     */
    public function mark($id) {
        if($this->isValid('id', $id)===false)
            return;
        
        if(is_array($id))
            $id = implode(",", $id);
        
        // i used string concatenation after validating $id
        \F3::get('db')->exec('UPDATE items SET unread=0 WHERE id IN (' . $id . ')');
    }
    
    
    /**
     * mark item as unread
     *
     * @return void
     * @param int $id
     */
    public function unmark($id) {
        if(is_array($id)) {
            $id = implode(",", $id);
        } else if(!is_numeric($id)) {
            return;
        }
        \F3::get('db')->exec('UPDATE items SET unread=1 WHERE id IN (:id)',
                    array(':id' => $id));
    }
    
    
    /**
     * starr item
     *
     * @return void
     * @param int $id the item
     */
    public function starr($id) {
        \F3::get('db')->exec('UPDATE items SET starred=1 WHERE id=:id', 
                    array(':id' => $id));
    }
    
    
    /**
     * unstarr item
     *
     * @return void
     * @param int $id the item
     */
    public function unstarr($id) {
        \F3::get('db')->exec('UPDATE items SET starred=0 WHERE id=:id',
                    array(':id' => $id));
    }
    
    
    /**
     * add new item
     *
     * @return void
     * @param mixed $values
     */
    public function add($values) {
        \F3::get('db')->exec('INSERT INTO items (
                    datetime, 
                    title, 
                    content, 
                    unread, 
                    starred, 
                    source, 
                    thumbnail, 
                    icon, 
                    uid,
                    link
                  ) VALUES (
                    :datetime, 
                    :title, 
                    :content, 
                    :unread,
                    :starred, 
                    :source, 
                    :thumbnail, 
                    :icon, 
                    :uid,
                    :link
                  )',
                 array(
                    ':datetime'    => $values['datetime'],
                    ':title'       => $values['title'],
                    ':content'     => $values['content'],
                    ':thumbnail'   => $values['thumbnail'],
                    ':icon'        => $values['icon'],
                    ':unread'      => 1,
                    ':starred'     => 0,
                    ':source'      => $values['source'],
                    ':uid'         => $values['uid'],
                    ':link'        => $values['link']
                 ));
    }
    
    
    /**
     * checks whether an item with given
     * uid exists or not
     *
     * @return bool
     * @param string $uid
     */
    public function exists($uid) {
        $res = \F3::get('db')->exec('SELECT COUNT(*) AS amount FROM items WHERE uid=:uid',
                    array(':uid' => $uid));
        return $res[0]['amount']>0;
    }
    
    
    /**
     * cleanup old items
     *
     * @return void
     * @param DateTime $date date to delete all items older than this value
     */
    public function cleanup(\DateTime $date) {
        \F3::get('db')->exec('DELETE FROM items WHERE starred=0 AND datetime<:date',
                    array(':date' => $date->format('Y-m-d').' 00:00:00'));
    }
    
    
    /**
     * returns items
     *
     * @return mixed items as array
     * @param mixed $options search, offset and filter params
     */
    public function get($options = array()) {
        $params = array();
        $where = '';
        
        // only starred
        if(isset($options['type']) && $options['type']=='starred')
            $where .= ' AND starred=1 ';
            
        // only unread
        else if(isset($options['type']) && $options['type']=='unread')
            $where .= ' AND unread=1 ';
        
        // search
        if(isset($options['search']) && strlen($options['search'])>0) {
            $search = str_replace(" ", "%", trim($options['search']));
            $params[':search'] = $params[':search2'] = $params[':search3'] = array("%".$search."%", \PDO::PARAM_STR);
            $where .= ' AND (items.title LIKE :search OR items.content LIKE :search2 OR sources.title LIKE :search3) ';
        }
        
        // tag filter
        if(isset($options['tag']) && strlen($options['tag'])>0) {
            $params[':tag'] = array( "%,".$options['tag'].",%" , \PDO::PARAM_STR );
            if ( \F3::get( 'db_type' ) == 'mysql' ) {
              $where .= " AND ( CONCAT( ',' , sources.tags , ',' ) LIKE :tag ) ";
            } else {
              $where .= " AND ( (',' || sources.tags || ',') LIKE :tag ) ";
            }
        }
        // source filter
        elseif(isset($options['source']) && strlen($options['source'])>0) {
            $params[':source'] = array($options['source'], \PDO::PARAM_INT);
            $where .= " AND items.source=:source ";
        }
        
        // set limit
        if(!is_numeric($options['items']) || $options['items']>200)
            $options['items'] = \F3::get('items_perpage');
        
        // first check whether more items are available
        $result = \F3::get('db')->exec('SELECT items.id
                   FROM items, sources
                   WHERE items.source=sources.id '.$where.' 
                   LIMIT ' . ($options['offset']+$options['items']) . ', 1', $params);
        $this->hasMore = count($result);

        // get items from database
        return \F3::get('db')->exec('SELECT 
                    items.id, datetime, items.title AS title, content, unread, starred, source, thumbnail, icon, uid, link, sources.title as sourcetitle, sources.tags as tags
                   FROM items, sources 
                   WHERE items.source=sources.id '.$where.' 
                   ORDER BY items.datetime DESC 
                   LIMIT ' . $options['offset'] . ', ' . $options['items'], $params);
    }
    
    
    /**
     * returns whether more items for last given
     * get call are available
     *
     * @return bool
     */
    public function hasMore() {
        return $this->hasMore;
    }
    
    
    /**
     * return all thumbnails
     *
     * @return string[] array with thumbnails
     */
    public function getThumbnails() {
        $thumbnails = array();
        $result = \F3::get('db')->exec('SELECT thumbnail 
                   FROM items 
                   WHERE thumbnail!=""');
        foreach($result as $thumb)
            $thumbnails[] = $thumb['thumbnail'];
        return $thumbnails;
    }
    
    
    /**
     * return all icons
     *
     * @return string[] array with all icons
     */
    public function getIcons() {
        $icons = array();
        $result = \F3::get('db')->exec('SELECT icon 
                   FROM items 
                   WHERE icon!=""');
        foreach($result as $icon)
            $icons[] = $icon['icon'];
        return $icons;
    }
    
    
    /**
     * return all thumbnails
     *
     * @return bool true if thumbnail is still in use
     * @param string $thumbnail name
     */
    public function hasThumbnail($thumbnail) {
        $res = \F3::get('db')->exec('SELECT count(*) AS amount
                   FROM items 
                   WHERE thumbnail=:thumbnail',
                  array(':thumbnail' => $thumbnail));
        $amount = $res[0]['amount'];
        if($amount==0)
            \F3::get('logger')->log('thumbnail not found: '.$thumbnail, \DEBUG);
        return $amount>0;
    }
    
    
    /**
     * return all icons
     *
     * @return bool true if icon is still in use
     * @param string $icon file
     */
    public function hasIcon($icon) {
        $res = \F3::get('db')->exec('SELECT count(*) AS amount
                   FROM items 
                   WHERE icon=:icon',
                  array(':icon' => $icon));
        return $res[0]['amount']>0;
    }
    
    /**
     * test if the value of a specified field is valid
     *
     * @return  bool
     * @param   string      $name
     * @param   mixed       $value
     */
    public function isValid($name, $value) {
        $return = false;
        
        switch ($name) {
        case 'id':
            $return = is_numeric($value);
            
            if(is_array($value)) {
                $return = true;
                foreach($value as $id) {
                    if(is_numeric($id)===false) {
                        $return = false;
                        break;
                    }
                }
            }
            break;
        }
        
        return $return;
    }
    
    
    /**
     * returns the icon of the last fetched item.
     *
     * @return bool|string false if none was found
     * @param number $sourceid id of the source
     */
    public function getLastIcon($sourceid) {
        if(is_numeric($sourceid)===false)
            return false;
        
        $res = \F3::get('db')->exec('SELECT icon FROM items WHERE source=:sourceid AND icon!=0 AND icon!="" ORDER BY ID DESC LIMIT 0,1',
                    array(':sourceid' => $sourceid));
        if(count($res)==1)
            return $res[0]['icon'];
            
        return false;
    }
    
    
    /**
     * returns the amount of entries in database
     *
     * @return int amount of entries in database
     */
    public function numberOfItems() {
        $res = \F3::get('db')->exec('SELECT count(*) AS amount FROM items');
        return $res[0]['amount'];
    }
    
    
    /**
     * returns the amount of entries in database which are unread
     *
     * @return int amount of entries in database which are unread
     */
    public function numberOfUnread() {
        $res = \F3::get('db')->exec('SELECT count(*) AS amount
                   FROM items 
                   WHERE unread=1');
        return $res[0]['amount'];
    }
    
    
    /**
     * returns the amount of entries in database which are starred
     *
     * @return int amount of entries in database which are starred
     */
    public function numberOfStarred() {
        $res = \F3::get('db')->exec('SELECT count(*) AS amount
                   FROM items 
                   WHERE starred=1');
        return $res[0]['amount'];
    }

    
    /**
     * returns the amount of unread entries in database per tag
     *
     * @return int amount of entries in database per tag
     */
    public function numberOfUnreadForTag($tag) {
        $select = 'SELECT count(*) AS amount FROM items, sources';
        $where = ' WHERE items.source=sources.id AND unread=1';
        if ( \F3::get( 'db_type' ) == 'mysql' ) {
            $where .= " AND ( CONCAT( ',' , sources.tags , ',' ) LIKE :tag ) ";
        } else {
            $where .= " AND ( (',' || sources.tags || ',') LIKE :tag ) ";
        }
        $res = \F3::get('db')->exec( $select . $where,
            array(':tag' => "%,".$tag.",%"));
        return $res[0]['amount'];
    }

    
    /**
     * returns the amount of unread entries in database per source
     *
     * @return int amount of entries in database per tag
     */
    public function numberOfUnreadForSource($sourceid) {
        $res = \F3::get('db')->exec(
            'SELECT count(*) AS amount FROM items WHERE source=:source AND unread=1',
            array(':source' => $sourceid));
        return $res[0]['amount'];
    }

}
