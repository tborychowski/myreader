@extends('app')

@section('body-class')sources @stop

@section('sidebar')
@include('sources/sidebar')
@stop


@section('toolbar')
    <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">Manage Sources</span>

        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>

        <!-- Navigation. We hide it in small screens. -->
        <nav class="mdl-navigation mdl-layout--large-screen-only">

            <a href="{{ url('source/create') }}"
                id="btnAddNewSource"
                class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect">
                <i class="material-icons">add</i>
            </a>
            <div class="mdl-tooltip" for="btnAddNewSource">Add new source</div>

            <a href="{{ url('source/import') }}"
                id="btnImportSources"
                class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect">
                <i class="material-icons">backup</i>
            </a>
            <div class="mdl-tooltip" for="btnImportSources">Import sources from OPML file</div>

        </nav>
    </div>
@stop


@section('main')
    @if (count($sources))
    <table class="sources-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
    <thead>
        <tr>
            <th class="mdl-data-table__cell--non-numeric">Name</th>
            <th class="mdl-data-table__cell--non-numeric">URL</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        @foreach ($sources as $src)
        <tr>
            <td class="mdl-data-table__cell--non-numeric">
                <a href="{{ url('source/' . $src->id . '/edit') }}">
                    {{ $src->name }}
                </a>
            </td>
            <td class="mdl-data-table__cell--non-numeric">{{ $src->url }}</td>
            <td class="table-action-cell">
                <a href="{{ url('source/' . $src->id . '/edit') }}"
                    class="mdl-button mdl-js-button mdl-button--icon">
                    <i class="material-icons">arrow_forward</i>
                </a>
            </td>
        </tr>
        @endforeach
    </tbody>
    </table>

    @else
        <h4>You have no sources!</h4>
    @endif

@stop
