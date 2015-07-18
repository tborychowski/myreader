@extends('app')

@section('body-class')sources @stop

@section('sidebar')
@include('sources/source-sidebar')
@stop




@section('main')

    <a href="{{ url('source') }}" class="btn btn-back">&laquo; back</a>
    <h1>Import Sources</h1>

    @if (session()->has('source_names'))
        @foreach(session('source_names') as $src)
            {{ $src }}
        @endforeach
        <a href="{{ url('/source/confirmImport') }}" class="btn btn-add">Import these sources</a>
    @else
        {!! Form::open($formAction) !!}
        {!! Form::file('xml', ['class' => 'btn btn-add']) !!}<br><br>
        {!! Form::submit('Import', ['class' => 'btn btn-add']) !!}
        {!! Form::close() !!}
    @endif


@stop
