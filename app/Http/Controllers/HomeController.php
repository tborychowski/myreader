<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;

class HomeController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth', []);
    }


    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $tree = $this->tree();
        return view('home/index', compact('tree'));
    }




    /**
     * Get source tree for sidebar
     */
    private function tree()
    {
        $user = User::first();
        $sources = $user->sources()->get(['id', 'name', 'folder', 'icon']);
        if ($sources) $sources = $sources->toArray();

        // process to tree
        $tree = [];
        foreach ($sources as $item) {
            if (empty($item['folder'])) $item['folder'] = 'Other';
            $f = $item['folder'];

            if (!isset($tree[$f])) {
                $tree[$f] = [
                    'id' => str_slug($f),
                    'name' => $f,
                    'items' => []
                ];
            }
            $tree[$f]['items'][] = $item;
        }

        return array_values($tree);
    }


}
