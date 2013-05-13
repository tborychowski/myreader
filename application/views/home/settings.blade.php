@layout('master')
@section('content')

<div id="main" class="settings">
	<div id="mainLogo"><i class="icon-rss"></i></div>
	<div class="main-wrapper"></div>
</div>

<div id="sidebar">
	<span id="sideLogo"><i class="icon-rss"></i> myreader</span>
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