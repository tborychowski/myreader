@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
<div class="mdl-layout__header-row">
    <a href="{{ url('source') }}"
        class="settings-back-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
        <i class="material-icons">arrow_back</i>
    </a>

    <span class="mdl-layout-title">Import</span>

    <div class="mdl-layout-spacer"></div>

    <nav class="mdl-navigation"></nav>
</div>
@stop




@section('main')
<div class="mdl-card mdl-shadow--2dp demo-card-wide mdl-cell mdl-cell--12-col">
    @if (session()->has('source_names'))
        @include('sources/import-confirm')
    @else
        @include('sources/import-form')
    @endif
</div>
@stop
