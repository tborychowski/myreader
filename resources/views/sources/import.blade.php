@extends('app')

@section('body-class')sources @stop

@section('sidebar')
@include('sources/sidebar')
@stop




@section('main')
<div id="main">

    <h1>Import Sources</h1>

    @if (session()->has('source_names'))
        @foreach(session('source_names') as $src)
            {{ $src }}
        @endforeach
        <br>
        <a href="{{ url('/source/confirmImport') }}" class="btn btn-add">Import these sources</a>
    @else
        {!! Form::open($formAction) !!}
        {!! Form::file('xml', ['class' => 'btn btn-add']) !!}<br><br>
        {!! Form::submit('Next', ['class' => 'btn btn-add']) !!}
        {!! Form::close() !!}
    @endif
</div>


<div class="toolbar main-toolbar">
    <a href="{{ url('source') }}" class="btn btn-back">Cancel</a>

</div>

@stop
