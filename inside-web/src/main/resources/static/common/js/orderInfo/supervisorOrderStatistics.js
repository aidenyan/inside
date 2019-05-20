var form,element,layer,laytpl,myAjax,laydate;
var payInfoMethodMap;
var payPlaguinMap;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		 myAjax.ajaxTpl("/admin/companyOrg/listWarehouseList.json", 'warehouseList', 'warehouseListTpl');
		 myAjax.ajaxTpl("/admin/platform/listInnerPaltform.json", 'platformList', 'platformTpl');
		 myAjax.ajaxTpl("/admin/common/supervisor/list.json", 'supervisorListSelect', 'supervisorListTpl');
		 myAjax.ajaxTpl("/admin/supervisor/listStoreType.json",'storeTypeList', 'storeTypeTpl');
		 myAjax.ajaxSend("/admin/payMethod/listOffLine.json",function(data){
			 if(data!=null&&data.result!=null){
				 var dataResult=data.result;
				 payInfoMethodMap=new Map();
				 $.each(dataResult,function(k,p){
					 payInfoMethodMap.push(p.id,p.name);
				 })
			 }
		 });
		 myAjax.ajaxSend("/admin/order/payPlaguinlist.json",function(data){
			 if(data!=null&&data.result!=null){
				 var dataResult=data.result;
				 payPlaguinMap=new Map();
				 $.each(dataResult,function(k,p){
					 payPlaguinMap.push(p.payPluginId,p.desc);
				 })
			 }
		 })
		 $("#btnSearch").click(function(){
			 searchOrders();
		 })
		  $("#exportOut").click(function(){
			 exportOut();
		 })
		 var mapObjParam;
		 searchOrders=function(){
				var companyId=$("#warehouseList").val();
				if(companyId<0){
					companyId=null;
				}
				var supervisorId=$("#supervisorListSelect").val();
				if(supervisorId<0){
					supervisorId=null;
				}
				var source=$("#platformList").val();
				if(source<0){
					source=null;
				}
				var storeType=$("#storeTypeList").val();
				if(storeType<0){
					storeType=null;
				}
				var stime="";
				var etime="";
				var consignStime="";
				var consignEtime="";
				if($("#timeSelect").val()<0){
					consignStime=$("#startDate").val();
					consignEtime=$("#endDate").val();
				}else{
					stime=$("#startDate").val();
					etime=$("#endDate").val();
				}
				if((stime==null||stime==""||etime==null||etime=="")&&(consignStime==null||consignStime==""||consignEtime==null||consignEtime=="")){
					return;
				}else{
					var map=new Map();
					map.push('warehouseId', companyId)
					map.push('supervisorId', supervisorId)
					map.push('startTime', stime)
					map.push('endTime', etime)
					map.push('consignStime', consignStime)
					map.push('consignEtime', consignEtime)
					map.push('source', source)
					map.push('storeType', storeType)
					mapObjParam=map.mapObj;
					myAjax.ajaxTpl('/admin/order/orderStatistics.json','page_tbody','pageTpl',false,function(result){
						if(result.incidental){
							$("#supervisorListSelect_div").hide();
						}

					},orderObj.setOption(mapObjParam),'post',function(dataJson){
                          for(var i=0;i<dataJson.result.length;i++){
							  var dataObj=dataJson.result[i];
							  var weightTotal=0;
							  for(var k=0;k<dataObj.orderDetailList.length;k++){
								  var orderDetail=dataObj.orderDetailList[k];
								  if(Utils.isNotNull(orderDetail.weight)){
									  weightTotal+=orderDetail.weight*orderDetail.buyNum;
								  }

							  }
							  dataJson.result[i].weightTotal=Utils.scale(weightTotal,5);
						  }
						return dataJson;
					});
				}
			}
		 exportOut=function(){
			 var companyId=$("#warehouseList").val();
				if(companyId<0){
					companyId="";
				}
				var supervisorId=$("#supervisorListSelect").val();
				if(supervisorId<0){
					supervisorId="";
				}
				var stime="";
				var etime="";
				var consignStime="";
				var consignEtime="";
				if($("#timeSelect").val()<0){
					consignStime=$("#startDate").val();
					consignEtime=$("#endDate").val();
				}else{
					stime=$("#startDate").val();
					etime=$("#endDate").val();
				}
				var source=$("#platformList").val();
				if(source<0){
					source="";
				}
				if((stime==null||stime==""||etime==null||etime=="")&&(consignStime==null||consignStime==""||consignEtime==null||consignEtime=="")){
					return;
				}else{
					window.open("/admin/order/orderStatisticsExport.json?warehouseId="+companyId+"&supervisorId="+supervisorId+"&startTime=" +
    	        			""+stime+"&endTime="+etime+"&consignStime="+consignStime+"&consignEtime="+consignEtime+"&source="+source);
				}
	    	}
		 var orderObj = new Order(function (obj) {
				myAjax.ajaxTpl('/admin/order/orderStatistics.json','page_tbody','pageTpl',false,function(){
					
				},orderObj.setOption(mapObjParam),'post');
			});
		callParent.isLoadEnd("order_orderStatistics");
	     callParent.register(function () {
	    	searchOrders();
	        }, "search");
	     
	    changePayStatus=function(payInfoList,newStatus,pointPaid){
	    	var payMethodMsg="";
	    	if(newStatus!=null&&newStatus==4){
	    		payMethodMsg="合单父单";
	    		return payMethodMsg;
	    	}
	    	if(pointPaid!=null&&pointPaid>0){
	    		payMethodMsg=(payMethodMsg==""?"":payMethodMsg+",")+"积分支付"
	    	}
	    	if(payInfoList!=null&&payInfoList.length>0){
	    		$.each(payInfoList,function(k,p){
	    			var payMetohdId=p.payMethodId;
	    			var payPluginId=p.payPluginId;
	    			if(payMetohdId!=null){
	    				if(payInfoMethodMap==null){
	    					 myAjax.ajaxSend("/admin/payMethod/listOffLine.json",function(data){
	    						 if(data!=null&&data.result!=null){
	    							 var dataResult=data.result;
	    							 payInfoMethodMap=new Map();
	    							 $.each(dataResult,function(k,p){
	    								 payInfoMethodMap.push(p.id,p.name);
	    							 })
	    							 payMethodMsg=(payMethodMsg==""?"":payMethodMsg+",")+payInfoMethodMap.get(payMetohdId);
	    						 }
	    					 });
	    					 
	    				}else{
	    					payMethodMsg=(payMethodMsg==""?"":payMethodMsg+",")+payInfoMethodMap.get(payMetohdId);
	    				}
	    			}
	    			if(payPluginId != null && p.outerPaySn != null){
	    				if(payPlaguinMap==null){
	    					myAjax.ajaxSend("/admin/order/payPlaguinlist.json",function(data){
	    						 if(data!=null&&data.result!=null){
	    							 var dataResult=data.result;
	    							 payPlaguinMap=new Map();
	    							 $.each(dataResult,function(k,p){
	    								 payPlaguinMap.push(p.payPluginId,p.desc);
	    							 })
	    							 payMethodMsg=(payMethodMsg==""?"":payMethodMsg+",")+payPlaguinMap.get(payPluginId);
	    						 }
	    					 })
	    				}else{
	    					payMethodMsg=(payMethodMsg==""?"":payMethodMsg+",")+payPlaguinMap.get(payPluginId);
	    				}
	    			}
	    			if(payPluginId != null && p.outerPaySn==null && newStatus!=null && newStatus==3 && pointPaid==0){
	    				payMethodMsg=(payMethodMsg==""?"":payMethodMsg+",")+"积分支付"
	    			}
	    		})
	    	}
	    	return payMethodMsg;
	    }
	    changeRemarkInfo=function(payInfoList,newStatus,pointPaid){
	    	var payMethodMsg="";
	    	if(newStatus!=null&&newStatus==4){
	    		if(payInfoList!=null&&payInfoList.length>0){
		    		$.each(payInfoList,function(k,p){
						var payMetohdId=p.payMethodId;
						var payMethodDesc=p.payMethodDesc;
		    			var payPluginId=p.payPluginId;
						var payRelationSn=p.relationSn;
		    			if(payMethodDesc!=null){
		    				if(payInfoMethodMap==null){
		    					myAjax.ajaxSend("/admin/payMethod/listOffLine.json",function(data){
		    						if(data!=null&&data.result!=null){
		    							var dataResult=data.result;
		    							payInfoMethodMap=new Map();
		    							$.each(dataResult,function(k,p){
		    								payInfoMethodMap.push(p.id,p.name);
										})
		    							payMethodMsg=(payMethodMsg==""?"子单":payMethodMsg+",子单")+payRelationSn+payMethodDesc;
		    						}
		    					});
		    					
		    				}else{
		    					payMethodMsg=(payMethodMsg==""?"子单":payMethodMsg+",子单")+payRelationSn+payMethodDesc;
		    				}
		    			}
		    			if(payMethodDesc==null && payPluginId!=null){
		    				if(payPlaguinMap==null){
		    					myAjax.ajaxSend("/admin/order/payPlaguinlist.json",function(data){
		    						if(data!=null&&data.result!=null){
		    							var dataResult=data.result;
		    							payPlaguinMap=new Map();
		    							$.each(dataResult,function(k,p){
		    								payPlaguinMap.push(p.payPluginId,p.desc);
		    							})
		    							payMethodMsg=(payMethodMsg==""?"子单":payMethodMsg+",子单")+payRelationSn+payPlaguinMap.get(payPluginId);
		    						}
		    					})
		    				}else{
		    					payMethodMsg=(payMethodMsg==""?"子单":payMethodMsg+",子单")+payRelationSn+payPlaguinMap.get(payPluginId);
		    				}
		    			}
		    		})
		    	}
	    	}
	    	return payMethodMsg;
	    }
	});
   });

	