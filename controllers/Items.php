<?PHP

namespace controllers;

/**
 * Controller for item handling
 *
 * @package    controllers
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Tobias Zeising <tobias.zeising@aditu.de>
 */
class Items extends BaseController {

	/**
	 * mark items as read
	 *
	 * @return void
	 */
	public function mark() {
		if(\F3::get('PARAMS["item"]')!=null) $lastid = \F3::get('PARAMS["item"]');
		else if(isset($_POST['ids'])) $lastid = $_POST['ids'];

		$itemDao = new \daos\Items();

		if (!$itemDao->isValid('id', $lastid)) $this->view->error('invalid id');

		$itemDao->mark($lastid);

		// get new tag list with updated count values
		// $tagController = new \controllers\Tags();
		//$renderedTags = $tagController->tagsListAsString();

		// get new sources list
		// $sourcesController = new \controllers\Sources();
		// $renderedSources = $sourcesController->sourcesListAsString();

		header('Content-type: application/json');
		$this->view->jsonSuccess(array( 'success' => true ));
	}


	/**
	 * mark items as unread
	 *
	 * @return void
	 */
	public function unmark() {
		$lastid = \F3::get('PARAMS["item"]');

		$itemDao = new \daos\Items();

		if (!$itemDao->isValid('id', $lastid)) $this->view->error('invalid id');

		$itemDao->unmark($lastid);
		header('Content-type: application/json');
		$this->view->jsonSuccess(array('success' => true));
	}


	/**
	 * starr item
	 *
	 * @return void
	 */
	public function starr() {
		$id = \F3::get('PARAMS["item"]');

		$itemDao = new \daos\Items();

		if (!$itemDao->isValid('id', $id)) $this->view->error('invalid id');

		$itemDao->starr($id);
		header('Content-type: application/json');
		$this->view->jsonSuccess(array('success' => true));
	}


	/**
	 * unstarr item
	 *
	 * @return void
	 */
	public function unstarr() {
		$id = \F3::get('PARAMS["item"]');

		$itemDao = new \daos\Items();

		if (!$itemDao->isValid('id', $id)) $this->view->error('invalid id');

		$itemDao->unstarr($id);
		header('Content-type: application/json');
		$this->view->jsonSuccess(array('success' => true));
	}


	/**
	 * update feeds
	 *
	 * @return void
	 */
	public function update() {
		$loader = new \helpers\ContentLoader();
		$loader->update();
		echo "finished";
	}


	/**
	 * returns current stats
	 *
	 * @return void
	 */
	public function stats() {
		$itemsDao = new \daos\Items();
		$return = array(
			'all'     => $itemsDao->numberOfItems(),
			'unread'  => $itemsDao->numberOfUnread(),
			'starred' => $itemsDao->numberOfStarred()
		);
		header('Content-type: application/json');
		$this->view->jsonSuccess($return);
	}



	/**
	 * returns items as json string
	 *
	 * @return void
	 */
	public function items() {
		$options = array();
		if(count($_REQUEST)>0) $options = $_REQUEST;
		$options['offset'] = isset($options['offset']) ? (int)($options['offset']) : 0;
		$options['items'] = isset($options['items']) ? (int)($options['items']) : \F3::get('items_perpage');

		if (isset($options['unread'])) $options['type'] = 'unread';
		else if (isset($options['starred'])) $options['type'] = 'starred';

		// $options['unread'] = isset($options['unread']) ? $options['unread']=="true" : false;
		// $options['starred'] = isset($options['starred']) ? $options['starred']=="true" : false;

		$itemDao = new \daos\Items();
		$items = $itemDao->get($options);

		$tagsDao = new \daos\Tags();
		$tags = $tagsDao->get();
		$tagColors = array();
		foreach($tags as $tag) $tagColors[$tag['tag']] = $tag['color'];
		$viewHelper = new \helpers\ViewHelper();


		if (isset($options['ids']) && is_array($options['ids'])) {
			$itemsWithoutIds = array();
			for($i=0; $i<count($options['ids']); $i++) {
				$options['ids'][$i] = (int)$options['ids'][$i];
			}
			foreach ($items as $item) {
				if (in_array($item['id'], $options['ids']) === false) $itemsWithoutIds[] = $item;
			}
			$items = $itemsWithoutIds;
		}

		for ($i=0; $i < count($items); $i++) {
			// parse tags and assign tag colors
			$itemsTags = explode(',', $items[$i]['tags']);
			$items[$i]['tags'] = [];
			foreach($itemsTags as $tag) {
				$tag = trim($tag);
				if (strlen($tag) > 0 && isset($tagColors[$tag])) $items[$i]['tags'][$tag] = $tagColors[$tag];
			}
			$items[$i]['date'] = $viewHelper->dateago($items[$i]['datetime']);
		}

		header('Content-type: application/json');
		$this->view->jsonSuccess($items);
	}


	/**
	 * returns current stats
	 *
	 * @return void
	 */
	public function notifier() {
		$itemsDao = new \daos\Items();
		header('Content-type: application/json');
		//$this->view->jsonSuccess($arr);
		echo '{ "unread": '.  $itemsDao->numberOfUnread() .' }';
	}
}
