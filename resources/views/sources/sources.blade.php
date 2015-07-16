@extends('app')

@section('body-class')sources @stop

@section('sidebar')
@include('sources/source-sidebar')
@stop




@section('main')

    <h1>Sources</h1>
    <a href="{{ url('source/create') }}" class="btn btn-add">Add</a>

    @if (count($sources))
    <ul class="sources-list">
        @foreach ($sources as $src)
        <li class="sources-li"><a href="{{ url('source/' . $src->id . '/edit') }}">{{ $src->name }}</a></li>
        @endforeach
    </ul>

    @else
        <h4>You have no sources!</h4>
    @endif

@stop
