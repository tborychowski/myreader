@layout('master')
@section('body_class')settings @endsection
@section('content')

<div id="main">
	<div id="mainLogo"><i class="icon-rss"></i></div>
	<div class="main-wrapper"></div>
</div>

<div id="sidebar">
	<span id="sideLogo"><i class="icon-rss"></i> myreader</span>

	<div class="sidebar-wrapper">
		<h3>Settings</h3>

		<label>Auto remove items older than (days):</label>
		<input type="text" value="30" class="autoclean" disabled="disabled">

		<label>Update all feeds</label>
		<button class="btn btn-update" data-action="update-all">
			<i class="icon-repeat"></i> <span>Update now</span>
		</button>
	</div>
</div>


<div id="toolbar">
	<div id="sideToolbar">
		<button class="btn pull-left" data-action="logout"><i class="icon-signout"></i></button>
	</div>

	<div id="mainToolbar">
		<button class="btn pull-left" data-action="back"><i class="icon-arrow-left"></i> Back</button>
		<button class="btn" data-action="add"><i class="icon-plus"></i> Add Source</button>
	</div>
</div>

@endsection