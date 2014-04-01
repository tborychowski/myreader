<!doctype html>
<html lang="en" class="admin">
<meta charset="utf-8">
<title>MyReader</title>
{{Asset::styles()}}
<body>

	<div class="page">
		<h1>{{HTML::link_to_action('admin@logout', 'Logout', array(), array('class' => 'btn btn-logout'))}}MyReader Admin</h1>
		<h2>User</h2>

		{{$user->email}}

	</div>

</body>
