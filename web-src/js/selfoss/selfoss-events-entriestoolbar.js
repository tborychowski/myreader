/**
 * toolbar of an single entry
 */
selfoss.events.entriesToolbar = function (parent) {
    if (typeof parent === 'undefined') parent = $('#content');

    // prevent close on links
    parent.find('a').unbind('click').click(function (e) {
        window.open($(this).attr('href'));
        e.preventDefault();
        return false;
    });

    // load images
    parent.find('.entry-loadimages').unbind('click').click(function () {
        var btn = $(this).fadeOut(), entry = btn.closest('.entry');
        entry.mobileImgHelpers();
        entry.lazyLoadImages();
        return false;
    });

    // open in new window
    parent.find('.entry-newwindow').unbind('click').click(function (e) {
        window.open($(this).closest('.entry').children('a').eq(0).attr('href'));
        e.preventDefault();
        return false;
    });


    // save to pocket
    parent.find('.entry-sharepocket').unbind('click').click(function (e) {
        var entry = $(this).closest('.entry'),
            url = 'https://getpocket.com/save?url=' +
                encodeURIComponent(entry.children('a').eq(0).attr('href')) +
                '&title=' + encodeURIComponent(entry.children('.entry-title').html());
        window.open(url);
        e.preventDefault();
        return false;
    });

    // save to readability
    parent.find('.entry-sharereadability').unbind('click').click(function (e) {
        var entry = $(this).closest('.entry'),
            url = 'http://www.readability.com/save?url=' +
                encodeURIComponent(entry.children('a').eq(0).attr('href'));
        window.open(url);
        e.preventDefault();
        return false;
    });

    // share with e-mail
    parent.find('.entry-shareemail').unbind('click').click(function (e) {
        var entry = $(this).closest('.entry');
        location.href = 'mailto:?body=' + encodeURIComponent(entry.children('a').eq(0).attr('href')) +
            '&subject=' + encodeURIComponent(entry.children('.entry-title').html());
        e.preventDefault();
        return false;
    });

    // only loggedin users
    if ($('body').hasClass('loggedin')) {
        // starr/unstarr
        parent.find('.entry-starr').unbind('click').click(function () {
            var btn = $(this),
                parent = btn.closest('.entry'),
                id = parent.attr('id').substr(5),
                starr = btn.hasClass('active') === false,
                button = $('#entry' + id + ' .entry-starr, #entrr' + id + ' .entry-starr'),

                // update button
                setButton = function (starr) {
                    if (starr) button.addClass('active').html('unstar');
                    else button.removeClass('active').html('star');
                },

                // update statistics in main menue
                updateStats = function (starr) {
                    var starred = parseInt($('.nav-filter-starred span').html(), 10);
                    if (starr) starred++;
                    else starred--;
                    $('.nav-filter-starred span').html(starred);
                };

            setButton(starr);
            updateStats(starr);

            $.ajax({ url: $('base').attr('href') + (starr ? 'starr/' : 'unstarr/') + id, type: 'POST',
                error: function (jqXHR, textStatus, errorThrown) {
                    // rollback ui changes
                    setButton(!starr);
                    updateStats(!starr);
                    alert('Can not starr/unstarr item: ' + errorThrown);
                }
            });

            return false;
        });

        // read/unread
        parent.find('.entry-unread').unbind('click').click(function () {
            var btn = $(this),
                id = btn.parents('.entry').attr('id').substr(5),
                unread = btn.hasClass('active'),
                button = $('#entry' + id + ' .entry-unread, #entrr' + id + ' .entry-unread'),
                parent = $('#entry' + id + ', #entrr' + id),

                // update button
                setButton = function (unread) {
                    if (unread) {
                        button.removeClass('active').html('mark as unread');
                        parent.removeClass('unread');
                    }
                    else {
                        button.addClass('active').html('mark as read');
                        parent.addClass('unread');
                    }
                };
            setButton(unread);

            // update statistics in main menue and the currently active tag
            var updateStats = function (unread) {
                // update all unread counter
                var unreadstats = parseInt($('.nav-filter-unread span').html(), 10);
                if(unread) unreadstats--;
                else unreadstats++;
                $('.nav-filter-unread span').html(unreadstats);
                $('.nav-filter-unread span').removeClass('unread');
                if(unreadstats>0) $('.nav-filter-unread span').addClass('unread');

                // update unread count on sources
                var sourceId = $('#entry'+id+' .entry-source').attr('class').substr(25);
                var sourceNav = $('#source'+sourceId+' .unread');
                var sourceCount = parseInt(sourceNav.html());
                if(typeof sourceCount != "number" || isNaN(sourceCount)==true) sourceCount = 0;
                sourceCount = unread ? sourceCount-1 : sourceCount+1;
                if(sourceCount<=0) sourceCount = "";
                sourceNav.html(sourceCount);

                // update unread on tags
                $('#entry'+id+' .entry-tags-tag').each( function (index) {
                    var tag = $(this).html();
                    var tagsCountEl = $('#nav-tags > li > span.tag').filter(function (i) {
                        return $(this).html()==tag; }
                    ).next();

                    var unreadstats = 0;
                    if (tagsCountEl.html()!='') unreadstats = parseInt(tagsCountEl.html());

                    if (unread) unreadstats--;
                    else unreadstats++;

                    if (unreadstats>0) tagsCountEl.html(unreadstats);
                    else tagsCountEl.html('');

                });
            };
            updateStats(unread);

            $.ajax({
                url: $('base').attr('href') + (unread ? 'mark/' : 'unmark/') + id,
                type: 'POST',
                error: function (jqXHR, textStatus, errorThrown) {
                    // rollback ui changes
                    updateStats(!unread);
                    setButton(!unread);
                    alert('Can not mark/unmark item: '+errorThrown);
                },
                success: function () {
                    if ($(".nav-filter-unread").hasClass("active") && unread) {
                        if ($('#fullscreen-entry').is(':visible')) $('#fullscreen-entry .entry-close').click();
                        parent.hide();
                    }
                }
            });

            return false;
        });
    }
};