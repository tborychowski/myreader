@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
    @include('sources/toolbar')
@stop


@section('main')
    @include('sources/list')
@stop
