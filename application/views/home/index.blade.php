@layout('master')
@section('content')


<div id="toolbar">
	<div class="btn-group pull-left status-buttons">
		<button class="btn btn-unread" data-action="unread">
			<i class="icon-eye-open"></i> <span class="badge">{{$stats['unread']}}</span>
		</button>
		<button class="btn btn-starred" data-action="starred">
			<i class="icon-star-empty"></i> <span class="badge">{{$stats['starred']}}</span>
		</button>
		<button class="btn btn-archive" data-action="archive">
			<i class="icon-inbox"></i> <span class="badge">{{$stats['all']}}</span>
		</button>
	</div>

	<button class="btn pull-right" data-action="next"><i class="icon-chevron-down"></i></button>
	<button class="btn pull-right" data-action="prev"><i class="icon-chevron-up"></i></button>
	<button class="btn pull-right" data-action="refresh"><i class="icon-repeat"></i></button>
</div>

<div id="sidebar">
	<div class="sidebar-wrapper">
		<ul class="nav-list sidebar-sources">
			<li class="nav-header nav-btn active">
				<a href="#" class="nav-row">
					<span class="badge">{{$stats['unread']}}</span>
					<span class="nav-name nav-btn">Unread</span>
				</a>
			</li>

			@foreach ($tree as $tag)
				<li class="nav-tag nav-btn nav-{{$tag['name']}}" data-nav-type="tag" data-action="{{$tag['name']}}">
					<a href="#" class="nav-row"><span class="nav-name">{{$tag['name']}}</span></a>
				</li>

				@foreach ($tag['items'] as $src)
					<li class="nav-source nav-btn nav-{{ $src['id'] }}" data-nav-type="src" data-action="{{ $src['id'] }}">
						<a href="#" class="nav-row">
							<span class="no-badge">@if ($src['unread']) {{ $src['unread'] }} @endif</span>
							<span class="nav-icon">
								@if ($src['icon']) <img src="../storage/favicons/{{ $src['id'] }}.png">
								@else <i class="icon-rss"></i>
								@endif
							</span>
							<span class="nav-name">{{ $src['name'] }}</span>
						</a>
					</li>
				@endforeach

			@endforeach
		</ul>
	</div>

	<div id="sideToolbar">
		<button class="btn pull-right" data-action="settings"><i class="icon-cog"></i></button>
		<button class="btn pull-left" data-action="logout"><i class="icon-signout"></i></button>
	</div>

</div>

<div id="content" class="main-content unreaditems"></div>

@endsection