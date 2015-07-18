@extends('app')

@section('body-class')sources @stop

@section('sidebar')
@include('sources/source-sidebar')
@stop




@section('main')

    <a href="{{ url('source') }}" class="btn btn-back">&laquo; back</a>
    <h1>{{ $delFormAction ? 'Edit source' : 'Add new source' }}</h1>

    {!! Form::model($source, $formAction) !!}

    {!! Form::label('Name') !!}{!! Form::text('name') !!}<br>
    {!! Form::label('URL') !!}{!! Form::text('url') !!}<br>
    {!! Form::label('Folder') !!}{!! Form::text('folder') !!}<br>

    @if ($delFormAction)
        @if ($source->last_error)
        {!! Form::label('Last Error: ') !!}{{ $source->last_error }}<br>
        @endif
    {!! Form::label('Added: ') !!}{{ $source->created_at }}<br>
    @endif

    {!! Form::submit($delFormAction ? 'Save' : 'Add', ['class' => 'btn btn-add']) !!}
    {!! Form::close() !!}


    @if ($delFormAction)
    {!! Form::open($delFormAction) !!}
    {!! Form::submit('Delete', ['class' => 'btn btn-del']) !!}
    {!! Form::close() !!}
    @endif

@stop
