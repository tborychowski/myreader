<h3 class="sidebar-row source-folder label-unread">
    <a href="#unread" class="sidebar-link" data-section="unread">
        <span class="badge">0</span>
        Unread
    </a>
</h3>

<h3 class="sidebar-row source-folder label-starred">
    <a href="#starred" class="sidebar-link" data-section="starred">
        <span class="badge">0</span>
        Starred
    </a>
</h3>

<h3 class="sidebar-row source-folder label-archived">
    <a href="#archived" class="sidebar-link" data-section="archived">Archived</a>
</h3>

<div class="source-tree">
    @foreach ($tree as $group)

        @if (count($group['items']))

            <h3 class="sidebar-row source-folder folder-{{ $group['id'] }}">
                <a class="sidebar-link"
                    href="#/{{ $group['id'] }}"
                    data-folder="{{ $group['id'] }}">

                    {{ $group['name'] }}
                </a>
            </h3>

            <ul class="source-list">
                @foreach ($group['items'] as $item)
                    <li class="sidebar-row feed-{{ $item['id'] }}">
                        <a class="sidebar-link"
                            href="#/{{ $item['folder'] }}/{{ $item['id'] }}"
                            data-folder="{{ $item['folder'] }}"
                            data-id="{{ $item['id'] }}">

                            <span class="badge"></span>
                            {{ $item['name'] }}
                        </a>
                    </li>
                @endforeach
            </ul>

        @endif

    @endforeach
</div>
