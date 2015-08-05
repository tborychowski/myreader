<h3 class="sidebar-row source-folder label-unread">
    <a href="#unread" class="sidebar-link">
        <span class="source-badge">0</span>
        Unread
    </a>
</h3>

<h3 class="sidebar-row source-folder label-starred">
    <a href="#starred" class="sidebar-link">
        <span class="source-badge">0</span>
        Starred
    </a>
</h3>

<h3 class="sidebar-row source-folder label-archive">
    <a href="#archive" class="sidebar-link">Archive</a>
</h3>

<div class="source-tree">
    @foreach ($tree as $group)

        @if (count($group['items']))

            <h3 class="sidebar-row source-folder folder-{{ $group['id'] }}">
                <a href="#folder-{{ $group['id'] }}" class="sidebar-link">
                    {{ $group['name'] }}
                </a>
            </h3>

            <ul class="source-list">
                @foreach ($group['items'] as $item)
                    <li class="sidebar-row feed-{{ $item['id'] }}">
                        <a href="#feed-{{ $item['id'] }}" class="sidebar-link">
                            <span class="source-badge"></span>
                            {{ $item['name'] }}
                        </a>
                    </li>
                @endforeach
            </ul>

        @endif

    @endforeach
</div>
