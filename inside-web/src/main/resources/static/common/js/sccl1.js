(function ($, window) {


    var Public=Public||{};
    /*左侧菜单点击*/

    $(".side-menu").on('click', 'li a', function (e) {
        // var "fast" = 300;
        var $this = $(this);
        var checkElement = $this.next(); //点击的a标签的后面同辈元素 --ul

        if (checkElement.is('.menu-item-child') && checkElement.is(':visible')) {
            checkElement.slideUp("fast", function () {
                checkElement.removeClass('menu-open');  //--预留回调函数
                console.log('aa')
            });
            checkElement.parent("li").removeClass("active");
        }
        //如果菜单是不可见的
        else if ((checkElement.is('.menu-item-child')) && (!checkElement.is(':visible'))) {
            //获取上级菜单
            var parent = $this.parents('ul').first();
            //从父级开始找所有打开的菜单并关闭
            var ul = parent.find('ul:visible').slideUp("fast");
            //在父级中移出menu-open标记
            ul.removeClass('menu-open');
            //获取父级li
            var parent_li = $this.parent("li");
            //打开菜单时添加menu-open标记
            checkElement.slideDown("fast", function () {
                //添加样式active到父级li
                checkElement.addClass('menu-open');
                parent.find('li.active').removeClass('active');
                parent_li.addClass('active');
            });
        } else {
            console.log()
            $this.parent().children().addClass('a');
            $this.parent().siblings().children().removeClass('a')

        }
        //防止有链接跳转
        e.preventDefault();
        var url = $this.attr("href"),
            m = $this.data("index"),
            h = $this.attr("code"),
            label = $this.find("span").text();
        addIframe(h, m, label, url);
    });

    /*添加iframe*/
    function addIframe(h, m, label, url, reflush) {
        var isHas = false;
        var iframHeight = $(window).height() - $(".mizone-header").height();

        if (h == "" || $.trim(h).length == 0) { //$.trim 去掉首尾的空格
            return false;
        }

        $(".content-tab").each(function () {
            if ($(this).data("id") == h) {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active").siblings(".content-tab").removeClass("active");
                    addTab(this);
                }
                isHas = true;
            }
        });
        if (isHas) {
            $(".body-iframe").each(function () {
                if ($(this).data("id") == h) {
                    $(this).show().siblings(".body-iframe").hide();
                    if (reflush) {
                        if ($(this).attr("src") != url) {
                            $(this).attr("src", url);
                        }
                    }
                }
            });
        }
        if (!isHas) {
            var tab = "<a href='javascript:;' class='content-tab active' data-id='" + h + "'>" + label + " <i class='icon-'>&#x1006;</i></a>";
            $(".content-tab").removeClass("active");
            $(".tab-nav-content").append(tab);
            if (!Utils.isNotNull(url)) {
                url = h;
            }
            var iframe = "<iframe class='body-iframe' name='iframe" + m + "' width='100%' height='99%' id='" + h + "' src='" + url + "' frameborder='0' data-id='" + h + "' seamless></iframe>";
            $(".mizone-main-body").find("iframe.body-iframe").hide().parents(".mizone-main-body").append(iframe);
            addTab($(".content-tab.active"));
        }
        return false;
    }


    /*添加tab*/
    function addTab(cur) {
        var prev_all = tabWidth($(cur).prevAll()),
            next_all = tabWidth($(cur).nextAll());
        var other_width = tabWidth($(".mizone-main-tab").children().not(".tab-nav"));
        var navWidth = $(".mizone-main-tab").outerWidth(true) - other_width;//可视宽度
        var hidewidth = 0;
        if ($(".tab-nav-content").width() < navWidth) {
            hidewidth = 0
        } else {
            if (next_all <= (navWidth - $(cur).outerWidth(true) - $(cur).next().outerWidth(true))) {
                if ((navWidth - $(cur).next().outerWidth(true)) > next_all) {
                    hidewidth = prev_all;
                    var m = cur;
                    while ((hidewidth - $(m).outerWidth()) > ($(".tab-nav-content").outerWidth() - navWidth)) {
                        hidewidth -= $(m).prev().outerWidth();
                        m = $(m).prev()
                    }
                }
            } else {
                if (prev_all > (navWidth - $(cur).outerWidth(true) - $(cur).prev().outerWidth(true))) {
                    hidewidth = prev_all - $(cur).prev().outerWidth(true)
                }
            }
        }
        $(".tab-nav-content").animate({
                marginLeft: 0 - hidewidth + "px"
            },
            "fast")
    }

    /*获取宽度*/
    function tabWidth(tabarr) {
        var allwidth = 0;
        $(tabarr).each(function () {
            allwidth += $(this).outerWidth(true)
        });
        return allwidth;
    }

    /*获取高度*/
    Public.getHeight=function () {
        var winH = $(window).outerHeight(), headerH = 60, resH = winH - headerH, mainTab = 36, bodyH = winH - headerH - mainTab;
        $(".mizone-side").css("height", resH)
        $(".mizone-main").css("height", resH)
        $(".mizone-main-body").css("height", bodyH)
    }

    /*左按钮事件*/
    $(".btn-left").on("click", leftBtnFun);
    /*右按钮事件*/
    $(".btn-right").on("click", rightBtnFun);
    /*选项卡切换事件*/
    $(".tab-nav-content").on("click", ".content-tab", navChange);
    /*选项卡关闭事件*/
    $(".tab-nav-content").on("click", ".content-tab i", closePage);


    /*左按钮方法*/
    function leftBtnFun() {
        var ml = Math.abs(parseInt($(".tab-nav-content").css("margin-left")));
        var other_width = tabWidth($(".mizone-main-tab").children().not(".tab-nav"));
        var navWidth = $(".mizone-main-tab").outerWidth(true) - other_width;//可视宽度
        var hidewidth = 0;
        if ($(".tab-nav-content").width() < navWidth) {
            return false
        } else {
            var tabIndex = $(".content-tab:first");
            var n = 0;
            while ((n + $(tabIndex).outerWidth(true)) <= ml) {
                n += $(tabIndex).outerWidth(true);
                tabIndex = $(tabIndex).next();
            }
            n = 0;
            if (tabWidth($(tabIndex).prevAll()) > navWidth) {
                while ((n + $(tabIndex).outerWidth(true)) < (navWidth) && tabIndex.length > 0) {
                    n += $(tabIndex).outerWidth(true);
                    tabIndex = $(tabIndex).prev();
                }
                hidewidth = tabWidth($(tabIndex).prevAll());
            }
        }
        $(".tab-nav-content").animate({
                marginLeft: 0 - hidewidth + "px"
            },
            "fast");
    }

    /*右按钮方法*/
    function rightBtnFun() {
        var ml = Math.abs(parseInt($(".tab-nav-content").css("margin-left")));
        var other_width = tabWidth($(".mizone-main-tab").children().not(".tab-nav"));
        var navWidth = $(".mizone-main-tab").outerWidth(true) - other_width;//可视宽度
        var hidewidth = 0;
        if ($(".tab-nav-content").width() < navWidth) {
            return false
        } else {
            var tabIndex = $(".content-tab:first");
            var n = 0;
            while ((n + $(tabIndex).outerWidth(true)) <= ml) {
                n += $(tabIndex).outerWidth(true);
                tabIndex = $(tabIndex).next();
            }
            n = 0;
            while ((n + $(tabIndex).outerWidth(true)) < (navWidth) && tabIndex.length > 0) {
                n += $(tabIndex).outerWidth(true);
                tabIndex = $(tabIndex).next()
            }
            hidewidth = tabWidth($(tabIndex).prevAll());
            if (hidewidth > 0) {
                $(".tab-nav-content").animate({
                        marginLeft: 0 - hidewidth + "px"
                    },
                    "fast");
            }
        }
    }

    /*选项卡切换方法*/
    function navChange() {
        if (!$(this).hasClass("active")) {
            var k = $(this).data("id");

            $(".body-iframe").each(function () {
                if ($(this).data("id") == k) {
                    $(this).show().siblings(".body-iframe").hide();
                    return false
                }
            });

            $("a[code]").each(function () {
                if ($(this).attr('code') === k) {
                    $(this).addClass('a').parent('li').siblings().children().removeClass('a')
                }
            })
            $(this).addClass("active").siblings(".content-tab").removeClass("active");
            addTab(this);
        }
    }

    function closeTab(dataId) {
        $(".content-tab i").each(function () {
            if ($(this).parents(".content-tab").data("id") == dataId) {
                $(this).click();
            }
        })

    }

    /*选项卡关闭方法*/
    function closePage() {
        var url = $(this).parents(".content-tab").data("id");
        var cur_width = $(this).parents(".content-tab").width();
        if ($(this).parents(".content-tab").hasClass("active")) {
            if ($(this).parents(".content-tab").next(".content-tab").size()) {
                var next_url = $(this).parents(".content-tab").next(".content-tab:eq(0)").data("id");
                $(this).parents(".content-tab").next(".content-tab:eq(0)").addClass("active");
                $(".body-iframe").each(function () {
                    if ($(this).data("id") == next_url) {
                        $(this).show().siblings(".body-iframe").hide();
                        return false
                    }
                });
                var n = parseInt($(".tab-nav-content").css("margin-left"));
                if (n < 0) {
                    $(".tab-nav-content").animate({
                            marginLeft: (n + cur_width) + "px"
                        },
                        "fast")
                }
                $(this).parents(".content-tab").remove();
                $(".body-iframe").each(function () {
                    if ($(this).data("id") == url) {
                        $(this).remove();
                        return false
                    }
                })
            }
            if ($(this).parents(".content-tab").prev(".content-tab").size()) {
                var prev_url = $(this).parents(".content-tab").prev(".content-tab:last").data("id");
                $(this).parents(".content-tab").prev(".content-tab:last").addClass("active");
                $(".body-iframe").each(function () {
                    if ($(this).data("id") == prev_url) {
                        $(this).show().siblings(".body-iframe").hide();
                        return false
                    }
                });
                $(this).parents(".content-tab").remove();
                $(".body-iframe").each(function () {
                    if ($(this).data("id") == url) {
                        $(this).remove();
                        return false
                    }
                })
            }
        } else {
            $(this).parents(".content-tab").remove();
            $(".body-iframe").each(function () {
                if ($(this).data("id") == url) {
                    $(this).remove();
                    return false
                }
            });
            addTab($(".content-tab.active"))
        }
        return false
    }


    /*循环菜单*/
    function initMenu(menu, parent) {
        for (var i = 0; i < menu.length; i++) {
            var item = menu[i];
            var str = "";
            if (!Utils.isNotNull(item.code)) {
                item.code = item.url;
            }
            try {
                if (item.isHeader == "1") {
                    str = "<li class='menu-header'>" + item.name + "</li>";
                    $(parent).append(str);
                    if (item.childMenus != "") {
                        initMenu(item.childMenus, parent);
                    }
                } else {
                    item.icon == "" ? item.icon = "&#xe63f;" : item.icon = item.icon;
                    if (item.childMenus == "") {
                        str = "<li><a href='" + item.url + "'  code='" + item.code + "'><i class='icon-'>" + item.icon + "</i><span>" + item.name + "</span></a></li>";
                        $(parent).append(str);
                    } else {
                        str = "<li><a href='" + item.url + "' '><i class='icon- '>" + item.icon + "</i><span>" + item.name + "</span><i class='icon- icon-right'>&#xe625;</i></a>";
                        str += "<ul class='menu-item-child' id='menu-child-" + item.id + "'></ul></li>";
                        $(parent).append(str);
                        var childParent = $("#menu-child-" + item.id);
                        initMenu(item.childMenus, childParent);
                    }
                }
            } catch (e) {
            }
        }
    }


    /*头部下拉框移入移出*/
    $(document).on("mouseenter", ".header-bar-nav", function () {
        $(this).addClass("open");
    });
    $(document).on("mouseleave", ".header-bar-nav", function () {
        $(this).removeClass("open");
    });

    /*左侧菜单展开和关闭按钮事件*/
    $(document).on("click", ".mizone-side-arrow", function () {
        if ($(".mizone-side").hasClass("close")) {
            $(".mizone-side").removeClass("close");
            $(".mizone-main").removeClass("full-page");
            $(".mizone-footer").removeClass("full-page");
            $(this).removeClass("close");
            $(".mizone-side-arrow-icon").removeClass("close");
        } else {
            $(".mizone-side").addClass("close");
            $(".mizone-main").addClass("full-page");
            $(".mizone-footer").addClass("full-page");
            $(this).addClass("close");
            $(".mizone-side-arrow-icon").addClass("close");
        }
    });

    /*随机颜色*/
    function getMathColor() {
        var arr = new Array();
        arr[0] = "#ffac13";
        arr[1] = "#83c44e";
        arr[2] = "#2196f3";
        arr[3] = "#e53935";
        arr[4] = "#00c0a5";
        arr[5] = "#16A085";
        arr[6] = "#ee3768";

        var le = $(".menu-item > a").length;
        for (var i = 0; i < le; i++) {
            var num = Math.round(Math.random() * 5 + 1);
            var color = arr[num - 1];
            $(".menu-item > a").eq(i).find("i:first").css("color", color);
        }
    }

    /*
     初始化加载
     */
    $(function () {

        /*菜单json*/
        var menu = [
            {
                "id": "3",
                "name": "商品管理",
                "parentId": "1",
                "url": "",
                "icon": "&#xe905;",

                "isHeader": "0",
                "childMenus": [
                    {
                        "id": "4",
                        "name": "品牌管理",
                        "parentId": "3",
                        "url": "commodity/com_brand.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "5",
                        "name": "分类管理",
                        "parentId": "3",
                        "url": "commodity/com_class.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "010",
                        "name": "商品列表",
                        "parentId": "3",
                        "url": "commodity/com_list.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "011",
                        "name": "商品属性",
                        "parentId": "3",
                        "url": "commodity/com_attribute.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    }
                ]
            },
            {
                "id": "6",
                "name": "订单管理",
                "parentId": "1",
                "url": "",
                "icon": "&#xe903;",

                "isHeader": "0",
                "childMenus": [
                    {
                        "id": "7",
                        "name": "已发货订单",
                        "parentId": "6",
                        "url": "order/order_already.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "8",
                        "name": "波次单发货",
                        "parentId": "6",
                        "url": "order/order_wave.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "061",
                        "name": "待审核订单",
                        "parentId": "6",
                        "url": "order/order_pending_audit.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "062",
                        "name": "订单列表",
                        "parentId": "6",
                        "url": "order/order_list.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "063",
                        "name": "订单详情",
                        "parentId": "6",
                        "url": "order/order_details.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    }
                ]
            },
            {
                "id": "020",
                "name": "采购管理",
                "parentId": "1",
                "url": "",
                "icon": "&#xe901;",

                "isHeader": "0",
                "childMenus": [
                    {
                        "id": "021",
                        "name": "采购管理",
                        "parentId": "020",
                        "url": "purchase/purchase_list.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "022",
                        "name": "采购初审",
                        "parentId": "020",
                        "url": "purchase/purchase_first.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "023",
                        "name": "采购终审",
                        "parentId": "020",
                        "url": "purchase/purchase_end.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "024",
                        "name": "供应商管理",
                        "parentId": "020",
                        "url": "purchase/purchase_supplier.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "025",
                        "name": "采购指导价",
                        "parentId": "020",
                        "url": "purchase/purchase_price.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "026",
                        "name": "库存预警",
                        "parentId": "020",
                        "url": "purchase/purchase_stock.html",
                        "icon": "",
                        "order": "1",
                        "isHeader": "0",
                        "childMenus": ""
                    },
                ]
            }
            ,
            {
                "id": "030",
                "name": "仓库管理",
                "parentId": "1",
                "url": "",
                "icon": "&#xe902;",

                "isHeader": "0",
                "childMenus": [
                    {
                        "id": "031",
                        "name": "库存管理",
                        "parentId": "030",
                        "url": "storage/storage_list.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "032",
                        "name": "仓库盘点",
                        "parentId": "030",
                        "url": "storage/storage_check.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "033",
                        "name": "入库单管理",
                        "parentId": "030",
                        "url": "storage/storage_input.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "034",
                        "name": "出库单管理",
                        "parentId": "030",
                        "url": "storage/storage_output.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "035",
                        "name": "库位管理",
                        "parentId": "030",
                        "url": "storage/storage_positions.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "036",
                        "name": "盘点记录",
                        "parentId": "030",
                        "url": "storage/storage_record.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "037",
                        "name": "库存管理",
                        "parentId": "030",
                        "url": "storage/storage_list.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "038",
                        "name": "仓库盘点",
                        "parentId": "030",
                        "url": "storage/storage_check.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "039",
                        "name": "入库单管理",
                        "parentId": "030",
                        "url": "storage/storage_input.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0310",
                        "name": "出库单管理",
                        "parentId": "030",
                        "url": "storage/storage_output.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0311",
                        "name": "库位管理",
                        "parentId": "030",
                        "url": "storage/storage_positions.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0312",
                        "name": "盘点记录",
                        "parentId": "030",
                        "url": "storage/storage_record.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0313",
                        "name": "库存管理",
                        "parentId": "030",
                        "url": "storage/storage_list.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0314",
                        "name": "仓库盘点",
                        "parentId": "030",
                        "url": "storage/storage_check.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0315",
                        "name": "入库单管理",
                        "parentId": "030",
                        "url": "storage/storage_input.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0316",
                        "name": "出库单管理",
                        "parentId": "030",
                        "url": "storage/storage_output.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0317",
                        "name": "库位管理",
                        "parentId": "030",
                        "url": "storage/storage_positions.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0318",
                        "name": "盘点记录",
                        "parentId": "030",
                        "url": "storage/storage_record.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0319",
                        "name": "库存管理",
                        "parentId": "030",
                        "url": "storage/storage_list.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0320",
                        "name": "仓库盘点",
                        "parentId": "030",
                        "url": "storage/storage_check.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0321",
                        "name": "入库单管理",
                        "parentId": "030",
                        "url": "storage/storage_input.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0322",
                        "name": "出库单管理",
                        "parentId": "030",
                        "url": "storage/storage_output.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0323",
                        "name": "库位管理",
                        "parentId": "030",
                        "url": "storage/storage_positions.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "0324",
                        "name": "盘点记录",
                        "parentId": "030",
                        "url": "storage/storage_record.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    }
                ]
            },
            {
                "id": "040",
                "name": "用户中心",
                "parentId": "1",
                "url": "",
                "icon": "&#xe909;",

                "isHeader": "0",
                "childMenus": [
                    {
                        "id": "041",
                        "name": "组织架构管理",
                        "parentId": "040",
                        "url": "user/list1.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "042",
                        "name": "经销商管理",
                        "parentId": "040",
                        "url": "user/user_distributor.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "043",
                        "name": "门店管理",
                        "parentId": "040",
                        "url": "user/user_store.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    }
                ]
            },
            {
                "id": "050",
                "name": "系统管理",
                "parentId": "1",
                "url": "",
                "icon": "&#xe907;",

                "isHeader": "0",
                "childMenus": [
                    {
                        "id": "051",
                        "name": "账户管理",
                        "parentId": "050",
                        "url": "system/system_account.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "052",
                        "name": "角色管理",
                        "parentId": "050",
                        "url": "system/system_user.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "053",
                        "name": "仓库管理",
                        "parentId": "050",
                        "url": "system/system_storage.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    },
                    {
                        "id": "054",
                        "name": "平台管理",
                        "parentId": "050",
                        "url": "../../system/system_platform.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    }, {
                        "id": "055",
                        "name": "日志管理",
                        "parentId": "050",
                        "url": "system/system_log.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    }, , {
                        "id": "056",
                        "name": "模板管理",
                        "parentId": "050",
                        "url": "../../system/system_model.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    }, {
                        "id": "057",
                        "name": "系统设置",
                        "parentId": "050",
                        "url": "system/system_setting.html",
                        "icon": "",

                        "isHeader": "0",
                        "childMenus": ""
                    }
                ]
            }
        ]

        initMenu(menu, $(".side-menu"));
        $(".side-menu > li").addClass("menu-item");
        /*获取菜单icon随机色*/
        getMathColor();
    });

    window.Public=Public;
})(jQuery, window)