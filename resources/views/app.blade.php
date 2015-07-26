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
    <link rel="shortcut icon" href="{{ url('assets/home.png') }}">
    <link rel="stylesheet" href="{{ url('assets/app.css') }}">
</head>
<body class="@yield('body-class')">

    <div class="toolbar main-toolbar">
        @yield('toolbar')
    </div>

    <div class="sidebar">
        <span class="sidebar-logo">
            {{-- <i class="fa fa-rss"></i> myreader --}}
            <i class="icon ion-social-rss-outline"></i> myreader
        </span>
        @yield('sidebar')
    </div>

    <div class="main">
        @yield('main')
    </div>



    <script src="{{ url('assets/app.js') }}"></script>
    @if (App::isLocal())
    <script src="http://localhost:35729/livereload.js"></script>
    @endif

    {{-- <script async src="{{ url('assets/device.min.js') }}"></script> --}}
</body>
</html>
