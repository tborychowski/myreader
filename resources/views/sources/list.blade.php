@if (count($sources))
<table class="sources-table">
<thead>
    <tr>
        <th class="st-cell st-cell-header">Name</th>
        <th class="st-cell st-cell-header">URL</th>
        <th class="st-cell st-cell-header"></th>
    </tr>
</thead>
<tbody>
    @foreach ($sources as $src)
    <tr>
        <td class="st-cell"><a href="{{ $src->real_url }}">{{ $src->name }}</a></td>
        <td class="st-cell">

            {{-- <i class="icon ion-alert-circled icon-right"></i> --}}

            <a href="{{ $src->url }}">{{ $src->url }}</a>
        </td>
        <td class="st-cell st-cell-action">
            <a href="{{ url('source/' . $src->id . '/edit') }}">
                {{-- <i class="fa fa-pencil"></i> --}}
                <i class="icon ion-ios-more"></i>
            </a>
        </td>
    </tr>
    @endforeach
</tbody>
</table>

@else
    <h4>You have no sources!</h4>
@endif
