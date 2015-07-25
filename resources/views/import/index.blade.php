@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
    @include('import/toolbar')
@stop




@section('main')
<div class="card">
    {!! Form::open($formAction) !!}

    <div class="card-body">
        {!! Form::file('xml', ['class' => 'btn']) !!}<br><br>
    </div>

    <div class="card-footer">
        {!! Form::submit('Next', ['class' => 'btn']) !!}
    </div>

    {!! Form::close() !!}
</div>
@stop
