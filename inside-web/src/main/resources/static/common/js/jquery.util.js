

;(function ($, window, document) {

    $.fn.extend({
        tableCheck: function (allCheckboxClass) {
            var allCheck = $(this).find("th").find(':checkbox');
            var checks = $(this).find('td').find(':checkbox');
            var defaults = {
                selectedRowClass: "active"
            }
            var settings = $.extend(defaults, allCheckboxClass)
            if (allCheckboxClass)
                settings.selectedRowClass = allCheckboxClass;
            /*所有checkbox初始化*/
            $(this).find(":checkbox").prop("checked", false);
            /*全选/反选*/
            allCheck.on('click',function () {
                var set = $(this).parents('table').find('td').find(':checkbox');
                if ($(this).prop("checked")) {
                    $.each(set, function (i, v) {
                        $(v).prop("checked", true);
                        $(v).parents('tr').addClass(settings.selectedRowClass);
                    });
                } else {
                    $.each(set, function (i, v) {
                        $(v).prop("checked", false);
                        $(v).parents('tr').removeClass(settings.selectedRowClass);
                    });
                }
            });

            /* 监听全选事件 */
            checks.on('click',function (e) {
                e.stopPropagation();//阻止冒泡
                var leng = $(this).parents("table").find('td').find(':checkbox:checked').length;
                /*勾选后该行active*/
                if ($(this).prop('checked')) {
                    $(this).parents('tr').addClass(settings.selectedRowClass);
                } else {
                    $(this).parents('tr').removeClass(settings.selectedRowClass);
                }
                if (leng == checks.length) {
                    allCheck.prop('checked', true);
                } else {
                    allCheck.prop("checked", false);
                }
            });
            /*点击table触发复选框*/
            $(this).find("td").on('',function () {
                var _tr = $(this).parents('tr');
                _tr.find(":checkbox").trigger("click");
            });
        },

        tabChange: function (options) {
            options = $.extend({
                event: "mouseover",
                timeout: 0,
                auto: 0,
                callback: null
            }, options);

            var $this = $(this), tabbox = $this.children('div.tab_box').children('div'),
                menu = $this.find('ul.tab_menu'),
                items = menu.find('li'),
                timer;

            var tabHandle = function (ele) {
                    ele.siblings('li').removeClass('current').end().addClass('current');

                    tabbox.siblings('div').addClass('hide').end().eq(ele.index()).removeClass('hide');

                },
                delay = function (ele, time) {
                    time ? setTimeout(function () {
                            tabHandle(ele)
                        }, time) : tabHandle(ele)
                },
                start = function () {
                    if (!options.auto)return;
                    timer = setInterval(autoRun, options.auto);
                },
                autoRun = function () {
                    var current = menu.find('li.current'), firstItem = items.eq(0), len = items.length, index = current.index() + 1, item = index === len ? firstItem : current.next('li'), i = index === len ? 0 : index;

                    current.removeClass('current');
                    item.addClass('current');

                    tabbox.siblings('div').addClass('hide').end().eq(i).removeClass('hide')
                };

            items.bind(options.event, function () {
                delay($(this), options.timeout);
                if (options.callback) {
                    options.callback($this)
                }
            })

            if (options.auto) {
                start();
                $this.hover(function () {
                    clearInterval(timer);
                    timer = undefined;
                }, function () {
                    start();
                })
            }

            return this
        }
    });
})(jQuery, window, document);