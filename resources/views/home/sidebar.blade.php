<h3 class="sidebar-row source-folder label-unread active"><a href="#unread">
    <span class="source-badge">0</span>
    Unread
</a></h3>

<h3 class="sidebar-row source-folder label-starred"><a href="#starred">
    <span class="source-badge">0</span>
    Starred
</a></h3>

<h3 class="sidebar-row source-folder label-all"><a href="#all">All</a></h3>

<div class="source-tree">
    @foreach ($tree as $group)

        @if (count($group['items']))

            <h3 class="sidebar-row source-folder">
                <a href="#feed-{{ $group['id'] }}">
                    {{ $group['name'] }}
                </a>
            </h3>

            <ul class="source-list">
                @foreach ($group['items'] as $item)
                    <li class="sidebar-row source-item source-{{ $item['id'] }}">
                        <a href="#source-{{ $item['id'] }}">
                            <span class="source-badge"></span>
                            {{ $item['name'] }}
                        </a>
                    </li>
                @endforeach
            </ul>

        @endif

    @endforeach
</div>
