<!doctype html>
<html lang="en" class="login">
<meta charset="utf-8">
<title>MyReader</title>
{{Asset::styles()}}
<body>
{{Form::open()}}
	{{Form::label('username', 'Username')}}
	{{Form::text('username', null, array('autofocus'=>'true', 'autocomplete'=>'off'))}}
	{{Form::label('password', 'Password')}}
	{{Form::password('password')}}
	{{Form::hidden('remember', 'true')}}
	{{Form::button('submit')}}
{{Form::close()}}
<script>var App = App || {}; App.rootPath = '{{ URL::base() }}';</script>
{{Asset::scripts()}}
</body>
