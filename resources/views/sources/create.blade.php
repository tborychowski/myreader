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
