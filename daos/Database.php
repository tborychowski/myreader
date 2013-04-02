<?PHP

namespace daos;
    
/**
 * Base class for database access
 *
 * @package    daos
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Harald Lapp <harald.lapp@gmail.com>
 * @author     Tobias Zeising <tobias.zeising@aditu.de>
 */
class Database {
    /**
     * Instance of backend specific database access class
     *
     * @var     object
     */
    private $backend = null;
    
    
    /**
     * establish connection and
     * create undefined tables
     *
     * @return void
     */
    public function __construct() {
        $class = 'daos\\' . \F3::get('db_type') . '\\Database';
        $this->backend = new $class();
    }
    
    
    /**
     * optimize database by database own optimize statement
     *
     * @return  void
     */
    public function optimize() {
        $this->backend->optimize();
    }
}
