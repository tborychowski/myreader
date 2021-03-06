<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-touch-fullscreen" content="yes">
<title>MyReader @yield('title')</title>
<link rel="shortcut icon" href="favicon.ico">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
{{Asset::styles()}}
</head>
<body class="@yield('body_class')">

@yield('content')

<script>var App = App || {}; App.rootPath = '{{ URL::base() }}';</script>
{{Asset::scripts()}}
</body>
</html>