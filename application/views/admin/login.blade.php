<!doctype html>
<html lang="en" class="admin">
<meta charset="utf-8">
<title>MyReader</title>
{{Asset::styles()}}
<body>
{{Form::open(null, 'POST', array('class' => 'login-form')) }}
	{{Form::label('username', 'Username')}}
	{{Form::text('username', null, array('autofocus'=>'true', 'autocomplete'=>'off'))}}
	{{Form::label('password', 'Password')}}
	{{Form::password('password')}}
	{{Form::button('submit')}}
{{Form::close()}}
</body>
