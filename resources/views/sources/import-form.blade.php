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
