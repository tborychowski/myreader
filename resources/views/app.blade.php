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
    <link async rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body class="@yield('body-class')">

    <!-- Always shows a header, even in smaller screens. -->
    <div class="mdl-layout mdl-js-layout
            mdl-layout--fixed-drawer
            mdl-layout--overlay-drawer-button
            mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            @yield('toolbar')
        </header>

        <div class="mdl-layout__drawer">
            @yield('sidebar')
        </div>

        <main class="mdl-layout__content">
            <div class="page-content">@yield('main')</div>
        </main>
    </div>


{{--     <div id="sidebar">
    <span id="sideLogo"><i class="fa fa-rss"></i> myreader</span>
        @yield('sidebar')
    </div>

    @yield('main')
 --}}


    <script src="{{ url('assets/material.min.js') }}"></script>
    <script src="{{ url('assets/app.js') }}"></script>
    @if (App::isLocal())
    <script src="http://localhost:35729/livereload.js"></script>
    @endif
</body>
</html>
