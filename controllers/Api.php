<?PHP

namespace controllers;

/**
 * Controller for sources handling
 *
 * @package    controllers
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Tobias Zeising <tobias.zeising@aditu.de>
 */
class Api extends BaseController {

    /**
     * login for api json access
     *
     * @return void
     */
    public function login() {
        $view = new \helpers\View();
        if(\F3::get('auth')->isLoggedin()==true)
            $view->jsonSuccess(array('success' => true));

        $username = isset($_POST["username"]) ? $_POST["username"] : '';
        $password = isset($_POST["password"]) ? $_POST["password"] : '';

        if(\F3::get('auth')->login($username,$password)==true)
            $view->jsonSuccess(array('success' => true));

        $view->jsonSuccess(array('success' => false));
    }


    /**
     * logout for api json access
     *
     * @return void
     */
    public function logout() {
        $view = new \helpers\View();
        \F3::get('auth')->logout();
        $view->jsonSuccess(array('success' => true));
    }


}