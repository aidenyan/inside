/**
 * 调用示例：myAjax.ajaxSend();
 * 可用方法：ajaxSend
 *           ajaxPage
 *           ajaxTpl
 * 参数说明：
 *           url          请求地址
 *           backFun      回调函数
 *           data         请求数据
 *           type         请求类型，默认get
 *           pageId       生成分页标签的div id
 *           content      加载数据的容器
 *           tpl          解析数据的模版
 *           isAppend     true表示append方式加载模版
 */
layui.define(function (exports) {
    var baseUrl = "";
    var $ = layui.jquery
        , layer = layui.layer
        , laypage = layui.laypage
        , laytpl = layui.laytpl
        , form = layui.form();
    var obj = {
        ajaxSend: function (url, backFun, data, type, sync) {
            if(type=="post"){
                type="post_get"
            }
            ajaxsend(data,url,backFun,type,sync);
            return false;
        },
        ajaxPage: function (url, pageId, content, tpl, data, type, backFun,backFunAll) {
            loadPageInfo(url,data,type,content,tpl,pageId,backFun,backFunAll)
        },
        ajaxTpl: function (url, content, tpl, isAppend, backFun, data, type,beforeFun) {
            obj.ajaxSend(url, function (dataJson) {
                obj.getTpl(content, tpl, dataJson, isAppend, backFun,beforeFun);
            }, data, type);
        },
        getTpl: function (content, tpl, dataJson, isAppend, backFun,beforeFun) {
            if(Utils.isNotNull(beforeFun)){
                dataJson=beforeFun.call(this,dataJson);
            }
            var getTpl = $("#" + tpl).html();
            laytpl(getTpl).render(dataJson.result, function (html) {
                if (isAppend) {
                    $("#" + content).append(html);
                } else {
                    $("#" + content).html(html);
                }
                if (backFun != null) {
                    backFun.call(this, dataJson.result);
                }
                form.render();
            });
        }
    };
   function loadPageInfo(url,data,type,content,tpl,pageId,backFun,backFunAll){
       obj.ajaxSend(url, function (dataJson) {
           obj.getTpl(content, tpl, dataJson);
           laypage({
               cont: pageId
               , pages: dataJson.result.totalPage  //总页数
               , curr: dataJson.result.pageNo || 1
               , skin: '#1E9FFF'
               , skip: true
               , jump: function (jumpObj, first) {
                   if (!first) {
                       loadPageInfo(url,$.extend(data, {'pageNo': jumpObj.curr}),type,content,tpl,pageId,backFun,backFunAll)

                   }
               }
           });
           if (backFun != null) {
               backFun.call(this, dataJson.result);
           }

           if (backFunAll != null) {
               backFunAll.call(this, dataJson);
           }
       }, data, type);
   }
    //输出接口
    exports('myAjax', obj);
});
