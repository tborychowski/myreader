@extends('app')

@section('body-class')home @stop




@section('sidebar')

<div class="sidebar-toolbar">
    <a href="{{ url('/source') }}" class="btn btn-right" title="Settings"><i class="fa fa-cog"></i></a>
    <a href="{{ url('auth/logout') }}" class="btn" title="Logout"><i class="fa fa-sign-out"></i></a>
</div>

@stop




@section('main')

articles

@stop
