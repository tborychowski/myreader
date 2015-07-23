<div class="mdl-layout__header-row">
    <a href="{{ url('/') }}"
        class="settings-back-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
        <i class="material-icons">arrow_back</i>
    </a>

    <span class="mdl-layout-title">Manage Sources</span>

    <div class="mdl-layout-spacer"></div>

    <nav class="mdl-navigation">

        <a href="{{ url('source/create') }}"
            id="btnAddNewSource"
            class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect">
            <i class="material-icons">add</i>
        </a>
        <div class="mdl-tooltip" for="btnAddNewSource">Add new source</div>

        <a href="{{ url('import') }}"
            id="btnImportSources"
            class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect">
            <i class="material-icons">backup</i>
        </a>
        <div class="mdl-tooltip" for="btnImportSources">Import sources from OPML file</div>

    </nav>
</div>
