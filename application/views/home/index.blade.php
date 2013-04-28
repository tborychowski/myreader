@layout('master')
@section('content')


<span class="logo"><i class="icon-rss"></i> myreader</span>
<div id="toolbar">
	<div class="pull-right">
	</div>
	<button class="btn pull-left" data-action="refresh"><i class="icon-repeat"></i></button>
	<button class="btn" data-action="prev"><i class="icon-chevron-up"></i></button>
	<button class="btn" data-action="next"><i class="icon-chevron-down"></i></button>
</div>

<div class="main-logo"><i class="icon-rss"></i></div>

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
			<li class="nav-btn nav-type nav-all" data-nav-type="type" data-action="all">
				<a href="#" class="nav-row stats-all">
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

	<div id="content"></div>

@endsection