(function ($, window) {
    var baseUrl = "";
    var pageUuid = "";
    var opacityDiv = '<div id="opacity_div" class="box" style=" position:fixed;     top: 0px;    left: 0px;    height: 100%;   width: 100%;  background-color:#000; filter:alpha(opacity=1);  -moz-opacity:0.01;   -khtml-opacity: 0.01;  opacity: 0.01; z-index: 99999999;"></div>';
    var map;
    function getHtmlBaseUrl(){
        var htmlBaseUrl="/mizone-static/";
        var href=Utils.getBaseUrl();
        if(href.indexOf(htmlBaseUrl)>=0){
            if(href.indexOf("/pda/")>=0){
               return htmlBaseUrl+"pda/";
            }
            return htmlBaseUrl;
        }else{
            if(href.indexOf("/pda/")>=0){
                return "/pda/";
            }
            return "/"
        }
    }
    function ajaxsend(data, url, backFun, type, sync,errorFun) {
        var opacityUuidDive = Utils.uuid(8, 16);
        var orderName;
        var orderType;
        var orderDataType;
        if (Utils.isNotNull(data)) {
            orderName = data.params_order_name;
            orderType = data.params_order_type;
            orderDataType=data.params_order_data_type;
            data.params_order_name = undefined;
            data.params_order_type = undefined;
            data.params_order_data_type=undefined
        }
        var pageSize=undefined;
        if($(".page_size_value").length>1){
            $(".page_size_value").each(function(){
                var pageBool=true;
                var pageUrl=  $(".page_size_value").attr("url");
                if(Utils.isNotBlack(pageUrl)){
                     if(url.indexOf(pageUrl)){
                         pageSize=$(this).val();
                     }
                }
            })
        }else{
           pageSize=$(".page_size_value").val();
        }

        var closeCheckFlag=true;
        if(window.layer){
        	setTimeout(function(){
        		if(closeCheckFlag){
        			window.layer.load();
        			setTimeout(function(){
        				window.layer.closeAll('loading');
        				}, 5000);
        		}
        	}, 500);//超时弹出加载中页面
        }
        var ajaxParamter = {
            url: baseUrl + url,
            async: sync,
            contentType: "application/json",//必须有
            dataType: "json", //表示返回值类型，不必须
            traditional: true,
            beforeSend: function (request) {
                if (!Utils.isNotBlack(pageUuid)) {
                    pageUuid = Utils.uuid(8, 16)
                }
                if (Utils.isNotNull(orderName) && Utils.isNotNull(orderType) && orderName.length > 0) {
                    request.setRequestHeader("params-order-name", orderName);
                    request.setRequestHeader("params-order-type", orderType);
                    request.setRequestHeader("params-data-type", orderDataType);
                }
                request.setRequestHeader("head-send-uuid", pageUuid);
            },
            success: function (dataJson) {
            	closeCheckFlag=false;
            	if(window.layer){
            		window.layer.closeAll('loading');
            	}
                if (Utils.isNotNull(orderName) && Utils.isNotNull(orderType) && orderName.length > 0) {
                    data.params_order_name = orderName;
                    data.params_order_type = orderType;
                    data.params_order_data_type=orderDataType
                }
                if (Utils.isNotNull(map)) {
                    map.remove(opacityUuidDive);
                    if (map.key().length == 0) {
                        $("#opacity_div").remove();
                    }
                }
                if (dataJson.code == "0") {
                    backFun.call(this, dataJson);
                } else if (dataJson.code == "-10002"||dataJson.code=="-60003") {
                    if(Utils.isNotNull(errorFun)){
                        errorFun.call(this);
                    }
                    try {
                        window.layer.alert(dataJson.message, {}, function (index) {
                            window.top.location = baseUrl+getHtmlBaseUrl()+"static/login.html";
                        });
                    } catch (e) {
                        window.top.location = baseUrl+getHtmlBaseUrl()+ "static/login.html";
                    }
                } else {
                    if(Utils.isNotNull(errorFun)){
                        errorFun.call(this);
                    }
                    if(window.layer){
                        window.layer.alert(dataJson.message);
                    }

                }
            },
            error: function () {
            	closeCheckFlag=false;
            	if(window.layer){
            		window.layer.closeAll('loading');
            	}
                if(Utils.isNotNull(errorFun)){
                    errorFun.call(this);
                }
                if (Utils.isNotNull(orderName) && Utils.isNotNull(orderType) && orderName.length > 0) {
                    data.params_order_name = orderName;
                    data.params_order_type = orderType;
                    data.params_order_data_type=orderDataType
                }
                if (Utils.isNotNull(map)) {
                    map.remove(opacityUuidDive);
                    if (map.key().length == 0) {
                        $("#opacity_div").remove();
                    }
                }
                if(window.layer){
                    window.layer.alert("系统错误请联系管理员");
                }

            }
        }
        if (type == "postForm") {
            type = "post";
            ajaxParamter.traditional = undefined;
            ajaxParamter.contentType = undefined;
        } else if (type == "post_get") {
            type = "post";
            ajaxParamter.traditional = undefined;
            ajaxParamter.contentType = undefined;
        } else if (type != "post") {
            type = "get";
        } else if(type=="post_other") {
            type = "post";
            ajaxParamter.traditional = true;
            ajaxParamter.contentType = undefined;
        }else{
            data = JSON.stringify(data);
        }
        if (!Utils.isNotNull(sync)) {
            sync = true
        }
        if (!Utils.isNotNull(map)) {
            map = new Map();
        }
        map.push(opacityUuidDive, true);
        var $opacityDiv = $("#opacity_div");
        if (!Utils.isNotNull($opacityDiv.html())) {
            $("body").append(opacityDiv);
            $opacityDiv = $("#opacity_div")
        }
        ajaxParamter.type = type;
        if(Utils.isNotBlack(pageSize)&&Utils.isNotNull(pageSize)){
            if(!Utils.isNotNull(data)){
                data={};
            }
            data.pageSize=pageSize;
        }
        ajaxParamter.data = data;

        $.ajax(ajaxParamter);
        return false;
    }

    function uploadFile(url, backFun, opt) {
        $.ajaxFileUpload({
            url: baseUrl + url,
            type: 'post',
            fileElementId: opt.fileId,//file标签的id
            dataType: 'json',//返回数据的类型
            data: opt.data,
            beforeSend: function (request) {
                if (!Utils.isNotBlack(pageUuid)) {
                    pageUuid = Utils.uuid(8, 16)
                }
                request.setRequestHeader("uuid", pageUuid);
            },//一同上传的数据
            success: function (data, status) {
                backFun.call(this, data);
            },
            error: function (data, status, e) {
                console.log(0)
            }
        });
    }

    function ajaxget(url, backFun, data) {
        ajaxsend(data, url, backFun, 'get');
    }

    window.ajaxsend = ajaxsend;
    window.uploadFile = uploadFile;
    window.ajaxget = ajaxget;
})(jQuery, window);
