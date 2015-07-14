<!doctype html>
<html lang="en" class="admin">
<meta charset="utf-8">
<title>MyReader</title>
{{Asset::styles()}}
<body>

	<div class="page">
		<h1>{{HTML::link_to_action('admin@logout', 'Logout', array(), array('class' => 'btn btn-logout'))}}MyReader Admin</h1>

		<div class="toaster">
			@if (Session::get('success'))
				<div class="toaster-msg toaster-success">{{ Session::get('success') }}</div>
			@endif

			@if (Session::get('error'))
				<div class="toaster-msg toaster-error">{{ Session::get('error') }}</div>
			@endif
		</div>

		<h2>Users</h2>

		<table class="users">
		<thead>
			<tr>
				<td class="td-id">ID</td>
				<td class="td-name">name</td>
				<td class="td-date">Created</td>
				<td class="td-date">Updated</td>
			</tr>
		</thead>
		<tbody>
			@foreach ($users as $user)
				<tr>
					<td class="td-id">{{$user->id}}</td>
					<td class="td-name">{{HTML::link('admin/user/' . $user->id, $user->email)}}</td>
					<td class="td-date">{{$user->created_at}}</td>
					<td class="td-date">{{$user->updated_at}}</td>
				</tr>
			@endforeach
		</tbody>
		</table>

		{{HTML::link('admin/user/0', '+ Add User', array('class' => 'btn btn-add'))}}
	</div>

</body>
