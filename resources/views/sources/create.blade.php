@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
    @include('sources/toolbar-add')
@stop


@section('main')
<div class="card">
    {!! Form::model($source, $formAction) !!}

    <div class="card-header">
        <span class="card-date">
            @if ($delFormAction)
                @if ($source->last_error)
                Last Error: {{ $source->last_error }}<br>
                @endif
                Added: {{ $source->created_at }}
            @endif
        </span>
    </div>

    <div class="card-body">

        <div class="form-row">
            {!! Form::label('URL') !!}
            {!! Form::text('url', null, ['class' => 'long-input']) !!}
        </div>

        <div class="form-row">
            {!! Form::label('Name') !!}
            {!! Form::text('name', null, ['class' => 'long-input']) !!}
        </div>

        <div class="form-row">
            {!! Form::label('Folder') !!}
            {!! Form::text('folder', null, ['class' => 'long-input']) !!}
        </div>

    </div>

    <div class="card-footer">
        {!! Form::submit($delFormAction ? 'Save' : 'Add Source', ['class' => 'btn']) !!}
        <a href="{{ url('source ') }}" class="btn link">Cancel</a>
    </div>

    {!! Form::close() !!}
</div>



@stop
