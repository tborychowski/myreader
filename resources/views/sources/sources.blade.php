@extends('app')

@section('body-class')sources @stop




@section('sidebar')
<ul>
    <li>Update all Sources every 15 minutes
    <li>Remove Articles older than 60 days
</ul>
@stop




@section('main')

    <h1>Sources</h1>
    <button class="btn btn-add">Add</button>

    <div class="source-list"></div>


    @if (count($sources))
    <ul>
        @foreach ($sources as $src)
        <li><a href="source/{{ $src->id }}/edit">{{ $src->name }}</a></li>
        @endforeach
    </ul>

    @else
        <h4>You have no sources!</h4>
    @endif

@stop
