/**
 * initialize events for entries
 */
selfoss.events.entries = function (e) {

    // show/hide entry
    var target = selfoss.isMobile() ? '.entry' : '.entry-title';
    $(target).unbind('click').click(function () {
        var parent = ((target === '.entry') ? $(this) : $(this).parent());

        if (selfoss.isSmartphone() === false) {
            $('.entry.selected').removeClass('selected');
            parent.addClass('selected');
        }

        // prevent event on fullscreen touch
        if (parent.hasClass('fullscreen')) return;

        var autoMarkAsRead = $('body').hasClass('auto_mark_as_read') && parent.hasClass('unread');

         // show entry in popup
        if (selfoss.isSmartphone()) {
            location.hash = 'show';

            // hide nav
            if ($('#nav').is(':visible')) {
                var scrollTop = $(window).scrollTop();
                scrollTop = scrollTop - $('#nav').height();
                scrollTop = scrollTop<0 ? 0 : scrollTop;
                $(window).scrollTop(scrollTop);
                $('#nav').hide();
            }

            // save scroll position and hide content
            var scrollTop = $(window).scrollTop();
            var content = $('#content');
            $(window).scrollTop(0);
            content.hide();

            // show fullscreen
            var fullscreen = $('#fullscreen-entry');
            fullscreen.html('<div id="entrr' + parent.attr('id').substr(5) + '" class="entry fullscreen">' +
                parent.html() + '</div>');

            fullscreen.show();

            // set events for fullscreen
            selfoss.events.entriesToolbar(fullscreen);

            // set color of all tags by background color
            fullscreen.find('.entry-tags-tag').colorByBrightness();

            fullscreen.find('blockquote').css('overflow-x', 'scroll');

            // set events for closing fullscreen
            fullscreen.find('.entry, .entry-close').click(function(e) {
                if (e.target.tagName.toLowerCase() === 'a') return;
                content.show();
                location.hash = '';
                $(window).scrollTop(scrollTop);
                fullscreen.hide();
            });

            // automark as read
            if (autoMarkAsRead) fullscreen.find('.entry-unread').click();
        // open entry content
        }
        else {
            var content = parent.find('.entry-content');

            // show/hide (with toolbar)
            if (content.is(':visible')) {
                parent.find('.entry-toolbar').hide();
                content.hide();
            }
            else {
                content.show();
                selfoss.events.entriesToolbar(parent);
                parent.find('.entry-toolbar').show();

                // automark as read
                if (autoMarkAsRead) parent.find('.entry-unread').click();
            }

            // load images not on mobile devices
            if (selfoss.isMobile() === false) content.lazyLoadImages();
        }
    });

    // no source click
    if (selfoss.isSmartphone()) {
        $('.entry-source, .entry-icon').unbind('click').click(function (e) {
            e.preventDefault();
            return false;
        });
    }

    // scroll load more
    $(window).unbind('scroll').scroll(function () {
        if ($('#content').is(':visible') === false) return;

        var content = $('#content'), more = $('.stream-more'), win = $(window);
        if (more.length && more.position().top < win.height() + win.scrollTop() && !more.hasClass('loading')) more.click();
    });

    // more
    $('.stream-more').unbind('click').click(function () {
        var streamMore = $(this);
        selfoss.filter.offset += selfoss.filter.itemsPerPage;

        streamMore.addClass('loading');
        $.ajax({
            url: $('base').attr('href'),
            type: 'GET',
            dataType: 'json',
            data: selfoss.filter,
            success: function(data) {
                $('.stream-more').replaceWith(data.entries);
                selfoss.events.entries();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                streamMore.removeClass('loading');
                alert('Load more error: ' + errorThrown);
            }
        });
    });

    // set color of all tags by background color
    $('.entry-tags-tag').colorByBrightness();
};
