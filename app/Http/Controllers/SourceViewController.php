<?php

namespace App\Http\Controllers;


use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use App\Source;
use Request;

class SourceViewController extends Controller
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

        return view('sources/sources', compact('sources'));
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
        return view('sources/source', compact('source'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        $source = new Source;
        $formAction = ['method' => 'POST', 'action' => ['SourceViewController@store']];
        $delFormAction = null;
        return view('sources/source', compact('source', 'formAction', 'delFormAction'));
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
        $formAction = ['method' => 'PATCH', 'action' => ['SourceViewController@update', $source->id]];
        $delFormAction = [
            'method' => 'DELETE',
            'action' => ['SourceViewController@destroy', $source->id],
            'onSubmit' => 'return confirm("Are you sure?")'
        ];
        return view('sources/source', compact('source', 'formAction', 'delFormAction'));
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
}
