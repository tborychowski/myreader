<span class="mdl-layout-title">Settings</span>

<div class="mdl-grid">
    <div class="mdl-cell mdl-cell--12-col">Update all Sources every</div>
    <div class="mdl-cell mdl-cell--4-col mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" type="text" id="updateInput" pattern="-?[0-9]*(\.[0-9]+)?" />
        <label class="mdl-textfield__label" for="updateInput">15</label>
        <span class="mdl-textfield__error">Input is not a number!</span>
    </div>
    <div class="mdl-cell mdl-cell--8-col" style="padding-top: 30px;">minutes</div>


    <div class="mdl-cell mdl-cell--12-col">Remove Articles older than</div>
    <div class="mdl-cell mdl-cell--4-col mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" type="text" id="cleanupInput" pattern="-?[0-9]*(\.[0-9]+)?" />
        <label class="mdl-textfield__label" for="cleanupInput">60</label>
        <span class="mdl-textfield__error">Input is not a number!</span>
    </div>
    <div class="mdl-cell mdl-cell--8-col" style="padding-top: 30px;">days</div>

</div>

<hr/>

<div class="mdl-grid">
    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">Update All</button>
</div>
