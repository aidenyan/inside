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
			 var child = $('.datagrid-body').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		form.on('checkbox(mergeCheckBox)', function(data){
			 var child = $('#merOrderList').find('input[type="checkbox"]');
			 child.each(function (index, item) {
				 item.checked = data.elem.checked;
			 });
			 form.render('checkbox');
		 });
		 $("#btnSearch").click(function(){
			 searchOrders();
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
				var storageStatus=$("#enableList").val();
				if(storageStatus<0){
					storageStatus="";
				}
				var flagId=$("#flagList").val();
		    	 if(flagId<0){
		    		 flagId=null;
		    	 }
				var bcStatus=$("#bcStatusList").val();
				if(bcStatus<0){
					bcStatus="";
				}
				var map=new Map();
				map.push($("#searchSeletParam").val(), $("#searchParam").val())
				map.push('source', platformId)
				map.push('warehouseId', companyId)
				map.push('storageStatus', storageStatus)
				map.push('bcStatus', bcStatus)
				map.push('startTime', stime)
				map.push('endTime', etime)
		    	map.push('sellerFlag', flagId)
				mapObjParam=map.mapObj;
				myAjax.ajaxPage('/admin/order/pageWaitingfordelivery.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			}
		 var orderObj = new Order(function (obj) {
				myAjax.ajaxPage('/admin/order/pageWaitingfordelivery.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			},"relationInfo.create_time");
		 searchOrders();
		 $(".page_size_value").change(function(){
			 searchOrders();
	        })
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
	    	        		var companyId=$("#warehouseList").val();
	    	        		if(companyId<0){
	    	        			companyId='';
	    	        		}
	    	    	    	var flagId=$("#flagList").val();
	    	    	    	 if(flagId<0){
	    	    	    		 flagId='';
	    	    	    	 }
	    	    	    	 var bcStatus=$("#bcStatusList").val();
	    	    	    	 if(bcStatus<0){
	    	    	    		 bcStatus='';
	    	    	    	 }
	    	    	    	 var storageStatus=$("#enableList").val();
	    	    	    	 if(storageStatus<0){
	    	    	    		 storageStatus='';
	    	    	    	 }
	    	        		var stime=$("#startDate").val();
	    	        		var etime=$("#endDate").val();
	    	        		var str=$("#searchSeletParam").val();
	    	        		if(!isNaN(str)){
	    	        			str='';
	    	        		}
	    	        		layer.confirm('已审核待发货订单导出', {
	    	   				  btn: ['淘宝订单导出','其他订单导出'] //按钮
	    	   				}, function(index){
	    	   					layer.close(index);
	    	   					layer.msg('只会导出已审核待发货的淘宝订单', {
	    	   					  time: 0 //不自动关闭
	    	   					  ,btn: ['确定', '取消']
	    	   					  ,yes: function(index){
	    	   						layer.close(index);
	    	   						  if($("#searchSeletParam").val()==0){
	    	   							  window.open("/admin/order/taobaoVerifyOrderPageExport.json?startTime="+stime+"&endTime="+etime+"&source=" +
	    	   									  ""+platformId+"&warehouseId="+companyId+"&bcStatus="+bcStatus+"&storageStatus="+storageStatus+"&sellerFlag="+flagId);
	    	   						  }else{
	    	   							  window.open("/admin/order/taobaoVerifyOrderPageExport.json?startTime="+stime+"&endTime="+etime+"&source=" +
	    	   									  ""+platformId+"&warehouseId="+companyId+"&bcStatus="+bcStatus+"&storageStatus="+storageStatus+"&sellerFlag="+flagId+"&"+$("#searchSeletParam").val()+"="+encodeURI(encodeURI($("#searchParam").val(),"utf-8")));
	    	   						  }
	    	   					  }
	    	   					});
	    	   				}, function(){
	    	   				  return layer.msg('其他订单导出暂未开发,下个版本会依据导出需求更新')
	    	   				});
	    	         }
	    		}
	    		
	    	}

		 callParent.isLoadEnd("order_waitingfordelivery_list");
	     callParent.register(function () {
	    	// searchOrders();
	    	 refresh();
	        }, "search");

    		 orderDetail=function(id){
    		       callParent.openTab("order_detail", 0, "订单详情", "admin/order/order_details.html?id="+id+"&msgToclose=order_waitingfordelivery_list", true);
    		   }
    		 
    		 $("#addTowallen").on("click",function(){
    			 if($("#page_tbody input[type='checkbox']:checked").lengtn<1){
    				 return layer.msg("请先选择订单！");
    			 }
    			 var checkPlatformId="";
    			 var checkWarehouseId="";
    			 var flag=true;
    			 var orderList=new Array();
    			 $("#page_tbody input[type='checkbox']:checked").each(function(){
    				 var obj=$(this);
    				 var platformId=obj.parent().parent().attr("platformId");
    				 var warehouseId=obj.parent().parent().attr("warehouseId");
    				 var storageStatus=obj.parent().parent().attr("storageStatus");
    				 var version=obj.parent().parent().attr("version");
    				 var expressCount=obj.parent().parent().attr("expressCount");
    				 var printCount=obj.parent().parent().attr("printCount");
    				 var bcStatus=obj.parent().parent().attr("bcStatus");
    				 var sn=obj.parent().parent().parent().find(".orderSn").html();
    				 if(bcStatus=="true"){
    					 flag=false;
        				 return layer.msg(sn+"订单已加入过波次，无法在加入波次单！");
    				 }
    				 if(expressCount>0||printCount>0){
    					 flag=false;
        				 return layer.msg(sn+"订单已打印过快递单或者捡货单，无法在加入波次单！");
    				 }
    				 if(storageStatus=="false"){
    					 flag=false;
        				 return layer.msg(sn+"库存不足！");
    				 }
    				 if(checkPlatformId!=""){
    					 if(checkPlatformId!=platformId){
        					 flag=false;
    						 return layer.msg("请选择相同平台订单");
    					 }
    				 }else{
    					 checkPlatformId=platformId;
    				 }
    				 if(checkWarehouseId!=""){
    					 if(checkWarehouseId!=warehouseId){
        					 flag=false;
    						 return layer.msg("请选择相同仓库订单");
    					 }
    				 }else{
    					 checkWarehouseId=warehouseId;
    				 }
    				 var order={
    						 "id":obj.val(),
    						 "sn":sn,
    						 "source":platformId,
    						 "warehouseId":warehouseId,
    						 "version":version
    				 }
    				 orderList.push(order);
    			 })
    			 if(flag&&orderList.length>20){
    				 return layer.msg("最多选择20个加入波次单");
    			 }else if(flag&&orderList.length>0){
    				 var data={
    						 "listOrderInfo":orderList
    				 }
    				 $.ajax({
        					type: 'post',
        	                url: '/admin/order/addToWellen.json',
        	                data: JSON.stringify(orderList),
        	                traditional : true,
        	                dataType: "json",
        	                contentType : "application/json; charset=utf-8",
        	                success: function (dataJson) {
        	                    if (dataJson.code == "0") {
        	                    	//searchOrders();
        	                    	 refresh();
        	                    	layer.msg("已成功加入波次");
        	                    } else {
        	                        layer.msg(dataJson.message);
        	                    }
        	                },
        	                error: function () {
        	                    layer.msg("系统错误请联系管理员");
        	                }
        	            });
    			 }
    		 })
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
    	    sendGoods=function(orderId,expressCompany,trackingNo){
    	    	if(expressCompany==null||expressCompany==""||expressCompany=="null"){
    	    		return layer.msg("没有选择物流，无法发货！");
    	    	}else{
    	    		myAjax.ajaxSend("/admin/order/sendGoods.json?trackingNo="+trackingNo+"&orderId="+orderId,function(){
    	    			//searchOrders();
    	    			refresh();
    	    			layer.msg("发货成功");
        			})
    	    	}
    	    }
    	    
    	  //合并
    	    $("#mergeOrder").click(function () {
    	    	var selectOrderCount=$("#page_tbody input[type='checkbox']:checked").length;
    	    	if(selectOrderCount<1){
    	    		return layer.msg("合并订单时请最少选择一份订单！");
    	    	}
    	    	var flag_a=true;
    	    	$("#page_tbody input[type='checkbox']:checked").each(function(){
    	    		var status=$(this).parent().parent().parent().find(".consignee").attr("status");
    	    		var printCount=$(this).attr("printCount");
    	    		var expressCount=$(this).attr("expressCount");
    	    		if(printCount>0||expressCount>0){
    	    			flag_a=false;
    	    			return layer.msg("打印之后的订单都不允许合单");

    	    		}
    	    		if(status!=3){
    	    			 layer.msg("所选订单合并必须审核之后发货之前之前才能合单");
    	    			 flag_a=false;
    	    			 return false;
    	    		}
    	    		var newStatus=$(this).parent().parent().parent().find(".consignee").attr("newStatus");
    	    		if(newStatus!=0){
    	    			layer.msg("合单或者拆单之后的订单都不允许在合单");
    	    			 flag_a=false;
    	    			return false;
    	    			
    	    		}
    	    	})
    	    	if(flag_a){
    	    	var toSavecheckFlag=true;
    	    	var orderList=new Array();
    	    	var checkconsignee="";
    	    	var checkareaId="";
    	    	var checkstatus="";
    	    	var checkphone="";
    	    	var checkplatform="";
    	    	var checkwarehouse="";
    	    	var checkuserName="";
    	    	$("#page_tbody input[type='checkbox']:checked").each(function(){
    	    		var addressflag=true;
    	    		var consigneeflag=true;
    	    		var statusflag=true;
    	    		var phoneflag=true;
    	    		var warehouseflag=true;
    	    		var platformflag=true;
    	    		var userNameflag=true;
    	    		var orderId=$(this).val();
    	    		var obj=$(this).parent().parent().parent().find(".consignee");
    	    		var areaId=obj.attr("areaId");
    	    		var consignee=obj.attr("consignee");
    	    		var status=obj.attr("status");
    	    		var phone=obj.attr("phone");
    	    		var warehouseId=obj.attr("warehouseId");
    	    		var platformId=obj.attr("platformid");
    	    		var userName=obj.attr("userName");
    	    		var userId=obj.attr("userId");
    	    		if(checkareaId==""){
    	    			checkareaId=areaId;
    	    		}else{
    	    			addressflag=(checkareaId==areaId);
    	    		}
    	    		if(checkconsignee==""){
    	    			checkconsignee=consignee;
    	    		}else{
    	    			consigneeflag=(checkconsignee==consignee);
    	    		}
    	    		if(checkstatus==""){
    	    			checkstatus=status;
    	    		}else{
    	    			statusflag=(checkstatus==status);
    	    		}
    	    		if(checkphone==""){
    	    			checkphone=phone;
    	    		}else{
    	    			phoneflag=(checkphone==phone);
    	    		}
    	    		if(checkplatform==""){
    	    			checkplatform=platformId;
    	    		}else{
    	    			platformflag=(checkplatform==platformId);
    	    		}
    	    		if(checkwarehouse==""){
    	    			checkwarehouse=warehouseId;
    	    		}else{
    	    			warehouseflag=(checkwarehouse==warehouseId);
    	    		}
    	    		if(checkuserName==""){
    	    			checkuserName=userName;
    	    		}else{
    	    			userNameflag=(checkuserName==userName);
    	    		}
    	    		if(!(consigneeflag&&addressflag&&phoneflag)){
    	    			toSavecheckFlag=false;
    	    			return layer.msg("无法合并，所选订单存在收货信息不一致！");
    	    		}
    	    		if(!statusflag){
    	    			toSavecheckFlag=false;
    	    			return layer.msg("无法合并，所选订单状态不一致！");
    	    		}
    	    		if(!platformflag){
    	    			toSavecheckFlag=false;
    	    			return layer.msg("无法合并，所选订单平台不一致！");
    	    		}
    	    		if(!warehouseflag){
    	    			toSavecheckFlag=false;
    	    			return layer.msg("无法合并，所选仓库不一致！");
    	    		}
    	    		if(!userNameflag){
    	    			toSavecheckFlag=false;
    	    			return layer.msg("无法合并，会员信息不一致！");
    	    		}
    	    		if(userId!=null){
    	    			var order={
    	    					'id':orderId,
    	    					'areaId':areaId,
    	    					'consignee':consignee,
    	    					'phoneNo':phone,
    	    					'source':platformId,
    	    					'warehouseId':warehouseId,
    	    					'userId':userId,
    	    			}
    	    			orderList.push(order);
    	    		}else{
    	    			var order={
    	    					'id':orderId,
    	    					'areaId':areaId,
    	    					'consignee':consignee,
    	    					'phoneNo':phone,
    	    					'source':platformId,
    	    					'warehouseId':warehouseId,
    	    					'userName':userName,
    	    			}
    	    			orderList.push(order);
    	    		}
    	    	})
    	    	if(orderList!=null&&toSavecheckFlag){
    	    		$.ajax({
    	    			url : "/admin/order/selectCanMergeOrderCount.json",
    	    			type : "post",
    	    			data:JSON.stringify(orderList[0]),
    	    			traditional : true,
    	    			async:false,
    	    			dataType : "json",
    	    			contentType : "application/json; charset=utf-8",
    	    			success : function(data) {
    	    				if(data.code=="0"){
    	    					var count=data.result;
    	    					if(selectOrderCount==count){
    	    						if(count==1){
    	    	    	    			return layer.msg("没有其他可以合并的订单！");
    	    						}else{
    	    						var ids=new Array();
    								$.each(orderList,function(k,p){
    									ids.push(p.id);
    								}) 
    								var data={
    										'orderIdList':ids
    								}
    								openMerOrderList(data,null);
    	    						}
    	    					}else if(selectOrderCount<count){
    	    						layer.confirm('您有其他可以与所选订单合并的订单，需要显示其他订单吗？', {
    	   									btn: ['是','否'] //按钮
    	    							}, function(index){
    	    								openMerOrderList(orderList[0],index);
    	    							}, function(index){
    	    								var ids=new Array();
    	    								$.each(orderList,function(k,p){
    	    									ids.push(p.id);
    	    								})
    	    								if(ids.length<2){
    	    									layer.close(index);
    	    									return false;
    	    								}else{
    	    								var data={
    	    										'orderIdList':ids
    	    								}
    	    								openMerOrderList(data,index);
    	    								}
    	    							});
    	    					}else{
    	        					layer.alert("合单数据错误。无法合单！");
    	    					}
    	    				}else{
    	    					layer.alert("没有可以合并的订单！");
    	    				}
    	    			},
    	    			error:function(message){
    	    				layer.alert(message,{icon: 5});
    	    			}	
    	    		});
    	    	}
    	    	}
    	    });
    	    openMerOrderList=function(data,index){
    	    	if(index!=null){
    	    		layer.close(index);
    	    	}
    	    	$("#mergeCheckBox").attr("checked",false);
    			$.ajax({
    				url : "/admin/order/selectOrderInfoAndProductAndInventoryDetail.json",
    				type : "post",
    				data:JSON.stringify(data),
    				traditional : true,
    				dataType : "json",
    				contentType : "application/json; charset=utf-8",
    				success : function(data) {
    					if(data.code=="0"){
    						laytpl($("#merOrderListTpl").html()).render(data.result, function (html) {
    								$("#merOrderList").html(html);
    				                layer.open({
    				                	type: 1,
    				                	title: "合并订单",
    				                	btn: ['确定', '取消'],
    				                	closeBtn: 0,
    				                	btnAlign: 'r',
    				                	area: '1000px',
    				                	shadeClose: true,
    				                	content: $('#mergeHtml'),
    				                	success:function (layero, index) {
    				                		form.render();
    				                	},
    				                	yes: function(index){
    				                		saveMergeOrder(index);
    				                	}
    				                });
    				            });
    					}else{
    						layer.alert(data.message,{icon: 5});
    					}
    				},
    				error:function(message){
    					layer.alert(message,{icon: 5});
    				}	
    			});    							  
    	    }
    	    saveMergeOrder=function(index){
    	    	var listOrderInfo=new Array();
    	    	if($("#merOrderList input[type='checkbox']:checked").length<2){
    	    		return layer.msg("请至少选择2个订单");
    	    	}else{
    	    		$("#merOrderList input[type='checkbox']:checked").each(function(){
        	    		var parent=$(this).parent().parent();
        	    		var version=$(this).parent().find(".version").val();
        	    		var areaId=$(this).parent().find(".areaId").val();
        	    		var orderId=parent.attr("id");
        	    		var consignee=parent.find(".consignee").html();
        	    		var phone=parent.find(".phoneNo").html();
        	    		var warehouseId=parent.find(".warehouse").attr("warehouseId");
        	    		var source=parent.find(".source").attr("source");
        	    		var orderInfo={
        	    				'id':orderId,
        	    				'areaId':areaId,
        	    				'consignee':consignee,
        	    				'phoneNo':phone,
        	    				'source':source,
        	    				'warehouseId':warehouseId,
        	    				'version':version
        	    				
        	    		}
        	    		listOrderInfo.push(orderInfo);
        	    	})
        	    	var data={
        	        		'listOrderInfo':listOrderInfo
        	        	}
        	    	$.ajax({
        				url : "/admin/order/mergeOrder.json",
        				type : "post",
        				data:JSON.stringify(data),
        				traditional : true,
        				dataType : "json",
        				contentType : "application/json; charset=utf-8",
        				success : function(data) {
        					if(data.result==true){
        						layer.close(index);
        						//searchOrders();
        						 refresh();
        						layer.msg("合单成功！")
        					}else{
        						layer.alert(data.message,{icon: 5});
        					}
        				},
        				error:function(message){
        					layer.alert(message,{icon: 5});
        				}	
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



