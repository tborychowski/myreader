<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use App\Article;
use Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        // TODO: get articles per user

        $unread = Article::unread();
        $starred = Article::starred();

        $section = Request::get('section');
        if (empty($section)) $section = 'unread';

        if ($section === 'unread') {
            $items = $unread->orderBy('created_at', 'desc')->get();
        }

        if ($section === 'starred') {
            $items = $starred->orderBy('created_at', 'desc')->get();
        }

        $items = Article::orderBy('created_at', 'desc')->get();

        return [
            'unread' => $unread->count(),
            'starred' => $starred->count(),
            'items' => $items
        ];

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
