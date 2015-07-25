@if (count($sources))
<table class="sources-table">
<thead>
    <tr>
        <th></th>
        <th>Name</th>
        <th>URL</th>
    </tr>
</thead>
<tbody>
    @foreach ($sources as $src)
    <tr>
        <td><a href="{{ url('source/' . $src->id . '/edit') }}"><i class="fa fa-pencil"></i></a></td>
        <td><a href="{{ $src->real_url }}">{{ $src->name }}</a></td>
        <td><a href="{{ $src->url }}">{{ $src->url }}</a></td>
    </tr>
    @endforeach
</tbody>
</table>

@else
    <h4>You have no sources!</h4>
@endif
