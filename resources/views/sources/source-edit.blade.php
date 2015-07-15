@extends('app')

@section('body-class')sources @stop




@section('sidebar')
<ul>
    <li>Update all Sources every 15 minutes
    <li>Remove Articles older than 60 days
</ul>
@stop




@section('main')

    <a href="{{ url('source') }}" class="btn btn-back">&laquo; back</a>
    <h1>Source</h1>

    {{-- <input value="{{ $source->name }}"/> --}}

    {!! Form::model($source, [
            'method' => 'PATCH',
            'action' => [ 'SourceViewController@update', $source->id ]
        ])
    !!}

    {!! Form::text('name') !!}
    {!! Form::text('url') !!}

    {!! Form::submit('Save') !!}
    {!! Form::close() !!}



@stop
