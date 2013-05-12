@layout('master')
@section('content')

<div id="toolbar">
	<button class="btn pull-left" data-action="back"><i class="icon-arrow-left"></i> Back</button>
	<button class="btn" data-action="add"><i class="icon-plus"></i> Add Source</button>
</div>

<div id="sidebar">
	<span id="logo"><i class="icon-rss"></i> myreader</span>
</div>

<div id="content" class="main-content settings"></div>

@endsection