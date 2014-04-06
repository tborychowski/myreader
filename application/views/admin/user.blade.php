<!doctype html>
<html lang="en" class="admin">
<meta charset="utf-8">
<title>MyReader</title>
{{Asset::styles()}}
<body>

	<div class="page">
		<h1>{{HTML::link_to_action('admin@logout', 'Logout', array(), array('class' => 'btn btn-logout'))}}MyReader Admin</h1>
		<h2>User</h2>

		<div class="toaster">
			@if (Session::get('success'))
				<div class="toaster-msg toaster-success">{{ Session::get('success') }}</div>
			@endif
			@if (Session::get('error'))
				<div class="toaster-msg toaster-error">{{ Session::get('error') }}</div>
			@endif
			@if (is_array($errors) && count($errors) > 0)
				@foreach ($errors as $error)
					@foreach ($error as $e) <div class="toaster-msg toaster-error">{{$e}}</div> @endforeach
				@endforeach
			@endif
		</div>


		{{Form::open('admin/user/' . $user->id, 'POST', array('class' => 'user-form')) }}
			{{Form::label('email', 'Login')}}
			{{Form::text('email', $user->email, array('autofocus'=>'true', 'autocomplete'=>'off'))}}

			{{Form::label('password', 'Password')}}
			{{Form::text('password')}}

			{{Form::button('Save', array('class' => 'btn btn-save'))}}
			{{HTML::link_to_action('admin@index', 'Cancel', array(), array('class' => 'btn btn-cancel'))}}
		{{Form::close()}}
		<br><br>

		@if ($user->id)
			{{HTML::link_to_action('admin@user_delete', 'Delete', array($user->id), array('class' => 'btn btn-del'))}} <small>(Please be careful! There is no confirmation!)</small>
		@endif
	</div>

</body>
