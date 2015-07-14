@extends('app')

@section('body-class')settings @stop




@section('sidebar')
<a href="{{ url('/') }}">Back to home<a>


@stop




@section('main')


<h1>Sources</h1>

@if (count($sources))
<ul>
    @foreach ($sources as $src)
    <li>{{ $src->name }}</li>
    @endforeach
</ul>
@else

    <h4>You have no sources!</h4>

@endif

@stop
