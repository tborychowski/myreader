<div class="source-tree">
    @foreach ($tree as $group)

        @if (count($group['items']))

            <h3 class="source-folder">{{ $group['name'] }}</h3>

            <ul class="source-list">
                @foreach ($group['items'] as $item)
                    <li class="source-item source-{{ $item['id'] }}">
                        <span class="source-badge"></span>
                        {{ $item['name'] }}
                    </li>
                @endforeach
            </ul>

        @endif

    @endforeach
</div>
