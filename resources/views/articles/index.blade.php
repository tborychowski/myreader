@foreach ($articles as $art)

<div class="card">
    <h2 class="card-title">{{ $art->title }}</h2>

    <div class="card-body">
        {{ $art->content }}
    </div>

    <div class="card-footer"></div>
</div>

@endforeach
