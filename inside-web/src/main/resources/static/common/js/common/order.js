(function ($, window) {
    var downClass = "icon-uniE60C";
    var upClass = "icon-uniE60A";
    var order = function (fun, defaultParams, orders,dataType) {
        this.options.search = fun;
        this.options.defaultParams = defaultParams;
        this.options.dataType = dataType;
        if ("asc" == orders) {
            this.options.orders = 1;
        } else {
            this.options.orders = 0
        }
        selectClass(this.options, this);
    }
    order.prototype.options = function () {
        var dataJson = new Array();
        $(".sort").each(function () {
            var type = $(this).attr("data-type");
            if (Utils.isBlank(type)) {
                type = undefined;
            }
            if ($(this).hasClass(downClass)) {
                dataJson.push({orderName: $(this).attr("name"), orderType: 0, dataType: type});
            } else if ($(this).hasClass(upClass)) {
                dataJson.push({orderName: $(this).attr("name"), orderType: 1, dataType: type});
            }
        })
        return dataJson;
    };
    order.prototype.setOption = function (opt) {
        if (!Utils.isNotNull(opt)) {
            opt = {};
        }
        var options = this.options();
        if (options.length == 0) {
            if (Utils.isNotNull(this.options.defaultParams) && this.options.defaultParams.length > 0) {
                options.push({orderName: this.options.defaultParams, orderType: this.options.orders,dataType:this.options.dataType});
            }
        }
        for (var i = 0; i < options.length; i++) {
            var obj = options[i];
            opt.params_order_name = obj.orderName;
            opt.params_order_type = obj.orderType;
            opt.params_order_data_type=obj.dataType;
        }
        return opt;
    }
    order.prototype.clear = function () {
        $(".sort").each(function () {
            $(this).removeClass(downClass);
            $(this).removeClass(upClass);
        });
    }
    function selectClass(opts, that) {
        $(".sort").click(function () {
            var isDown = $(this).hasClass(downClass);
            var isUp = $(this).hasClass(upClass);
            $(".sort").removeClass(downClass);
            $(".sort").removeClass(upClass);
            if ((!isDown) && (!isUp)) {
                $(this).addClass(downClass);
            } else if (isDown) {
                $(this).addClass(upClass);
            } else {
                $(this).addClass(downClass);
            }
            opts.search.call(this, that);
        });
    }

    window.Order = order;
})(jQuery, window);

(function ($,window) {
    $(function () {
        resize();
        $(window).resize(function () {
            resize();
        })
        $('.datagrid-body').scroll(function () {
            $('.datagrid-header-inner').css('left', -$(this).scrollLeft());
        })
    });
    function resize() {
        var height = $(document.body).height(), topH , panelH , bodyH;
        if($('.hasNext').length>0){
            topH=156;
        }else {
            topH=121;
        }
        panelH=height-topH,bodyH=panelH-30
        var width=$('.panel').width(),realW=width-17 ;$('.datagrid-htable').css('width',realW);$('.datagrid-btable').css('width',realW);
        /* console.log(width);*/
        $('.panel').css('height', panelH);
        $('.datagrid-body').css('height', bodyH);
    }


    $.fn.selectMy=function (options) {
        var openSelect=false;
        var isClose=options.isClose;
        var ary = [];
        var settings=$.extend({
            multiselect:true
        },options)
        var $amDropdownContent=$(this).children('.am-dropdown-content');
        var $selectBtn=$(this).children('.am-selected-btn');
        var $selectSearch=$amDropdownContent.children('.am-selected-search').children('input')
        $(this).on('click', $selectBtn, toggleSelect)
        $(this).on('click', '.am-selected-list li', checkedLi)
        $(this).on('click', '.am-input-sm', choiseList)
        //    点击select之外地方隐藏下拉展示
        $(document).click(function () {
            if(openSelect){
                openSelect=false;
            $amDropdownContent.hide();
            $selectBtn.removeClass('am-selected-btn-selected');
            if(Utils.isNotNull(options.nextFunction)){
                options.nextFunction.call(this);
            }}
        })
        //    点击input时阻止事件冒泡
        function choiseList(e) {
            e = e || window.event;
            e.stopPropagation()
        }
        //    点击btn隐藏和展示下拉框
        function toggleSelect(e) {
            if(Utils.isNotNull(isClose)&&isClose){
                return;
            }
            openSelect=true;
           /* $('.am-dropdown-content').hide();
            $('.am-selected').removeClass('am-selected-btn-selected')*/
            e = e || window.event;
            $(this).toggleClass('am-selected-btn-selected')
            $amDropdownContent.toggle();
            $selectSearch.focus()
            e.stopPropagation();
        }
        //    选中当前li添加样式
        function checkedLi(e,$this) {
            if(!Utils.isNotNull($this)){
                 $this = $(this);
            }

            e = e || window.event;
            var $list=$amDropdownContent.find('.am-selected-list li')
            if(settings.multiselect){
                $(this).toggleClass('am-checked')
                for(var i=0,len=$list.length;i<len;i++){
                    if($($list[i]).hasClass('am-checked')){
                        ary.push($($list[i]).find('> span').html())
                    }
                }
                $selectBtn.val(ary.join(','))
                ary=[];
                e.stopPropagation();
            }else {
                $this.addClass('am-checked').siblings().removeClass('am-checked');
                var str=$this.find('>span').html();
                str=str.replace(/((?:&nbsp;)+)/g,'')
                $selectBtn.val(str)
            }
        }

        $selectSearch.on('input',function () {
            var $this=$(this);
            var $list=$amDropdownContent.find('.am-selected-list li')
            var keyWord=$this.val();
            var reg = new RegExp(keyWord);
            $list.hide()
            $list.filter(function (index,item) {
                return $(item).children('span').text().match(reg)
            }).show()
        })
        window.checkedLi=checkedLi;
    }
})(jQuery,window)