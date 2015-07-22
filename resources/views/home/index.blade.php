@extends('app')

@section('body-class')home @stop


@section('toolbar')
    @include('home/toolbar')
@stop


@section('sidebar')
    @include('home/sidebar')
@stop


@section('main')
    @include('home/main')
@stop
