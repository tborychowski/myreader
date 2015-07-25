@extends('app')

@section('body-class')sources @stop


@section('sidebar')
    @include('sources/sidebar')
@stop


@section('toolbar')
    @include('import/toolbar')
@stop


@section('main')
<div class="card">

    <div class="card-body">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>URL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sources as $src)
                <tr>
                    <td><a href="{{ $src['real_url'] }}">{{ $src['name'] }}</a></td>
                    <td><a href="{{ $src['url'] }}">{{ $src['url'] }}</a></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="card-footer">
        <a href="{{ url('/import-confirm') }}" class="btn">Import these sources</a>
    </div>

</div>
@stop
