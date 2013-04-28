<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>MyReader</title>
{{Asset::styles()}}
<body class="login">
{{Form::open()}}
	{{Form::label('username', 'Username')}}
	{{Form::text('username', null, array('autofocus'=>'true', 'autocomplete'=>'off'))}}
	{{Form::label('password', 'Password')}}
	{{Form::password('password')}}
	{{Form::hidden('remember', 'true')}}
	{{Form::button('submit')}}
{{Form::close()}}
{{Asset::scripts()}}
</body>
