<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">
<title>MyReader</title>
<link rel="shortcut icon" href="favicon.ico">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
{{Asset::styles()}}
</head>
<body>

@yield('content')

<script>var App = App || {}; App.rootPath = '{{ URL::base() }}';</script>
{{Asset::scripts()}}
</body>
</html>