@extends('app')

@section('body-class')sources @stop

@section('sidebar')
@include('sources/sidebar')
@stop



@section('main')
<div id="main">
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
</div>

<div class="toolbar main-toolbar">
    <a href="{{ url('source') }}" class="btn btn-back">Cancel</a>

    @if ($delFormAction)
    {!! Form::open($delFormAction) !!}
    {!! Form::submit('Delete', ['class' => 'btn btn-del']) !!}
    {!! Form::close() !!}
    @endif
</div>

@stop
