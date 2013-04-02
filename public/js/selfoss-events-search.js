/**
 * initialize search events
 */
selfoss.events.search = function() {

    var executeSearch = function(term) {
        // show words in top of the page
        var words = term.split(" ");
        $('#search-list').html('');
        $.each(words, function(index, item) {
            $('#search-list').append('<li>' + item + '</li>');
        });
        
        // execute search
        $('#search').removeClass('active');
        selfoss.filter.search = term;
        selfoss.reloadList();
        
        if(term=="")
            $('#search-list').hide();
        else
            $('#search-list').show();
    }
    
    // search button shows search input or executes search
    $('#search-button').unbind('click').click(function () {
        if($('#search').hasClass('active')==false) {
            $('#search').addClass('active');
            $('#search-term').focus();
            return;
        }
        executeSearch($('#search-term').val());
    });
    
    // navigation search button for mobile navigation
    $('#nav-search-button').unbind('click').click(function () {
        executeSearch($('#nav-search-term').val());
        $('#nav-mobile-settings').click();
    });
    
    // keypress enter in search inputfield
    $('#search-term').unbind('keypress').keypress(function(e) {
        if(e.which == 13)
            $('#search-button').click();
    });
    
    // search term list in top of the page
    $('#search-list li').unbind('click').click(function () {
        var term = $('#search-term').val();
        term = term.replace($(this).html(), "").split(" ");
        var newterm = "";
        $.each(term, function(index, item) {
            newterm = newterm + " " + $.trim(item);
        });
        newterm = $.trim(newterm);
        $('#search-term').val(newterm);
        executeSearch($('#search-term').val());
    });
    
    // remove button of search
    $('#search-remove').unbind('click').click(function () {
        if(selfoss.filter.search=='') {
            $('#search').removeClass('active');
            return;
        }
        
        selfoss.filter.offset = 0;
        selfoss.filter.search = '';
        $('#search-list').hide();
        $('#search-list').html('');
        $('#search').removeClass('active');
        selfoss.reloadList();
    });
};