@layout('master')
@section('content')


<div id="toolbar">
	<button class="btn pull-left" data-action="settings"><i class="icon-cog"></i></button>
	<button class="btn" data-action="refresh"><i class="icon-repeat"></i></button>
	<button class="btn" data-action="prev"><i class="icon-chevron-up"></i></button>
	<button class="btn" data-action="next"><i class="icon-chevron-down"></i></button>
</div>

<div id="sidebar">
	<ul class="nav nav-list sidebar-list-stats">
		<li class="nav-btn nav-type nav-unread active" data-nav-type="type" data-action="unread">
			<a href="#" class="nav-row stats-unread">
				<span class="badge">0</span>
				<span class="nav-name">unread</span>
			</a>
		</li>
		<li class="nav-btn nav-type nav-starred" data-nav-type="type" data-action="starred">
			<a href="#" class="nav-row stats-starred">
				<span class="no-badge"></span>
				<span class="nav-name">starred</span>
			</a>
		</li>
		<li class="nav-btn nav-type nav-items" data-nav-type="type" data-action="items">
			<a href="#" class="nav-row stats-items">
				<span class="no-badge"></span>
				<span class="nav-name">all</span>
			</a>
		</li>
	</ul>
	<hr>

	<div class="sidebar-wrapper">
		<ul class="nav nav-list sidebar-list-sources"><li class="nav-header">Sources</li></ul>
	</div>
</div>

<div id="content" class="main-content unreaditems"></div>

@endsection