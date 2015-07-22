@if (count($sources))
<table class="sources-table mdl-data-table mdl-js-data-table mdl-shadow--2dp
    mdl-cell mdl-cell--12-col">
<thead>
    <tr>
        <th class="mdl-data-table__cell--non-numeric">Name</th>
        <th class="mdl-data-table__cell--non-numeric">URL</th>
        <th></th>
    </tr>
</thead>
<tbody>
    @foreach ($sources as $src)
    <tr>
        <td class="mdl-data-table__cell--non-numeric">
            <a href="{{ $src->real_url }}">{{ $src->name }}</a>
        </td>

        <td class="mdl-data-table__cell--non-numeric">
            <a href="{{ $src->url }}">{{ $src->url }}</a>
        </td>

        <td class="table-action-cell">
            <a href="{{ url('source/' . $src->id . '/edit') }}"
                class="mdl-button mdl-js-button mdl-button--icon">
                <i class="material-icons">arrow_forward</i>
            </a>
        </td>
    </tr>
    @endforeach
</tbody>
</table>

@else
    <h4>You have no sources!</h4>
@endif
