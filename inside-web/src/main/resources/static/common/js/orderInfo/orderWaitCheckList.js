var form,element,layer,laytpl,myAjax,laydate;
var statusListMap;
var payStatusListMap;
var consignStatusListMap;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		 myAjax.ajaxTpl("/admin/platform/listAll.json", 'platformList', 'platformTpl');
		 myAjax.ajaxTpl("/admin/companyOrg/listWarehouseList.json", 'warehouseList', 'warehouseListTpl');
		 myAjax.ajaxSend("/admin/order/statusList.json",function(dataJson){
			 var result=dataJson.result;
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
		 form.on('select(warehouseFilter)', function(data){
				changeWarehouse(data.value);
			}); 
		 form.on('select(consumeFilter)', function(data){
			 changeConsume(data.value);
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
				map.push($("#searchSeletParam").val(), $("#searchParam").val())
				map.push('source', platformId)
				map.push('warehouseId', companyId)
				map.push('startTime', stime)
				map.push('endTime', etime)
		    	map.push('sellerFlag', flagId)
				mapObjParam=map.mapObj;
				myAjax.ajaxPage('/admin/order/pageWaitCheck.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			}
		 var orderObj = new Order(function (obj) {
				myAjax.ajaxPage('/admin/order/pageWaitCheck.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			},"relationInfo.create_time");
		 searchOrders();
		 callParent.isLoadEnd("order_toBeCheck_list");
	     callParent.register(function () {
	    	 //searchOrders();
	    	 refresh();
	        }, "search");
	     orderDetail=function(id){
		       callParent.openTab("order_detail", 0, "订单详情", "admin/order/order_details.html?id="+id+"&msgToclose=order_toBeCheck_list", true);
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
	    changeConsume=function(value){
	    	if(value<0){
				 $("#warehoustListSelect").html("<option value='-1'>请选择</option>");
				 form.render("select");
				 return;
			}
	    	var parentTree=","+value+",";
			var url="/admin/companyOrg/listWarehouseListWithNoSiteId.json?parentTree="+parentTree;
	   		myAjax.ajaxTpl(url, 'warehoustListSelect', 'warehouseListTpl');
	    }
	    changeWarehouse=function(value){
			if(value<0){
				value="";
			}
			var orderId=$("#changeWarehouseOrderId").val();
			var url="/admin/order/OrderProductInventoryInfoByOrderIdAndWarehouseId.json?orderId="+orderId+"&warehouseId="+value;
	   		myAjax.ajaxTpl(url, 'productAndInventoryList', 'tplOrderProductInventoryInfoTpl');

		}
	    checkOrder=function(id,warehouseId,trackingId,version,areaId){
	    	$("#productAndInventoryList").html("");
	    	if(areaId==null||areaId==""){
	    		return layer.msg("收货人地址信息不完整，请先进入详情页补充完整地址信息");
	    	}
	    	if(warehouseId==null){
	    		myAjax.ajaxTpl("/admin/companyOrg/listConsumeList.json", 'consumeListSelect', 'consumerListTpl',false,function(data){
	    			 $("#warehoustListSelect").html("<option value='-1'>选择仓库</option>");
	    		});
	    	}else{
	    		myAjax.ajaxSend("/admin/companyOrg/listWarehouseAndConsumer.json?warehouseId="+warehouseId,function(data){
	    			var result=data.result;
	    			if(result!=null){
	    				var consumerList=result.consumerList;
	    				var warehouseList=result.warehouseList;
	    				var siteId=warehouseList[0].siteId;
	    				var data1={
	    						"result":consumerList
	    				}
	    				var data2={
	    						"result":warehouseList
	    				}
	    				myAjax.getTpl('consumeListSelect', 'consumerListTpl',data1,false,function(html){
	    					$("#consumeListSelect").val(siteId);
	    				})
	    				myAjax.getTpl('warehoustListSelect', 'warehouseListTpl',data2,false,function(html){
	    					$("#warehoustListSelect").val(warehouseId);
	    				})
	    			}
	    		})
	    	}
	    	 
	    	 myAjax.ajaxTpl("/express/listAll.json", 'expressListSelect', 'expressListTpl',false,function(){
	       		 if(trackingId!=null&&trackingId!=""){
	       			 $("#expressListSelect").val(trackingId);
	       		 }
				var dataFreight;
				myAjax.ajaxSend("/deliveryTemplate/recommendExpress.json",function(dataJson){
					dataFreight = dataJson;
					$('#expressListSelect option').each(function(i,o){
						$.each(dataFreight.result,function(index,value){
							if(value.id==$('#expressListSelect option').eq(i).val()){
								$('#expressListSelect option').eq(i).text(o.text+'   (运费金额:'+value.freight+'元)');
							}
						});	
					});	 
	    		 },{'orderId':id},'post',false);
	       	 });
	    	 var storeMsg="";
	    	 myAjax.ajaxSend("/admin/order/supervisorInfoAndList.json",function(supervisorInfo){
	    		 $("#supervisorList").attr("disabled",false);
	    		 supervisorInfo=supervisorInfo.result;
	    		 var supervisorId=supervisorInfo.supervisorId;
	    		 var storeInfo=supervisorInfo.storeInfo;
	    		 if(storeInfo!=null){
	    			 storeMsg="(会员门店信息:"+storeInfo.companyName+",门店地址:"+storeInfo.fullAddress+")";
	    		 }
	    		 var supervisorList=supervisorInfo.supervisorList;
	    		 var supervisorListResult={
	    				 "result":supervisorList
	    		 }
	    		 myAjax.getTpl("supervisorList","supervisorListTpl",supervisorListResult,false,function(){
	    			 $("#supervisorList").val(supervisorId);
	    		 })
	    		 form.render("select");
                 $('#am-selected-supervisorList').selectMy({multiselect:false});
	       	 },{'orderId':id},'post',false);
	    	 
	    	 var url;
	       	 if(warehouseId!=null&&warehouseId>0){
	       		url="/admin/order/OrderProductInventoryInfoByOrderIdAndWarehouseId.json?orderId="+id+"&warehouseId="+warehouseId;
	       	 }else{
	       		url="/admin/order/OrderProductInventoryInfo.json?id="+id;
	       	 }
	   		 myAjax.ajaxTpl(url, 'productAndInventoryList', 'tplOrderProductInventoryInfoTpl',false,function(datajson){
	   			 var checkProflag=true;
	   			 $.each(datajson,function(k,p){
	   				 if(p.skuCode!=p.checkSkuCode||p.skuCode==""||p.skuCode==null){
	   					checkProflag=false;
	   				 }
	   			 })
	   			 layer.open({
	                 type: 1,
	                 title:'审核订单'+storeMsg,
	                 content: $("#checkOrderHtml"),           //弹窗内容
	                 area: ["800px", "400px"],         //设置窗体高度 和宽度
	                 btn: ["确定", "取消"],
	                 closeBtn: 0,                      //取消右上角关闭按钮
	                 btnAlign: 'r',
	                 success:function (layero, index) {
	                	  $("#changeWarehouseOrderId").val(id);
	                      layero.addClass('layui-form');
	                      layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
	                      form.render();
	                 },
	        		 yes: function(index){
	        			 if(checkProflag){
	        				 if($("#warehoustListSelect").val()<0||$("#consumeListSelect").val()<0){
	 	                		 return layer.msg("请选择经销商,仓库");
	        				  }else{
	        					  var logisticsInfoList=new Array();
	             					if($("#expressListSelect").val()!=null&&$("#expressListSelect").val()>0){
	             						var logisticsInfo={
	             								"trackingId":$("#expressListSelect").val(),
	             								"trackingName":$("#expressListSelect").find("option:selected").attr("title"),
	             						}
	             						logisticsInfoList.push(logisticsInfo);
									 }
									 var supervisorId=$("#supervisorList").val();
	             					//var supervisorId=$("#supervisorList").find(".am-checked").attr("val");
      	           					if(supervisorId<0){
      	           						supervisorId=null;
      	           					}
	             				  var data={
	             						  'id':id,
	             						  'warehouseId': $("#warehoustListSelect").val(), 
	             						  'logisticsList':logisticsInfoList,
	             						  'version':version,
	             						  'siteId':$("#consumeListSelect").val(),
	             						  'supervisorId':supervisorId,
	             				  }
	             				 $.ajax({
	              					type: 'post',
	              	                url: '/admin/order/verifyOrder.json',
	              	                data: JSON.stringify(data),
	              	                traditional : true,
	              	                dataType: "json",
	              	                contentType : "application/json; charset=utf-8",
	              	                success: function (dataJson) {
	              	                    if (dataJson.code == "0") {
	              	                    	 layer.close(index);
	        	        					 // searchOrders();
	        	        					  refresh();
	        	        					  layer.msg("审核成功");
	              	                    } else {
	              	                        layer.alert(dataJson.message);
	              	                    }
	              	                },
	              	                error: function () {
	              	                    layer.alert("系统错误请联系管理员");
	              	                }
	              	            });
	        			}
	        			}else{
	        				return layer.msg("存在商品sku为空，或者没有本地商品信息，请补充完整");
	        			}
	        		 },
                     end:function () {
                         $('#am-selected-supervisorList').unbind();
                         $('.am-selected-btn').unbind();
                     }
	             })
	   		 })
	        	
	    }
	    
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
		
		divideOrder=function(id,sn){
			if(sn!=null){
				var length=(sn.split('-')).length-1;
				if(length>4){
					return layer.msg("订单最多只能拆5次");
				}
			}
			callParent.openTab("order_divide", 0, "订单拆单", "admin/order/order_divide.html?id="+id+"&msgToclose=order_toBeCheck_list", true);
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

	