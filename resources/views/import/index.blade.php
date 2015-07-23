@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
    @include('import/toolbar')
@stop




@section('main')
<div class="mdl-card mdl-shadow--2dp demo-card-wide mdl-cell mdl-cell--12-col">
    {!! Form::open($formAction) !!}

    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Import</h2>
    </div>
    <div class="mdl-card__supporting-text">

        {!! Form::file('xml', ['class' => 'mdl-button mdl-button--colored']) !!}<br><br>
    </div>

    <div class="mdl-card__actions mdl-card--border">
        {!! Form::submit('Next',
            ['class' => 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'])
        !!}
    </div>

    {!! Form::close() !!}
</div>
@stop
