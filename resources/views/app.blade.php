<!DOCTYPE html>
<html lang="en">
<head>
    <title>MyReader</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="cleartype" content="on">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="MyReader">
    <link rel="apple-touch-icon-precomposed" href="assets/home.png">
    <link rel="shortcut icon" href="assets/home.png">
    <link rel="stylesheet" href="assets/app.css">
</head>
<body class="@yield('body-class')">

    <div id="sidebar">
        @yield('sidebar')
    </div>

    <div id="main">
        @yield('main')
    </div>

    <script src="assets/app.js"></script>
    @if (App::isLocal())
    {{-- <script async src="http://localhost:35729/livereload.js"></script> --}}
    @endif
</body>
</html>
