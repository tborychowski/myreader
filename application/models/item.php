<?php

class Item extends Eloquent {

	public static $rules = array( 'item_id'  => 'required|unique:items'	);

	public function source () {	return $this->belongs_to('Source');	}


	public static function stats ($user_id) {
		$unr = Item::where_user_id($user_id)->where_is_unread(1)->count();
		$star = Item::where_user_id($user_id)->where_is_starred(1)->count();
		$all = Item::where_user_id($user_id)->count();

		return [
			'unread' => $unr,
			'unreadStr' => static::formatCounter($unr),
			'starred' => $star,
			'starredStr' => static::formatCounter($star),
			'all' => $all,
			'allStr' => static::formatCounter($all)
		];
	}

	/**
	 * Retrieve unread counts in an object format (for sidebar feed tree)
	 * @return object  { id: unreadNumber }
	 */
	public static function get_unread_counts ($status = 'archive', $type = 'all', $id = '') {
		$items = Item::group_by('source_id')->where_user_id(Auth::user()->id);

		if ($type === 'tag' && isset($id)) {
			$tag = Source::where_tag($id)->first('id');
			if ($tag) $id = $tag->id;
		}
		if ($type !== 'all' && !empty($id)) $items = $items->where_source_id($id);

		if ($status === 'unread') $items = $items->where_is_unread(1);
		elseif ($status === 'starred') $items = $items->where_is_starred(1);

		$items = $items->get([ 'source_id AS id', DB::raw('count(items.id) AS unread') ]);

		$unreads = [];
		foreach ($items as $item) {
			if (!isset($unreads[$item->id])) $unreads[$item->id] = 0;
			$unreads[$item->id] += $item->unread;
		}

		return $unreads;
	}



	/**
	 * Retrieve items from the DB
	 * @param  array   $inp  input parameters
	 * @param  boolean $lim  should it limit to 20 items or take all
	 * @return array         filtered items
	 */
	public static function get ($inp, $limit = true) {
		$status = isset($inp['status']) ? $inp['status'] : 'archive';

		$pageSize = 20;
		$pageNo = 0;
		if (isset($inp['page'])) $pageNo = intval($inp['page']);

		if (isset($inp['tag']))     { $type = 'tag'; $id = $inp['tag']; }
		elseif (isset($inp['src'])) { $type = 'src'; $id = $inp['src']; }
		else                        { $type = 'all'; $id = ''; }


		$items = Item::with('source')->order_by('datetime', 'desc')->where_user_id(Auth::user()->id);

		if ($type === 'tag' && isset($id)) $ids = Source::where_tag($id)->lists('id');
		if ($type === 'src' && isset($id)) $ids = [ $id ];
		if ($type !== 'all' && !empty($ids)) $items = $items->where_in('source_id', $ids);

		if ($status === 'unread') $items = $items->where_is_unread(1);
		elseif ($status === 'starred') $items = $items->where_is_starred(1);

		if ($limit === false) return $items;

		$items = $items->skip($pageSize * $pageNo)->take($pageSize);

		if (method_exists($items, 'all')) $items = $items->all();
		else $items = $items->get();

		return array_map(function ($item) {
			unset($item->source->user_id, $item->source->created_at, $item->source->updated_at);
			$time = strtotime($item->datetime);
			$format = 'G:i';
			if (date('Y', $time) == date('Y')) {
				if (date('n', $time) == date('n') && date('j', $time) == date('j')) $format = 'Today, G:i';
				if (date('W', $time) == date('W')) $format = 'D, G:i';
				else $format = 'D, j M G:i';
			}
			else $format = 'D, j M Y G:i';

			$item->datetime = date($format, $time);
			return $item;
		}, $items);
	}



	/**
	 * Add items from "update" route
	 * @param array $item item data
	 * @return int 1 if success, 0 if error
	 */
	public static function add ($item) {
		if (!$item) return;
		$validation = Validator::make($item, static::$rules);
		if ($validation->fails()) return 0;
		return Item::create($item) ? 1 : 0;
	}


	public static function update ($id = null, $input) {
		if (!$id) return JSON::error('Item ID is missing');

		$item = Item::find($id);
		if (!$item) return JSON::error('Item not found');
		if ($item->user_id != Auth::user()->id) return JSON::error('Access denied!');

		if (isset($input->is_unread)) $item->is_unread = $input->is_unread;
		if (isset($input->is_starred)) $item->is_starred = $input->is_starred;
		$item->save();

		return JSON::success('Item was updated');
	}

	public static function update_all ($items, $input) {
		if (!$items) return JSON::error('Items not found');

		if (isset($input->is_unread)) $items->update([ 'is_unread' => $input->is_unread ]);
		if (isset($input->is_starred)) $items->update([ 'is_starred' => $input->is_starred ]);

		return JSON::success('Items were updated');
	}


	public static function del ($id = null) {
		if (!$id) return JSON::error('Item ID is missing');

		$item = Item::find($id);
		if (!$item) return JSON::error('Item not found');
		if ($item->user_id != Auth::user()->id) return JSON::error('Access denied!');

		$item->delete();
		return JSON::success('Item was removed');
	}




	private static function formatCounter ($num) {
		if ($num >= 1000000) return (round($num / 100000) / 10) . 'm';
		if ($num >= 1000) return (round($num / 100) / 10) . 'k';
		return $num;
	}

}
