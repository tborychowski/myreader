<?PHP

namespace daos\sqlite;

/**
 * Class for accessing persistent saved sources -- mysql
 *
 * @package    daos
 * @copyright  Copyright (c) Harald Lapp <harald.lapp@gmail.com>
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Harald Lapp <harald.lapp@gmail.com>
 * @author     Tobias Zeising <tobias.zeising@aditu.de>
 */
class Sources extends \daos\mysql\Sources {

    /**
     * add new source
     *
     * @return int new id
     * @param string $title
     * @param string $tags
     * @param string $spout the source type
     * @param mixed $params depends from spout
     */
    public function add($title, $tags, $spout, $params) {
        \F3::get('db')->exec('INSERT INTO sources (title, tags, spout, params) VALUES (:title, :tags, :spout, :params)',
                    array(
                        ':title'  => $title,
                        ':tags'  => $tags,
                        ':spout'  => $spout,
                        ':params' => htmlentities(json_encode($params))
                    ));
        
        $res = \F3::get('db')->exec('SELECT last_insert_rowid() as lastid');
        return $res[0]['lastid'];
    }
}
