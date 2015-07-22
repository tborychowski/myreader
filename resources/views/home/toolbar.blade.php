<div class="mdl-layout__header-row">
    <!-- Title -->
    <span class="mdl-layout-title"></span>

    <!-- Add spacer, to align navigation to the right -->
    <div class="mdl-layout-spacer"></div>


    <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable
                mdl-textfield--floating-label mdl-textfield--align-right">
        <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">
            <i class="material-icons">search</i>
        </label>
        <div class="mdl-textfield__expandable-holder">
            <input class="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp" />
        </div>
    </div>


    <!-- Navigation. We hide it in small screens. -->
    <nav class="mdl-navigation mdl-layout--large-screen-only">
        <button id="settings-button" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
            <i class="material-icons">more_vert</i>
        </button>
        <ul for="settings-button" class="mdl-menu mdl-js-menu mdl-menu--bottom-right mdl-js-ripple-effect">
{{--             <li class="mdl-menu__item mdl-js-ripple-effect" onclick="location.href='{{ url('source') }}'">
                Manage Sources</a></li>
 --}}
             <li class="mdl-menu__item mdl-js-ripple-effect" onclick="location.href='{{ url('source') }}'">
                Settings</li>
        </ul>
    </nav>
</div>
