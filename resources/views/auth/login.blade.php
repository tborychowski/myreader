@extends('app')

@section('body-class')login @stop

@section('main')

<div class="login-form">
    <form method="POST" action="/login">
        {!! csrf_field() !!}
        <input type="hidden" name="remember" value="true">

        <div class="form-row">
            <input type="text"
                name="email"
                placeholder="Username"
                value="{{ old('email') }}"
                autofocus="true">
        </div>

        <div class="form-row">
            <input type="password"
                name="password"
                placeholder="Password">
        </div>

        <div class="form-row">
            <button type="submit" class="success">Login</button>
        </div>
    </form>
</div>

@stop
