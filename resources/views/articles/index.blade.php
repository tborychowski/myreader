@foreach ($articles as $art)

<div class="mdl-card mdl-shadow--2dp demo-card-wide mdl-cell mdl-cell--12-col">
    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">{{ $art->title }}</h2>
    </div>
    <div class="mdl-card__supporting-text">


        {{ $art->content }}


        <div class="mdl-card__menu">
        </div>

    </div>

    <div class="mdl-card__actions mdl-card--border">
    </div>

</div>

@endforeach
