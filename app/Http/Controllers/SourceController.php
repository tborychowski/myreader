<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use App\Source;
use Request;
use Session;

class SourceController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $user = User::first();
        $sources = $user->sources()->get();

        Session::forget('sources');

        return view('sources/index', compact('sources'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $source = User::first()->sources()->find($id);
        return view('sources/create', compact('source'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        $source = new Source;
        $formAction = ['method' => 'POST', 'action' => ['SourceController@store']];
        $delFormAction = null;
        return view('sources/create', compact('source', 'formAction', 'delFormAction'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $source = User::first()->sources()->find($id);
        $formAction = ['method' => 'PATCH', 'action' => ['SourceController@update', $source->id]];
        $delFormAction = [
            'method' => 'DELETE',
            'action' => ['SourceController@destroy', $source->id],
            'onSubmit' => 'return confirm("Are you sure?")'
        ];
        return view('sources/create', compact('source', 'formAction', 'delFormAction'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $user = User::first();
        $user->sources()->create(Request::all());
        return redirect('/source');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $source = Source::findOrFail($id);
        $source->update(Request::all());
        return redirect('/source');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $source = Source::findOrFail($id);
        $source->delete();
        return redirect('/source');
    }




    /**
     * Get source tree for sidebar
     */
    // public function tree()
    // {
    //     $user = User::first();
    //     $sources = $user->sources()->get(['id', 'name', 'folder', 'icon']);
    //     if ($sources) $sources = $sources->toArray();

    //     // process to tree
    //     $tree = [];
    //     foreach ($sources as $item) {
    //         if (empty($item['folder'])) $item['folder'] = 'Other';
    //         $f = $item['folder'];
    //         // $f = (empty($item['folder']) ? 'Other' : $item['folder']);

    //         if (!isset($tree[$f])) $tree[$f] = [ 'name' => $f, 'items' => []];
    //         $tree[$f]['items'][] = $item;
    //     }

    //     $tree = array_values($tree);
    //     return $tree;

    //     // if (str_contains(Request::header('Content-Type'), 'application/json')) {
    //     //     return $tree;
    //     // }
    //     // return view('sources/tree', compact('tree'));
    // }
}
