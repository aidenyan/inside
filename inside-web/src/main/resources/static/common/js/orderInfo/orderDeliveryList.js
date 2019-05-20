var form,element,layer,laytpl,myAjax,laydate;
var statusListMap;
var payStatusListMap;
var consignStatusListMap;
var hasReturnExchange=false;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		 myAjax.ajaxTpl("/admin/platform/listAll.json", 'platformList', 'platformTpl');
		 myAjax.ajaxTpl("/admin/companyOrg/listWarehouseList.json", 'warehouseList', 'warehouseListTpl');
		 myAjax.ajaxTpl("/express/listAll.json", 'expressList', 'expressListTpl');
		 myAjax.ajaxSend("/admin/order/statusList.json",function(dataJson){
			 var result=dataJson.result;
			 var deliveryStatusList={
					 "result":result.deliveryStatusList
			 }
			 myAjax.getTpl('slcStatus', 'statusTpl',deliveryStatusList,false);
			 statusListMap=new Map();
			 payStatusListMap=new Map();
			 consignStatusListMap=new Map();
			 $.each(result.orderStatusList,function(k,v){
	    		 statusListMap.push(v.value,v.desc);
	    	 })
	    	 $.each(result.payStatusList,function(k,v){
	    		 payStatusListMap.push(v.value,v.desc);
	    	 })
	    	 $.each(result.consignStatusList,function(k,v){
	    		 consignStatusListMap.push(v.value,v.desc);
	    	 })
		 });
		 form.on('checkbox(selectAllCheckBox)', function(data){
			 var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		 form.on('select(warehouseList)', function(data) {
			 myAjax.ajaxTpl("/express/listAll.json?orgId="+data.value, 'expressList', 'expressListTpl');
		 });
		 $("#btnSearch").click(function(){
			 searchOrders();
		 })
		 $(".page_size_value").change(function(){
			 searchOrders();
	        })
		 var mapObjParam;
		 searchOrders=function(){
				var platformId=$("#platformList").val();
				if(platformId<0){
					platformId=null;
				}
				var status=$("#slcStatus").val();
				if(status<0){
					status=null;
				}
				var companyId=$("#warehouseList").val();
				if(companyId<0){
					companyId=null;
				}
				var flagId=$("#flagList").val();
		    	if(flagId<0){
		    		 flagId=null;
		    	 }
				var expressListId=$("#expressList").val();
				if(expressListId<0){
					expressListId=null;
				}
				var stime=$("#startDate").val();
				var etime=$("#endDate").val();
				var str=$("#searchSeletParam").val();
				if(!isNaN(str)){
					str=null;
				}
				var map=new Map();
				map.push($("#searchSeletParam").val(), $("#searchParam").val())
				map.push('source', platformId)
				map.push('status', status)
				map.push('warehouseId', companyId)
				map.push('logisticsId', expressListId)
				map.push('consignStime', stime)
				map.push('consignEtime', etime)
				map.push('sellerFlag', flagId)
				mapObjParam=map.mapObj;
				myAjax.ajaxPage('/admin/order/pageDelivery.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post',null,function(dataJson){
					if(Utils.isNotNull(dataJson.authorityCodeList) && Utils.isContain(dataJson.authorityCodeList, "return_exchange_com")){
						hasReturnExchange=true;
						$(".returnExchangeBtn").show();
					}
	    		});
			}
		 var orderObj = new Order(function (obj) {
				myAjax.ajaxPage('/admin/order/pageDelivery.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			},"relationInfo.consign_time");
		 searchOrders();
		 exportOut=function(){
	    		var stime=$("#startDate").val();
	    		var etime=$("#endDate").val();
	    		if(stime==null||stime==""||etime==null||etime==""){
	    			return layer.msg("请选择开始结束时间")
	    		}else{
	    			 var  aDate,  oDate1,  oDate2,  iDays    
	    	         aDate  =  etime.split("-")    
	    	         oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式    
	    	         aDate  =  stime.split("-")    
	    	         oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    
	    	         iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数   
	    	         if(iDays>365){
	    	        	 return layer.msg("开始结束时间相差不要多余1年")
	    	         }else{
	    	        	 	var platformId=$("#platformList").val();
	    	        		if(platformId<0){
	    	        			platformId='';
	    	        		}
	    	        		var status=$("#slcStatus").val();
	    	        		if(status<0){
	    	        			status='';
	    	        		}
	    	        		var companyId=$("#warehouseList").val();
	    	        		if(companyId<0){
	    	        			companyId='';
	    	        		}
	    	        		 var logisticsId=$("#expressList").val();
	    	    	    	 if(logisticsId<0){
	    	    	    		 logisticsId='';
	    	    	    	 }
	    	    	    	 var flagId=$("#flagList").val();
	    	    	    	 if(flagId<0){
	    	    	    		 flagId='';
	    	    	    	 }
	    	        		var stime=$("#startDate").val();
	    	        		var etime=$("#endDate").val();
	    	        		var str=$("#searchSeletParam").val();
	    	        		if(!isNaN(str)){
	    	        			str='';
	    	        		}
	    	        		layer.confirm('已发货订单导出', {
	    	   				  btn: ['淘宝订单导出','其他订单导出'] //按钮
	    	   				}, function(index){
	    	   					layer.close(index);
	   						  if($("#searchSeletParam").val()==0){
	   							  window.open("/admin/order/taobaoOrderPageExport.json?consignStime="+stime+"&consignEtime="+etime+"&source=" +
	   									  ""+platformId+"&status="+status+"&warehouseId="+companyId+"&logisticsId="+logisticsId+"&sellerFlag="+flagId);
	   						  }else{
	   							  window.open("/admin/order/taobaoOrderPageExport.json?consignStime="+stime+"&consignEtime="+etime+"&source=" +
	   									  ""+platformId+"&status="+status+"&warehouseId="+companyId+"&logisticsId="+logisticsId+"&sellerFlag="+flagId+"&"+$("#searchSeletParam").val()+"="+encodeURI(encodeURI($("#searchParam").val(),"utf-8")));
	   						  }
	    	   				}, function(){
	    	   				  return layer.msg('其他订单导出暂未开发,下个版本会依据导出需求更新')
	    	   				});
	    	         }
	    		}
	    		
	    	}

		 callParent.isLoadEnd("order_deliverd_list");
	     callParent.register(function () {
	    	 //searchOrders();
	    	 refresh();
	        }, "search");
	     $('#searchParam').bind('keypress', function(event) {  
		        var theEvent = event || window.event;      
		        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;      
		        if (code == 13) {                    
		        	event.preventDefault();      
		           //回车执行查询  
		          $("#btnSearch").click();   
		        }   
		    });   
	});
   });


$(function () {
	 orderDetail=function(id){
	       callParent.openTab("order_detail", 0, "订单详情", "admin/order/order_details.html?id="+id+"&msgToclose=order_deliverd_list", true);
	   }
	 returns=function(id,isExchange){
	        callParent.openTab("returns", 0, isExchange?"换货":"退货", "admin/order/returns.html?id="+id+"&isExchange="+isExchange+"&msgToclose=order_list", true);
	 }
    //明细
    $("#page_tbody").on("click", ".trDetail", function () {
        var varThis = $(this);
        var varId = varThis.parent().attr('id');
        var warehouseId = varThis.parent().find('.consignee').attr("warehouseId");
        var url="/admin/order/OrderProductInventoryInfo.json?id=" + varId;
        if(warehouseId!=null&&warehouseId!=""&&warehouseId!="null"){
        	url+="&warehouseId="+warehouseId;
        }
        var varCon = $("#orderProductInventoryInfo");
        if (varCon.length == 0) {
            varThis.parent('tr').after('<tr id="orderProductInventoryInfo" val="' + varId + '"></tr>');
            myAjax.ajaxTpl(url, 'orderProductInventoryInfo', 'tplOrderProductInventoryInfo');
        } else {
            varCon.remove();
            if (varCon.attr('val') != varId) {
                varThis.parent('tr').after('<tr id="orderProductInventoryInfo" val="' + varId + '"></tr>');
                myAjax.ajaxTpl(url, 'orderProductInventoryInfo', 'tplOrderProductInventoryInfo');
            }
        }
    });

    /**
     * 
     * @param value
     * @returns 订单状态 0-未创建支付宝交易(淘宝订单) 1-未确认、2-已支付、3-已审核、4-部分发货、5-已发货、6-已完成、7-退货中、8-退货完成、9-取消   10-0元购合约中(淘宝订单)

     */
    changeStatus=function(value){
    	if(statusListMap!=null){
    		return statusListMap.get(value);
    	}else{
    		 myAjax.ajaxSend("/admin/order/statusList.json",function(dataJson){
    			 statusListMap=new Map();
    	    	 $.each(dataJson.result,function(k,v){
    	    		 statusListMap.push(v.value,v.desc);
    	    	 })
    	    	 return statusListMap.get(value);
    		 });
    	}
    }
    changePayStatus=function(value){
    	if(value==null){
    		return "";
    	}else if(payStatusListMap!=null){
    		return payStatusListMap.get(value);
    	}
    }
    changeConsignStatus=function(value){
    	if(value==null){
    		return "";
    	}else if(consignStatusListMap!=null){
    		return consignStatusListMap.get(value);
    	}
    }
    
    
})