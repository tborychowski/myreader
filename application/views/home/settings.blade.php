@layout('master')
@section('content')

<span class="logo"><i class="icon-rss"></i> myreader</span>
<div class="main-logo"><i class="icon-rss"></i></div>

<div id="toolbar">
	<button class="btn" data-action="add"><i class="icon-plus"></i> Add Source</button><br>
	<button class="btn" data-action="back"><i class="icon-arrow-left"></i> Back</button>
</div>

<div id="sidebar">here be settings</div>

<div id="content" class="main-content settings"></div>

@endsection