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

    <span class="mdl-layout-title">{{ $delFormAction ? 'Edit source' : 'Add new source' }}</span>

    <div class="mdl-layout-spacer"></div>

    <nav class="mdl-navigation">
        @if ($delFormAction)

        {!! Form::open($delFormAction) !!}

        {{-- {!! Form::submit('', ['class' => '']) !!} --}}
        <button type="submit" id="btnDeleteSource"
            class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--accent">
            <i class="material-icons">delete</i>
        </button>

        {!! Form::close() !!}

        @endif

        <div class="mdl-tooltip" for="btnDeleteSource">Delete source</div>
    </nav>
</div>
@stop


@section('main')
<div class="mdl-card mdl-shadow--2dp demo-card-wide mdl-cell mdl-cell--12-col">
    {!! Form::model($source, $formAction) !!}

    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Edit</h2>
    </div>
    <div class="mdl-card__supporting-text">

        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
            {!! Form::text('name', null, ['class' => 'mdl-textfield__input', 'id' => 'source-name']) !!}
            <label class="mdl-textfield__label" for="source-name">Name</label>
        </div>
        <br>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
            {!! Form::text('url', null, ['class' => 'mdl-textfield__input', 'id' => 'source-url']) !!}
            <label class="mdl-textfield__label" for="source-url">URL</label>
        </div>
        <br>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
            {!! Form::text('folder', null, ['class' => 'mdl-textfield__input', 'id' => 'source-folder']) !!}
            <label class="mdl-textfield__label" for="source-folder">Folder</label>
        </div>
        <br>

        <div class="mdl-card__menu">
            @if ($delFormAction)
                @if ($source->last_error)
                {!! Form::label('Last Error: ') !!}{{ $source->last_error }}<br>
                @endif
                {!! Form::label('Added: ') !!}{{ $source->created_at }}<br>
            @endif
        </div>

    </div>

    <div class="mdl-card__actions mdl-card--border">
        {!! Form::submit($delFormAction ? 'Save' : 'Add Source',
            ['class' => 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'])
        !!}
    </div>

    {!! Form::close() !!}
</div>



@stop
