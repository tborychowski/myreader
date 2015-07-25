@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
    <a class="btn" href="{{ url('source ') }}"><i class="fa fa-arrow-left"></i></a>

    <h1 class="title">{{ $delFormAction ? 'Edit source' : 'Add new source' }}</h1>

    @if ($delFormAction)
        {!! Form::open($delFormAction) !!}
            <button type="submit" class="btn btn-right" title="Delete source">
            <i class="fa fa-trash"></i></button>
        {!! Form::close() !!}
    @endif
@stop


@section('main')
<div class="card">
    {!! Form::model($source, $formAction) !!}

    <div class="card-body">

        <div class="">
            {!! Form::label('Name') !!}
            {!! Form::text('name', null, ['class' => '']) !!}
        </div>

        <div class="">
            {!! Form::label('URL') !!}
            {!! Form::text('url', null, ['class' => '']) !!}
        </div>

        <div class="">
            {!! Form::label('Folder') !!}
            {!! Form::text('folder', null, ['class' => '']) !!}
        </div>

        <div class="card-menu">
            @if ($delFormAction)
                @if ($source->last_error)
                {!! Form::label('Last Error: ') !!}{{ $source->last_error }}<br>
                @endif
                {!! Form::label('Added: ') !!}{{ $source->created_at }}<br>
            @endif
        </div>

    </div>

    <div class="card-footer">
        {!! Form::submit($delFormAction ? 'Save' : 'Add Source', ['class' => 'btn']) !!}
    </div>

    {!! Form::close() !!}
</div>



@stop
