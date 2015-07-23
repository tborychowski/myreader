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

    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Confirm Import</h2>
    </div>

    <div class="mdl-card__supporting-text">

        <table class="sources-table mdl-data-table mdl-js-data-table
            mdl-cell mdl-cell--12-col">
        <thead>
            <tr>
                <th class="mdl-data-table__cell--non-numeric">Name</th>
                <th class="mdl-data-table__cell--non-numeric">URL</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach($sources as $src)
            <tr>
                <td class="mdl-data-table__cell--non-numeric">
                    <a href="{{ $src['real_url'] }}">{{ $src['name'] }}</a>
                </td>
                <td class="mdl-data-table__cell--non-numeric">
                    <a href="{{ $src['url'] }}">{{ $src['url'] }}</a>
                </td>
                <td class="table-action-cell"></td>
            </tr>
            @endforeach
        </tbody>
        </table>
        <br>

    </div>

    <div class="mdl-card__actions mdl-card--border">
        <a href="{{ url('/import-confirm') }}"
            class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Import these sources</a>
    </div>

</div>
@stop
