/**
 * Created by Administrator on 2017/4/18 0018.
 */

layui.define(function (exports) {

    var obj={
        keyupMove:function (event) {
            var theEvent = event || window.event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if(code===38){
                var curTr=$("#orderProductInventoryInfo").prev().prev()
                showDetail(curTr)
            }
            switch (code){
                case (40):
                    var curTr=$("#orderProductInventoryInfo").next()
                    showDetail(curTr)
            }
        }
    };
    function showDetail(cur) {
        var thisId=cur.attr('id');
        if(typeof (thisId)==='undefined'){return}
        var infoTr=$('#orderProductInventoryInfo');
        var warehouseId = cur.find('.consignee').attr("warehouseId");
        var url="/admin/order/OrderProductInventoryInfo.json?id=" + thisId;
        if(warehouseId!=null&&warehouseId!=""&&warehouseId!="null"){
            url+="&warehouseId="+warehouseId;
        }
        if(infoTr.length){
            infoTr.remove();
            cur.siblings('tr').removeClass('bg');
            cur.addClass('bg')
            cur.after('<tr id="orderProductInventoryInfo" val="'+thisId+'"></tr>')
            myAjax.ajaxTpl(url, 'orderProductInventoryInfo', 'tplOrderProductInventoryInfo');
        }
    }

    //输出接口
    exports('myUtil',obj)
})