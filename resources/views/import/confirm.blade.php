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
        <table class="sources-table">
            <thead>
                <tr>
                    <th class="st-cell st-cell-header">Name</th>
                    <th class="st-cell st-cell-header">URL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sources as $src)
                <tr>
                    <td class="st-cell"><a href="{{ $src['real_url'] }}">{{ $src['name'] }}</a></td>
                    <td class="st-cell"><a href="{{ $src['url'] }}">{{ $src['url'] }}</a></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="card-footer">
        <a href="{{ url('/import-confirm') }}" class="btn">Import these sources</a>
        <a href="{{ url('source ') }}" class="btn link">Cancel</a>
    </div>

</div>
@stop
