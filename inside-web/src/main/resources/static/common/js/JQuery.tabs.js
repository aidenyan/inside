/**
 * Created by Administrator on 2017/3/10 0010.
 */
;(function ($, window) {
    $.fn.extend({
        Tabs: function (options) {
            options = $.extend({
                event: 'mouseover',
                timeout: 0,
                auto: 0,
                callback: null
            }, options);

            var tabBox = this.children('div.tab_box').children('div'), menu = this.children('ul.tab_menu'), items = menu.find('li'), timer;

            var tabHandle = function (elem) {
                    elem.siblings('li').removeClass('current').end().addClass('current');
                    tabBox.siblings('div').addClass('hide').end().eq(elem.index()).removeClass('hide');
                },

                delay = function (elem, time) {
                    time ? setTimeout(tabHandle(elem), time) : tabHandle(elem)
                },

                start = function () {
                    if (!options.auto) {
                        return
                    }
                    ;
                    timer = setInterval(autoRun, options.auto)
                },
                autoRun = function () {
                    var current = menu.find('li.current'), firstItem = items.eq(0), len = items.length, index = current.index() + 1, item = index === len ? firstItem : current.next('li'), i = index === len ? 0 : index;

                    current.removeClass('current');
                    item.addClass('current');

                    tabBox.siblings('div').addClass('hide').end().eq(i).removeClass('hide');
                };

            items.bind(options.event, function () {
                delay($(this), options.timeout);
                if (options.callback) {
                    options.callback()
                }
            });

            if (options.auto) {
                start();
                this.hover(function () {
                    clearInterval(timer);
                    timer = undefined;
                }, function () {
                    start()
                });
            }
            return this
        }

    })
})(jQuery, window)
