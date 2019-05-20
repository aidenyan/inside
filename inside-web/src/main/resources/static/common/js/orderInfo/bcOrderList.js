var form,element,layer,laytpl,myAjax,laydate;
var statusListMap;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		 myAjax.ajaxTpl("/admin/platform/listAll.json", 'platformList', 'platformTpl');
		 myAjax.ajaxTpl("/admin/companyOrg/listWarehouseList.json", 'warehouseList', 'warehouseListTpl');
		 myAjax.ajaxSend("/admin/order/statusList.json",function(dataJson){
			 dataJson=dataJson.result;
			 statusListMap=new Map();
	    	 $.each(dataJson.orderStatusList,function(k,v){
	    		 statusListMap.push(v.value,v.desc);
	    	 })
		 });
		 form.on('checkbox(allChoose)', function(data){
			 var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		 form.on('select(expressChange)', function(data){
			 var warehouseId=$("#hideWarehouseId").val();
			 myAjax.ajaxSend("/express/selectOrgExpressNo.json",function(data){
    			 $("#maxExpressNo").val(data.result);
			 },{'warehouseId': warehouseId,'expressId':data.value})
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
				var companyId=$("#warehouseList").val();
				if(companyId<0){
					companyId=null;
				}
				var stime=$("#startDate").val();
				var etime=$("#endDate").val();
				var str=$("#searchSeletParam").val();
				if(!isNaN(str)){
					str=null;
				}
				var map=new Map();
				map.push($("#searchSeletParam").val(), $("#searchParam").val())
				map.push('platformId', platformId)
				map.push('warehouseId', companyId)
				map.push('startTime', stime)
				map.push('endTime', etime)
				mapObjParam=map.mapObj;
				myAjax.ajaxPage('/admin/order/pageBcOrderList.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			}
		 var orderObj = new Order(function (obj) {
				myAjax.ajaxPage('/admin/order/pageBcOrderList.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			},"bc.create_time");
		 searchOrders();
		 callParent.isLoadEnd("order_bclist");
	     callParent.register(function () {
	    	// searchOrders();
	    	 refresh();
	        }, "search");
	     orderDetail=function(id){
		       callParent.openTab("order_detail", 0, "订单详情", "admin/order/order_details.html?id="+id+"&msgToclose=order_toBeCheck_list", true);
		   }
	    //明细
	    var openTr;
	    $("#page_tbody").on("click", ".trDetail", function () {
	    	openTr=$(this);
	    	getTrOrderDetail($(this),false);
	    });
	    getTrOrderDetail=function(obj,flag){
	    	 var varThis = obj;
		        var bcCode = varThis.parent().attr('bcCode');
		        var url="/admin/order/bcOrderItemList.json?bcCode=" + bcCode;
		        var varCon = $("#bcOrderItemList");
		        if (varCon.length == 0) {
		            varThis.parent('tr').after('<tr id="bcOrderItemList" val="' + bcCode + '"></tr>');
		            myAjax.ajaxTpl(url, 'bcOrderItemList', 'tplBcOrderItemList');
		        } else {
		            varCon.remove();
		            if (flag||varCon.attr('val') != bcCode) {
		                varThis.parent('tr').after('<tr id="bcOrderItemList" val="' + bcCode + '"></tr>');
		                myAjax.ajaxTpl(url, 'bcOrderItemList', 'tplBcOrderItemList');
		            }
		        }
	    }

	    bcOrderDelete=function(bcCode){
			 layer.msg('确认删除该波次单吗？', {
	    		  time: 0, //不自动关闭
	    		  shade: 0.6,//遮罩透明度
	      		  shadeClose:true,//点击遮罩关闭层
	      		  btn: ['确定', '取消'],
	    		  yes: function(index){
	    			  return false;
	    			  myAjax.ajaxSend("/admin/order/deleteBcOrder.json?bcCode="+bcCode,function(){
							 layer.close(index);
							 //searchOrders();
							 refresh();
					})
	    		  }
      	 })
	    }

	    deleteOrerFromBc=function(bcCode,orderId){
	    	layer.msg('确认删除该波次单中的订单吗？', {
	    		time: 0, //不自动关闭
	    		shade: 0.6,//遮罩透明度
	    		shadeClose:true,//点击遮罩关闭层
	    		btn: ['确定', '取消'],
	    		yes: function(index){
	    			myAjax.ajaxSend("/admin/order/deleteOrderFromBc.json?bcCode="+bcCode+"&orderId="+orderId,function(){
	    				layer.close(index);
	    				//searchOrders();
	    				 refresh();
	    			})
	    		}
	    	})
	    }
	    sendAllGoods=function(bcCode){
	    	myAjax.ajaxSend("/admin/order/sendAllGoods.json?bcCode="+bcCode,function(){
				getTrOrderDetail(openTr,true);
				layer.msg("发货成功！");
			})
	    }
	    sendGoods=function(orderId,expressCompany,expressNo){
	    	if(expressCompany==null||expressCompany==""||expressCompany=="null"||expressNo==""||expressNo==null||expressNo=="null"){
	    		return layer.msg("没有选择物流，无法发货！");
	    	}else{
	    		myAjax.ajaxSend("/admin/order/sendGoods.json?trackingNo="+expressNo+"&orderId="+orderId,function(){
    				getTrOrderDetail(openTr,true);
    				layer.msg("发货成功！");
    			})
	    	}
	    }
	    bcExpressPrint=function(code,warehouseId){
	    	myAjax.ajaxTpl("/express/listAll.json", 'expressList', 'expressListTpl',false,function(){
	    		if($("#expressList").val()==null||$("#expressList").val()<0){
	    			return layer.msg("没有物流网点信息!", {
		  		  		  time: 0, //不自动关闭
		  		  		  btn: ['去配置', '取消'],
		  		  		  shade: 0.6,//遮罩透明度
		  		  		  shadeClose:true,//点击遮罩关闭层
		  		  		  yes: function(index){
		  		  			callParent.openTab("transportation_express", 0, "物流网点", "admin/logistics/company.html", true);
		  		  		  }
		  		  		 });
	    		}
	    		 myAjax.ajaxSend("/express/selectOrgExpressNo.json",function(data){
	    			 $("#maxExpressNo").val(data.result);
	    			 $("#hideWarehouseId").val(warehouseId);
	    			 layer.open({
	    				 type: 1,
	    				 title:'波次快递单打印',
	    				 content: $("#editExpressHtml"),           //弹窗内容
	    				 area: ["450px", "300px"],         //设置窗体高度 和宽度
	    				 btn: ["确定", "取消"],
	    				 closeBtn: 0,                      //取消右上角关闭按钮
	    				 btnAlign: 'r',
	    				 success:function (layero, index) {
	    					 layero.addClass('layui-form');
	    					 layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
	    					 form.render();
	    				 },
	    				 yes: function(index){
	    					 var e=false;
	    					 var checkSendFlag=false;
	    					 if($("#checkElectricExpress").is(":checked") && $(("#expressList")).find("option:selected").attr("isWaybill") === 'true'){
	    						 e=true;
	    						 checkSendFlag=true;
	    					 }else{
	    						 if($("#maxExpressNo").val()!=null && $("#maxExpressNo").val()!=''){
	    							 checkSendFlag=true;
	    						 }else{
	    							 checkSendFlag=false;
	    							 return layer.msg("非电子面单运单号不能为空");
	    						 }
	    					 }
	    					 var data={
	    							 "bcCode":code,
	    							 "trackingNo":$("#maxExpressNo").val(),
	    							 "expressOrgId":$("#expressList").val(),
	    							 "e":e
	    					 }
	    					 if(checkSendFlag){
	    					 $.ajax({
	    	       					type: 'post',
	    	       	                url: '/admin/order/bcOrderExpressPrint.json',
	    	       	                data: data,
	    	       	                traditional : true,
	    	       	                dataType: "json",
	    	       	                success: function (dataJson) {
	    	       	                    if (dataJson.code == "0") {
	    	       	                    	createPrintBat(dataJson.result);
	    	       	                    	if(openTr!=null&&openTr.length>0){
	    	       	                    		getTrOrderDetail(openTr,true);
	    	       	                    	}
	    	       	                    	layer.close(index);
	    	       	                    	refresh()
	    	       	                    } else {
	    	       	                        layer.alert(dataJson.message);
	    	       	                    }
	    	       	                },
	    	       	                error: function () {
	    	       	                    layer.alert("系统错误请联系管理员");
	    	       	                }
	    	       	            });
	    					 }
	    				 }
	    			 })
				 },{'warehouseId': warehouseId,'expressId':$("#expressList").val()})
			 });
	    }

	    jxdPrint=function(html,sn,index){
	    	LODOP.SET_PRINT_PAGESIZE(1, "240mm", "140mm", "");
			LODOP.ADD_PRINT_HTM(10, 40, "100%", "98%", html);
			LODOP.ADD_PRINT_BARCODE(50, 580, 250, 60, '128A',sn);
			if(sn){
				LODOP.ADD_PRINT_TEXT(30, 740, 250, 60, index);
			}
			LODOP.NewPageA();
	    }
	    jxdPrintA4=function(html,sn,index){
	        LODOP.ADD_PRINT_BARCODE(50, 540, 250, 47, "128A", sn);
	        LODOP.ADD_PRINT_BARCODE(600, 540, 250, 47, "128A", sn);
	        if(sn){
				LODOP.ADD_PRINT_TEXT(30, 700, 250, 47, index);
				LODOP.ADD_PRINT_TEXT(580, 700, 250, 47, index);
			}
	        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
	        LODOP.ADD_PRINT_HTM(5, "1%", "100%", "98%", "<!DOCTYPE html>" + html);
	        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT",'Width:99%');
	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
	        LODOP.NewPageA();
	    }
	    
	    jxdPrintA5=function(html,sn,index){
	        LODOP.ADD_PRINT_BARCODE(50, 540, 250, 47, "128A", sn);
	        if(sn){
				LODOP.ADD_PRINT_TEXT(30, 700, 250, 47, index);
			}
	        LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A5");
	        LODOP.ADD_PRINT_HTM(5, "1%", "100%", "98%", "<!DOCTYPE html>" + html);
	        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT",'Width:99%');
	        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
	        LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向时的正向显示
	        LODOP.NewPageA();
	    }
	    
	    bcJhdPrint=function(code,source){
	    	var printType=(source==1?"A4":"A5");
	    	var a4PrintHtml=printType+"打印：<input type='checkBox' class='a4print'>";
	    	layer.msg(a4PrintHtml, {
	    		  time: 0, //不自动关闭
	    		  shade: 0.6,//遮罩透明度
	      		  shadeClose:true,//点击遮罩关闭层
	      		  btn: ['确定', '取消'],
	    		  yes: function(layero,index){
	    			  var checkStatus=index.find(".a4print");
	    			  if(source!=null&&source==1){//淘宝专用订单打印
	    				  if(checkStatus.is(':checked')){
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/bcOrderJxdPrint.json?bcCode="+code, 'all_jxd_tbody', 'allJxdTpl',false,function(data){
		    						var dataJson={
		    			    				"result":data.bcOrderItemList
		    			    		}
		    			    		myAjax.getTpl('totalOrderDetailHtml','taobaoA4JxdTpl',dataJson,false,function(){
		    						var strBodyStyle = "<style>" + varTaobaoA4Css + "</style>";
		    						$(".box").each(function(index,item){
		    							var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
		    							jxdPrintA4(html,$(this).find(".orderSn").html(),index);
		    						})
		    						LODOP.PREVIEW();
		    			    		});
		    						refresh()
		    				  });

		    			  }else{
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/bcOrderJxdPrint.json?bcCode="+code, 'all_jxd_tbody', 'allJxdTpl',false,function(data){
		    			    		var dataJson={
		    			    				"result":data.bcOrderItemList
		    			    		}
		    			    		myAjax.getTpl('totalOrderDetailHtml','taobaoJxdTpl',dataJson,false,function(){
		    						var strBodyStyle = "<style>" + varTaobaoCss + "</style>";
		    						$(".box").each(function(index,item){
		    							var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
		    							jxdPrint(html,$(this).find(".orderSn").html(),index);
		    						})
		    						LODOP.PREVIEW();
		    			    		});
                                  refresh()
		    			    	});
		    			  }
	    			  }else{
	    				  if(checkStatus.is(':checked')){
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/bcOrderJxdPrint.json?bcCode="+code, 'all_jxd_tbody', 'allJxdTpl',false,function(data){
		    						var dataJson={
		    			    				"result":data.bcOrderItemList
		    			    		}
		    			    		myAjax.getTpl('totalOrderDetailHtml','detailA4Tpl',dataJson,false,function(){
		    						var strBodyStyle = "<style>" + a4Css + "</style>";
		    						$(".box").each(function(index,item){
		    							var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
		    							jxdPrintA5(html,$(this).find(".orderSn").html(),index);
		    						})
		    						LODOP.PREVIEW();
		    			    		})
                                  refresh()
		    				  });

		    			  }else{
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/bcOrderJxdPrint.json?bcCode="+code, 'all_jxd_tbody', 'allJxdTpl',false,function(data){
		    			    		var dataJson={
		    			    				"result":data.bcOrderItemList
		    			    		}
		    			    		myAjax.getTpl('totalOrderDetailHtml','detailTpl',dataJson,false,function(){
		    						var strBodyStyle = "<style>" + varCss + "</style>";
		    						$(".box").each(function(index,item){
		    							var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
		    							jxdPrint(html,$(this).find(".orderSn").html(),index);
		    						})
		    						LODOP.PREVIEW();
		    			    		});
                                  refresh()
		    			    	});
						  }  
					  }
				  }
      	 })
	    }
	    orderDetail=function(id){
	        callParent.openTab("order_detail", 0, "订单详情", "admin/order/order_details.html?id="+id+"&msgToclose=order_bclist", true);
	    }
	    orderExpressPrint=function(orderId,warehouseId){
	    	myAjax.ajaxTpl("/express/listAll.json", 'expressList', 'expressListTpl',false,function(){
	    		if($("#expressList").val()==null||$("#expressList").val()<0){
	    			return layer.msg("没有物流网点信息!", {
	  		  		  time: 0, //不自动关闭
	  		  		  btn: ['去配置', '取消'],
	  		  		  shade: 0.6,//遮罩透明度
	  		  		  shadeClose:true,//点击遮罩关闭层
	  		  		  yes: function(index){
	  		  			callParent.openTab("transportation_express", 0, "物流网点", "admin/logistics/company.html", true);
	  		  		  }
	  		  		 });
	    		}
	    		 myAjax.ajaxSend("/express/selectOrgExpressNo.json",function(data){
	    			 $("#maxExpressNo").val(data.result);
	    			 $("#hideWarehouseId").val(warehouseId);
	    			 layer.open({
	    				 type: 1,
	    				 title:'订单快递单打印',
	    				 content: $("#editExpressHtml"),           //弹窗内容
	    				 area: ["450px", "300px"],         //设置窗体高度 和宽度
	    				 btn: ["确定", "取消"],
	    				 closeBtn: 0,                      //取消右上角关闭按钮
	    				 btnAlign: 'r',
	    				 success:function (layero, index) {
	    					 layero.addClass('layui-form');
	    					 layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
	    					 form.render();
	    				 },
	    				 yes: function(index){
	    					 var e=false;
	    					 var checkSendFlag=false;
	    					 if($("#checkElectricExpress").is(":checked") && $(("#expressList")).find("option:selected").attr("isWaybill") === 'true'){
	    						 e=true;
	    						 checkSendFlag=true;
	    					 }else{
	    						 if($("#maxExpressNo").val()!=null && $("#maxExpressNo").val()!=''){
	    							 checkSendFlag=true;
	    						 }else{
	    							 checkSendFlag=false;
	    							 return layer.msg("非电子面单运单号不能为空");
	    						 }
	    					 }
	    					 var data={
	    							 "orderId":orderId,
	    							 "trackingNo":$("#maxExpressNo").val(),
	    							 "expressOrgId":$("#expressList").val(),
	    							 "e":e
	    					 }
	    					 if(checkSendFlag){
	    					 $.ajax({
	    	       					type: 'post',
	    	       	                url: '/admin/order/orderExpressPrint.json',
	    	       	                data: data,
	    	       	                traditional : true,
	    	       	                dataType: "json",
	    	       	                success: function (dataJson) {
	    	       	                    if (dataJson.code == "0") {
	    	       	                    	createPrintBat(dataJson.result);
	    	       	                    	getTrOrderDetail(openTr,true);
	    	       	                    	layer.close(index);
	    	       	                    } else {
	    	       	                        layer.alert(dataJson.message);
	    	       	                    }
	    	       	                },
	    	       	                error: function () {
	    	       	                    layer.alert("系统错误请联系管理员");
	    	       	                }
	    	       	          });
	    					 }
	    				 }
	    			 })
				 },{'warehouseId': warehouseId,'expressId':$("#expressList").val()})
			 });
	    }

	    editExpressInfo=function(orderId,version,warehouseId,trackingId){
	    	myAjax.ajaxTpl("/express/listAll.json", 'expressList', 'expressListTpl',false,function(){
	    		if($("#expressList").val()==null||$("#expressList").val()<0){
	    			return layer.msg("没有物流网点信息!", {
		  		  		  time: 0, //不自动关闭
		  		  		  btn: ['去配置', '取消'],
		  		  		  shade: 0.6,//遮罩透明度
		  		  		  shadeClose:true,//点击遮罩关闭层
		  		  		  yes: function(index){
		  		  			callParent.openTab("transportation_express", 0, "物流网点", "admin/logistics/company.html", true);
		  		  		  }
		  		  		 });
	    		}
	    		if(trackingId){
	    			$("#expressList").val(trackingId);
	    		}
	    		 myAjax.ajaxSend("/express/selectOrgExpressNo.json",function(data){
	    			 $("#maxExpressNo").val(data.result);
	    			 $("#hideWarehouseId").val(warehouseId);
	    			 layer.open({
	    				 type: 1,
	    				 title:'快递单号修改',
	    				 content: $("#editExpressHtml"),           //弹窗内容
	    				 area: ["450px", "300px"],         //设置窗体高度 和宽度
	    				 btn: ["确定", "取消"],
	    				 closeBtn: 0,                      //取消右上角关闭按钮
	    				 btnAlign: 'r',
	    				 success:function (layero, index) {
	    					 layero.addClass('layui-form');
	    					 layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
	    					 form.render();
	    				 },
	    				 yes: function(index){
	    					 var data={
	    							 "orderId":orderId,
	    							 "expressOrgId":$("#expressList").val(),
	    							 "trackingNo":$("#maxExpressNo").val()
	    					 }
	    					 if(data.trackingNo!=null && data.trackingNo!=''){
	    					 myAjax.ajaxSend("/admin/order/updateOrderLogistics.json",function(){
	    						 layer.close(index);
	    						 getTrOrderDetail(openTr,true);
	    					 },data,'post')
	    					 }
	    				 }
	    			 })
				 },{'warehouseId': warehouseId,'expressId':$("#expressList").val()})
			 });
	    }

	    orderJhdPrint=function(orderId,version,jhdPrintCount,source){
	    	var printType=(source==1?"A4":"A5");
	    	var a4PrintHtml=printType+"打印：<input type='checkBox' class='a4print'>";
	    	layer.msg(a4PrintHtml+'<br>已打印'+jhdPrintCount+'次，是否继续？', {
	    		  time: 0, //不自动关闭
	    		  shade: 0.6,//遮罩透明度
	      		  shadeClose:true,//点击遮罩关闭层
	      		  btn: ['确定', '取消'],
	    		  yes: function(layero,index){
	    			  var checkStatus=index.find(".a4print");
	    			  if(source!=null&&source==1){
	    				  if(checkStatus.is(':checked')){
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderId, 'totalOrderDetailHtml', 'taobaoA4JxdTpl',false,function(){
		    					  var strBodyStyle = "<style>" + varTaobaoA4Css + "</style>";
		    					  $(".a4jxd").each(function(index,item){
		    						  var html=strBodyStyle+"<body>" + $(this).html() + "</body>";
		    						  jxdPrintA4(html,$(this).find(".orderSn").html(),index);
		    					  })
		    					  LODOP.PREVIEW();
		    					  getTrOrderDetail(openTr,true);
		    				  });

		    			  }else{
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderId, 'totalOrderDetailHtml', 'taobaoJxdTpl',false,function(){
		    					  var strBodyStyle = "<style>" + varTaobaoCss + "</style>";
		    					  $(".jxd").each(function(index,item){
		    						  var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
		    						  jxdPrint(html,$(this).find(".orderSn").html(),item);
		    					  })
		    					  LODOP.PREVIEW();
		    					  getTrOrderDetail(openTr,true);
		    				  });
		    			  }
	    			  }
	    			  else{
		    			  if(checkStatus.is(':checked')){
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderId, 'totalOrderDetailHtml', 'detailA4Tpl',false,function(){
		    					  var strBodyStyle = "<style>" + a4Css + "</style>";
		    					  $(".a4jxd").each(function(index,item){
		    						  var html=strBodyStyle+"<body>" + $(this).html() + "</body>";
		    						  jxdPrintA5(html,$(this).find(".orderSn").html(),index);
		    					  })
		    					  LODOP.PREVIEW();
		    					  getTrOrderDetail(openTr,true);
		    				  });

		    			  }else{
		    				  layer.close(layero);
		    				  myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderId, 'totalOrderDetailHtml', 'detailTpl',false,function(){
		    					  var strBodyStyle = "<style>" + varCss + "</style>";
		    					  $(".jxd").each(function(index,item){
		    						  var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
		    						  jxdPrint(html,$(this).find(".orderSn").html(),index);
		    					  })
		    					  LODOP.PREVIEW();
		    					  getTrOrderDetail(openTr,true);
		    				  });
		    			  }
	    			  }

	    		  }
      	 })
	    }

	     var varTaobaoCss ='* { margin: 0;padding: 0 } ul, li {list-style: none;margin-right: 20px;}' +
	        'table {display: block;border-collapse: collapse;width: 760px;font-size: 16px;table-layout: fixed;}' +
	        'i{font-style: normal;}.cf:before, .cf:after {display: block;content:"" ;clear: both;}' +
	        'li {float: left;}td {text-align: center;padding-left: 4px;height: 20px;word-wrap:break-word;word-break:break-all}' +
	        'h3 {height: 50px;line-height: 50px;width: 760px;text-align: center;}div ul {width: 760px;line-height: 26px;}' +
	        '.message {text-align: left;padding-left: 5px;height: 30px;}.content .total{text-align: left;height: 50px;}' +
	        '.total span{margin-right: 20px;font-size: 16px;font-weight: 700;}'+
	        '.content td,.content th {border: 1px dashed #000;line-height: 1;height: 30px;}'+
	        '.content td.no-border,.content th.no-border{border: none;}';

        var varTaobaoA4Css ='* { margin: 0;padding: 0 } ul, li {list-style: none;margin-right: 20px;}' +
        'table {display: block;border-collapse: collapse;width: 760px;font-size: 16px;table-layout: fixed;}' +
        'i{font-style: normal;}.cf:before, .cf:after {display: block;content:"" ;clear: both;}' +
        'li {float: left;}td {text-align: center;padding-left: 4px;height: 20px;word-wrap:break-word;word-break:break-all}' +
        'h3 {height: 50px;line-height: 50px;width: 760px;text-align: center;}div ul {width: 760px;line-height: 26px;}' +
        '.message {text-align: left;padding-left: 5px;height: 30px;}.content .total{text-align: left;height: 50px;}' +
        '.total span{margin-right: 20px;font-size: 16px;font-weight: 700;}'+
        '.content td,.content th {border: 1px dashed #000;line-height: 1;height: 30px;}'+
        '.content td.no-border,.content th.no-border{border: none;}.for-buyer { height: 550px; border-bottom: 1px dashed #000;}';

	    var a4Css='* { margin: 0;padding: 0 } ul, li { list-style: none;margin-right: 20px; } table { display: block; border-collapse: collapse; width: 760px;font-size: 14px;}'+
	    			'.box { width: 760px; position: relative; }.cf:before, .cf:after {display: block;content: "";clear: both;visibility: hidden;height: 0; }'+
	    			'td { text-align: center; padding-left: 6px; word-wrap: break-word;word-break: break-all}h3 {width: 760px;margin: 15px auto 20px; text-align: center; }'+
	    			'div ul { width: 760px;line-height: 26px;}.content .message { text-align: left;padding-left: 10px;height: 30px;}.total {text-align: right;padding: 10px 30px 0 0;'+
	    			' border-top: 1px dashed #000;}.bot th, .bot td {border-bottom: 1px dashed #000;height: 30px;}.border th, .border td {border: 1px dashed #000; }'+
	    			' .content td, .content th { border-bottom: 1px dashed #000; line-height: 1;font-size: 14px; padding: 7px 5px; } .fl { float: left; } .num-wrap {margin-right: 10px;}'+
	    			'.for-buyer { height: 500px; border-bottom: 1px dashed #000;}';

	    var varCss = '* { margin: 0;padding: 0 } ul, li {list-style: none;margin-right: 20px;}' +
        'table {display: block;border-collapse: collapse;width: 760px;font-size: 14px;}' +
        '.box {width: 760px;position: relative;}i{font-style: normal;}.cf:before, .cf:after {display: block;content:"" ;clear: both;}' +
        'li {float: left;}td {text-align: left;padding-left: 4px;height: 20px;word-wrap:break-word;word-break:break-all}' +
        'h3 {height: 50px;line-height: 50px;width: 760px;text-align: center;}div ul {width: 760px;line-height: 26px;}' +
        '.message {text-align: left;padding-left: 5px;height: 30px;}.total {text-align: right;padding: 10px 30px 0 0;border-top: 1px dashed #000;}' +
        '.bot th, .bot td {border-bottom: 1px dashed #000;height: 30px;}.border th, .border td {border: 1px dashed #000;}.content td{border-bottom: 1px dashed #000;}';
	    /**
	     *
	     * @param value
	     * @returns 订单状态 0-未创建支付宝交易(淘宝订单) 1-未确认、2-已支付、3-已审核、4-部分发货、5-已发货、6-已完成、7-退货中、8-退货完成、9-取消   10-0元购合约中(淘宝订单)

	     */
	    changeStatus=function(sendCount,unsendCount){
	    	if(sendCount==0){
	    		return "未发货";
	    	}else if(unsendCount==0){
	    		return "已发货";
	    	}else{
	    		return "部分发货";
	    	}
	    }
	    rechangeStatus=function(value){
	    	if(statusListMap!=null){
	    		return statusListMap.get(value);
	    	}else{
	    		 myAjax.ajaxSend("/admin/order/statusList.json",function(dataJson){
	    			 dataJson=dataJson.result;
	    			 statusListMap=new Map();
	    	    	 $.each(dataJson.orderStatusList,function(k,v){
	    	    		 statusListMap.push(v.value,v.desc);
	    	    	 })
	    	    	 return statusListMap.get(value);
	    		 });
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
	});
   });

	