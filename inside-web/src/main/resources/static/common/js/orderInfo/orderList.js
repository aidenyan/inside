var form,element,layer,laytpl,myAjax;
var statusListMap;
var orderStatusListMap;
var payStatusListMap;
var consignStatusListMap;
var myUtil;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','myUtil'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;myUtil=layui.myUtil;
		
		 myAjax.ajaxTpl("/admin/platform/listAll.json", 'platformList', 'platformTpl');
		 myAjax.ajaxSend("/admin/order/statusList.json",function(dataJson){
			 var result=dataJson.result;
			 statusListMap=new Map();
			 orderStatusListMap=new Map();
			 payStatusListMap=new Map();
			 consignStatusListMap=new Map();
	    	 $.each(result.orderStatusList,function(k,v){
	    		 statusListMap.push(v.value,v.desc);
	    	 })
	    	 var statusArray=new Array();
	    	 var statusResult={
	    			 "payStatusList":result.payStatusList,
	    			 "orderStatusList":result.orderStatusList
	    	 }
	    	 statusArray.push(statusResult);
	    	 var orderStatusListResult={
	    		 "result":statusArray
	    	 }
	    	 myAjax.getTpl('paymentStatus', 'paymentTpl',orderStatusListResult,false);
	    	 myAjax.getTpl('orderStatus', 'statusTpl',orderStatusListResult,false);
	    	 $.each(result.payStatusList,function(k,v){
	    		 payStatusListMap.push(v.value,v.desc);
	    	 })
	    	 $.each(result.consignStatusList,function(k,v){
	    		 consignStatusListMap.push(v.value,v.desc);
	    	 })
	    	 $.each(result.divideOrMergeStatusList,function(k,v){
	    		 orderStatusListMap.push(v.value,v.desc);
			 })
		 });
		 myAjax.ajaxTpl("/admin/companyOrg/listWarehouseList.json", 'warehouseList', 'warehouseListTpl');
		 myAjax.ajaxTpl("/express/listAll.json", 'expressList', 'expressListTpl');
		 form.on('checkbox(selectAllCheckBox)', function(data){
			 var child = $('.datagrid-body').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		$('#newStatusList').selectMy({nextFunction:function(){
            //searchOrders();
        }});
		 form.on('select(warehouseList)', function(data) {
			 myAjax.ajaxTpl("/express/listAll.json?orgId="+data.value, 'expressList', 'expressListTpl');
		 });
		 $(".page_size_value").change(function(){
			 searchOrders();
	        })
		 $("#btnSearch").click(function(){
			 searchOrders();
		 })
		 $("#exportOut").click(function(){
			 exportOut();
		 })
		 $('#importOrderList').click(function(){
			layer.open({
					title: '订单导入',
					type: 1, area: ["650px", "430px"] ,  
					btn: ["完成", "关闭"], 
					content: $("#form_import"),
					closeBtn: 0,
					btnAlign: 'c'
				})
			 // 导入的JS文件
			 $(".update_file").on("change", "input[type='file']", function () {
				var list = document.querySelector("#update").files
				var str = []
				var data = new FormData()
				for(var i=0;i<list.length;i++) {
						data.append('file', list[i])
						str += '<li>'+list[i].name+'</li>'
				}
				$('.file-import-ctn').html(str)
				str = []
				$('#update').replaceWith('<input type="file" id="update" multiple="multiple" name="files[]">')
				$.ajax({
					url: '/admin/order/import.json',
					type: "POST",
					data: data,
					processData: false,
					contentType: false,
					success: function(response) {
						if(typeof(response) == 'string'){
							response = JSON.parse(response)
						}
						if(response.code == '-1'){
							layer.alert(response.result.message)
						}else if(response.code == '-3000313'){
							layer.alert(response.message)
						}else if(response.code == '-10003') {
                            layer.alert(response.message)
						}
						if(response.result != null){
							$('#successCount').html(response.result.successCount)
							$('#failCount').html(response.result.failCount)
						}
					}
				})
			})
		 })
		form.verify({
			modelCode: [
			    /^[a-zA-Z0-9_]{2,20}$/,
			    '模板编号格式不正确，为2到20位数字字母下划线'
			  ],
			  modelName: [
				/^[\u4e00-\u9fa5]{2,9}$/,
				'模板名称格式不正确，只能为2到9位中文'		    
				] 
			});    
		 callParent.isLoadEnd("order_list");
	     callParent.register(function () {
	    	 //searchOrders();
	    	 refresh();
	        }, "search");
	     
	     var mapObjParam;
	     searchOrders=function(){
	    	 var platformId=$("#platformList").val();
	    	 if(platformId<0){
	    		 platformId=null;
	    	 }
			 var paystatus = $("#paymentStatus").val();
			 var status = $("#orderStatus").val();
	    	
	    	 var companyId=$("#warehouseList").val();
	    	 if(companyId<0){
	    		 companyId=null;
	    	 }
	    	 var logisticsId=$("#expressList").val();
	    	 if(logisticsId<0){
	    		 logisticsId=null;
	    	 }
	    	 var flagId=$("#flagList").val();
	    	 if(flagId<0){
	    		 flagId=null;
	    	 }
	    	 var stime=$("#startDate").val();
	    	 var etime=$("#endDate").val();
	    	 var str=$("#searchSeletParam").val();
	    	 if(!isNaN(str)){
	    		 str=null;
	    	 }
	    	 var map=new Map();
	    	 map.push($("#searchSeletParam").val(), $.trim($("#searchParam").val()))
	    	 map.push('source', platformId)
	    	 map.push('payStatus', paystatus)
	    	 map.push('status', status)
	    	 map.push('warehouseId', companyId)
	    	 if (Utils.checkBox($("#by_delivery"), true, false)) {
	    		 map.push('consignStime', stime)
		    	 map.push('consignEtime', etime)
	    	 }else{
	    		 map.push('startTime', stime)
		    	 map.push('endTime', etime)
	    	 }
	    	 map.push('logisticsId', logisticsId)
			 map.push('sellerFlag', flagId)
			 map.push('newStatusList', getSelectLiId("newStatus"));
			 mapObjParam=map.mapObj;
	    	 myAjax.ajaxPage('/admin/order/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post_other');
	     }
	     var orderObj = new Order(function (obj) {
    		 myAjax.ajaxPage('/admin/order/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post_other');
    	 },"relationInfo.create_time");
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
	    	        		 
							 var paystatus = $("#paymentStatus").val();
							 var status = $("#orderStatus").val();
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
	    	        		var byStartTime="startTime";
	    	        		var byEndTime="endTime";
	    	        		if (Utils.checkBox($("#by_delivery"), true, false)) {
	    	        			byStartTime="consignStime";
	    	        			byEndTime="consignEtime";
	    	   	    	 	}
	    	        		layer.confirm('订单导出', {
		    	   				  btn: ['淘宝订单导出','其他订单导出'] //按钮
		    	   				}, function(index){
		    	   					return layer.msg("此页面淘宝订单不能导出，请前往已发货订单页面导出");
		    	   				}, function(index){
		    	   					layer.close(index);
		    	   					if($("#searchSeletParam").val()==0){
			    	        			window.open("/admin/order/pageExport.json?"+byStartTime+"="+stime+"&"+byEndTime+"="+etime+"&source=" +
			    	        			""+platformId+"&status="+status+"&payStatus="+paystatus+"&warehouseId="+companyId+"&logisticsId="+logisticsId+"&sellerFlag="+flagId);
			    	        		}else{
			    	        			window.open("/admin/order/pageExport.json?"+byStartTime+"="+stime+"&"+byEndTime+"="+etime+"&source=" +
			    	        			""+platformId+"&status="+status+"&payStatus="+paystatus+"&warehouseId="+companyId+"&logisticsId="+logisticsId+"&sellerFlag="+flagId+"&"+$("#searchSeletParam").val()+"="+encodeURI(encodeURI($.trim($("#searchParam").val()),"utf-8")));
			    	        		}
		    	   				});
	    	        		
	    	         }
	    		}
	    		
	    	}
	     		
	     		cansleDivideOrder=function(id,version){
	     			layer.msg('该操作会取消该父单下的所有子单', {
	  	    		  time: 0, //不自动关闭
	  	    		  shade: 0.6,//遮罩透明度
	  	      		  shadeClose:true,//点击遮罩关闭层
	  	      		  btn: ['确定', '取消'],
	  	    		  yes: function(index){
	  	    			  myAjax.ajaxSend("/admin/order/cansleDivideOrder.json",function(){
	  	    				  layer.close(index);
	  	    				 refresh();    
	  	    			  },{'id':id,'version':version},'post')
	  	    		  }
	          	 })
	     		}
	    	    orderDetail=function(id){
	    	        callParent.openTab("order_detail", 0, "订单详情", "admin/order/order_details.html?id="+id+"&msgToclose=order_list", true);
	    	    }
	    	    divideOrder=function(id,sn){
	    	    	if(sn!=null){
	    	    		var length=(sn.split('-')).length-1;
	    	    		if(length>4){
	    	    			return layer.msg("订单最多只能拆5次");
	    	    		}
	    	    	}
	    	        callParent.openTab("order_divide", 0, "订单拆单", "admin/order/order_divide.html?id="+id+"&msgToclose=order_list", true);
	    	    }
	    	    orderEdit=function(id){
	    	    	callParent.openTab("order_edit", 0, "订单编辑", "admin/order/order_edit.html?id="+id+"&msgToclose=order_list", true);
	    	    }
	    	    childInfo=function(id){
	    	  		 myAjax.ajaxTpl("/admin/order/childOrderList.json?parentId="+id, 'childOrderList', 'pageChildTpl');
	    	  		 layer.open({
	    	             type: 1,
	    	             title:'子单信息',
	    	             content: $("#childOrerHtml"),           //弹窗内容
	    	             area: ["800px", "300px"],         //设置窗体高度 和宽度
	    	             closeBtn: 1,                      //取消右上角关闭按钮
	    	             btnAlign: 'r'
	    	         })
				}
				function getSelectLiId(id){
					var idList=new Array();
					$("#"+id).find("li").each(function(){
						 if( $(this).hasClass("am-checked")){
							 idList.push(parseInt($(this).attr("val")))
						 }
					})
				   return idList;
				}
		      function dealDataInfo(dataJson){
				  var map=new Map();
				  var packageList=null;
				  var packageMap=new Map();
				  for(var i=0;i<dataJson.result.length;i++){
					  if(!Utils.isNotNull(dataJson.result[i].parentSkuCode)){
						  map.push(dataJson.result[i].skuCode,dataJson.result[i]);
					  }else{
						  packageList=packageMap.get(dataJson.result[i].parentSkuCode);
						  if(!Utils.isNotNull(packageList)){
							  packageList=new Array();
							  packageMap.push(dataJson.result[i].parentSkuCode,packageList);
						  }
						  packageList.push(dataJson.result[i]);
					  }
				  }
				  var resultList=new Array();
				  var keyList=map.key();
				  var key=null;
				  var detailObj=null;
				  for(var j=0;j<keyList.length;j++){
					  key=keyList[j];
					  detailObj=map.get(key);
					  detailObj.order_num=(j+1);
					  resultList.push(detailObj);
					  packageList=packageMap.get(detailObj.skuCode);
					  if(Utils.isNotNull(packageList)&&packageList.length>0){
						  for(var k=0;k<packageList.length;k++){
							  packageList[k].order_num=detailObj.order_num+"-"+(k+1);
							  resultList.push(packageList[k]);
						  }
					  }

				  }
				  dataJson.result=resultList;
				  return dataJson;
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
                        varThis.parent().addClass('bg');
	    	            myAjax.ajaxTpl(url, 'orderProductInventoryInfo', 'tplOrderProductInventoryInfo',undefined,undefined,undefined,undefined,function(dataJson){
							return dealDataInfo(dataJson)
						});

	    	        } else {
	    	            varCon.remove();
                        varThis.parent().removeClass('bg')
	    	            if (varCon.attr('val') != varId) {
                            varThis.parent().siblings('tr.bg').removeClass('bg')
                            varThis.parent().addClass('bg');
	    	                varThis.parent('tr').after('<tr id="orderProductInventoryInfo" val="' + varId + '"></tr>');
	    	                myAjax.ajaxTpl(url, 'orderProductInventoryInfo', 'tplOrderProductInventoryInfo',undefined,undefined,undefined,undefined,function(dataJson){
							return dealDataInfo(dataJson)
						});
	    	            }
	    	        }
	    	    });
					$(document).on('keydown',myUtil.keyupMove)
	    	    //子单列表点击明细
	    	    $("#childOrderList").on("click", ".trDetail", function () {
	    	        var varThis = $(this);
	    	        var varId = varThis.parent().attr('id');
	    	        orderDetail(varId);
	    	    });
	    	    //新增
	    	    $("#orderAdd").click(function () {
	    	        callParent.openTab("order_add", 0, "创建订单", "admin/order/order_add.html", true);
	    	    });
	    	    
	    	    /**
	    	     * 
	    	     * @param value
	    	     * @returns 订单状态 0-未创建支付宝交易(淘宝订单) 1-未确认、2-已支付、3-已审核、4-部分发货、5-已发货、6-已完成、7-退货中、8-退货完成、9-取消   10-0元购合约中(淘宝订单)

	    	     */
	    	    changeStatus=function(value){
	    	    	if(statusListMap!=null){
	    	    		return statusListMap.get(value);
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
	    	    changeOrderDivideStatus=function(value){
	    	    	if(orderStatusListMap!=null){
	    	    		return orderStatusListMap.get(value);
	    	    	}
	    	    }
	    	    
	    	    $('#searchParam').bind('keypress', function(event) {  
	    	        var theEvent = event || window.event;      
	    	        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;      
	    	        if (code == 13) {                    
	    	        	event.preventDefault();      
	    	           //回车执行查询  
	    	          $("#btnSearch").click();   
	    	        }   
	    	    });  
	    	})
	});

