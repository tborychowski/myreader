@extends('app')

@section('body-class')login @stop

@section('main')

<div class="login-form">
    <form method="POST" action="/auth/login">
        {!! csrf_field() !!}
        <input type="hidden" name="remember" value="true">

        <div class="form-row">
            <input type="text" name="email" value="{{ old('email') }}" autofocus="true">
        </div>

        <div class="form-row">
            <input type="password" name="password" id="password">
        </div>

        <div class="form-row">
            <button type="submit" class="success">Login</button>
        </div>
    </form>
</div>

@stop
