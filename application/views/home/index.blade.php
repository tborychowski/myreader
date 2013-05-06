@layout('master')
@section('content')


<div id="toolbar">
	<button class="btn pull-left" data-action="settings"><i class="icon-cog"></i></button>

	<div class="btn-group pull-left status-buttons">
		<button class="btn btn-unread" data-action="unread"><i class="icon-eye-open"></i> <span class="badge">0</span></button>
		<button class="btn btn-starred" data-action="starred"><i class="icon-star-empty"></i> <span class="badge">0</span></button>
		<button class="btn btn-archive" data-action="archive"><i class="icon-inbox"></i> <span class="badge">0</span></button>
	</div>

	<button class="btn pull-right" data-action="next"><i class="icon-chevron-down"></i></button>
	<button class="btn pull-right" data-action="prev"><i class="icon-chevron-up"></i></button>
	<button class="btn pull-right" data-action="refresh"><i class="icon-repeat"></i></button>
</div>

<div id="sidebar"><div class="sidebar-wrapper">
	<ul class="nav-list">
		<li class="nav-header nav-btn active">
			<a href="#" class="nav-row">
				<span class="badge">0</span>
				<span class="nav-name nav-btn">All Sources</span>
			</a>
		</li>
	</ul>
	<ul class="nav-list sidebar-sources"></ul>
</div></div>

<div id="content" class="main-content unreaditems"></div>

@endsection