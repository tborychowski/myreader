@extends('app')

@section('body-class')home @stop


@section('toolbar')
    <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title"></span>


        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable
                    mdl-textfield--floating-label mdl-textfield--align-right">
            <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">
                <i class="material-icons">search</i>
            </label>
            <div class="mdl-textfield__expandable-holder">
                <input class="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp" />
            </div>
        </div>


        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>

        <!-- Navigation. We hide it in small screens. -->
        <nav class="mdl-navigation mdl-layout--large-screen-only">
            <a class="mdl-navigation__link" href="">Link</a>
            <a class="mdl-navigation__link" href="">Link</a>
            <a class="mdl-navigation__link" href="">Link</a>
            <a class="mdl-navigation__link" href="">Link</a>
        </nav>
    </div>
@stop



@section('sidebar')
    <span class="mdl-layout-title">MyReader
        <a href="{{ url('source') }}"
            class="settings-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
            <i class="material-icons">settings</i>
        </a>
    </span>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" href="">Link</a>
      <a class="mdl-navigation__link" href="">Link</a>
      <a class="mdl-navigation__link" href="">Link</a>
      <a class="mdl-navigation__link" href="">Link</a>
    </nav>

{{-- <div class="toolbar sidebar-toolbar">
    <a href="{{ url('/source') }}" class="btn btn-right" title="Settings"><i class="fa fa-cog"></i></a>
    <a href="{{ url('auth/logout') }}" class="btn" title="Logout"><i class="fa fa-sign-out"></i></a>
</div>
 --}}
@stop




@section('main')
articles
@stop
