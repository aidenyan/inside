var form,element,layer,laytpl,myAjax,laydate;
var scanStatusMap;
var logisticsListMap;
var productInfoMap;
var trackAndProInfoMap;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		var orderSn=params.get("orderSn");
		$("#orderSn").val(orderSn);
		if(orderSn!=null){
			 myAjax.ajaxSend("/admin/order/orderScanInfo.json?orderSn="+orderSn,function(data){
				 var data=data.result;
				 var scanInfoList=data.scanInfoList;
				 var orderProductList=data.inventoryList[0].orderProductListForSeller;
				 var orderInfo=data.orderInfo;
				 var scanEnumList=data.scanEnumList;
				 if(scanEnumList!=null){
					 if(scanStatusMap==null){
						 scanStatusMap=new Map();
						 $.each(scanEnumList,function(k,p){
							 scanStatusMap.push(p.value,p.desc);
						 })
					 }
				 }
				 if(orderProductList!=null){
					 if(productInfoMap==null){
						 productInfoMap=new Map();
						 $.each(orderProductList,function(k,p){
							 var proSn=p.proSn;
							 var skuCode=p.skuCode;
							 var buyNum=p.buyNum;
							 var proInfo={
									 "skuCode":skuCode,
									 "buyNum":buyNum,
							 }
							 productInfoMap.push(proSn,proInfo);
						 })
					 }
				 }
				 var proInfoList={
						 "result":orderProductList
				 }
				 myAjax.getTpl("proInfoList","proInfoTPL",proInfoList);
				 if(scanInfoList!=null){
					 var logistisList={
							 "result":scanInfoList
					 }
					 if(logisticsListMap==null){
						 logisticsListMap=new Map();
						 $.each(scanInfoList,function(k,p){
							 logisticsListMap.push(p.trackingNo,p.trackingNo);
						 })
					 }
					 myAjax.getTpl("logisticsList","logisticsTPL",logistisList);
				 }
		    	});
			}
			changeStatus=function(status){
				if(scanStatusMap!=null){
					return scanStatusMap.get(status);
				}else{
					return "";
				}
			}
			$('.no1').focus();
			$('.container-wrap').on('keyup',function (e) {
                    var theEvent=e||window.event;
                    var $target = $(e.target || e.srcElement);
                    var code=theEvent.keyCode ||theEvent.which||theEvent.charCode;
                    if(code===13){
                    	if($target.is('#trackingNo')){
                    		var $trackingNo= $('#trackingNo')[0]
                    		change1($trackingNo)
						}else if($target.is('#proSn')){
                    		var $proSn=$('#proSn')[0]
							change2($proSn)
						}
                    }
            })
			change1=function(obj){
				var value=obj.value;
				if(value==""||value==null){
					return;
				}
				if(trackAndProInfoMap!=null&&trackAndProInfoMap.get(value)==null){
					var key=trackAndProInfoMap.key();
					if(key!=null){
						for(var i=0;i<key.length;i++){
							$("#logisticsList").find("."+key[i]).html("已打包");
						}
					}
				}
				if(logisticsListMap==null){
					obj.value="";
					return layer.msg("无物流信息");
				}else{
					var checkLogistics=logisticsListMap.get(value);
					if(checkLogistics==null||checkLogistics==""){
						obj.value="";
						return layer.msg("无此物流信息");
					}else{
						$('.no2').select();
					}
				}
			}
			change2=function(obj){
				var value=obj.value;
				if(value==""||value==null){
					return;
				}
				var trackingNo=$("#trackingNo").val();
				if(productInfoMap==null){
					obj.value="";
					return layer.msg("无商品信息");
				}else{
					var proInfo=productInfoMap.get(value);
					if(proInfo==null){
						obj.value="";
						return layer.msg("此订单无此商品信息");
					}else{
						var skuCode=proInfo.skuCode;
						if(trackAndProInfoMap!=null){
							var checktrackAndProInfo=trackAndProInfoMap.get(trackingNo);
							if(checktrackAndProInfo!=null){
								$.each(checktrackAndProInfo,function(k,p){
									if(p!=null&&p.skuCode==value){
										obj.value="";
										return layer.msg("此物流下商品已拣货");
									}else{
										$('.no3').select();
									}
								})
							}else{
								$('.no3').select();
							}
						}else{
							$('.no3').select();
						}
					}
				}
			}
			change3=function(obj){
				var value=obj.value;
				if(value==""||value==null){
					return;
				}
				if(productInfoMap==null){
					obj.value="";
					return layer.msg("无商品信息");
				}else{
					var proSn=$("#proSn").val();
					var proInfo=productInfoMap.get(proSn);
					if(proInfo==null){
						obj.value="";
						return layer.msg("此订单无此商品信息");
					}else{
						var skuCode=proInfo.skuCode;
						var buyNum=proInfo.buyNum;
						var trackingNo=$("#trackingNo").val();
						var checkFlag=false;
						if(trackAndProInfoMap!=null){
							var checktrackAndProInfo=trackAndProInfoMap.get(trackingNo);
							if(checktrackAndProInfo!=null){
								$.each(checktrackAndProInfo,function(k,p){
									if(p!=null&&p.skuCode==skuCode){
										obj.value="";
										return layer.msg("此物流下商品已拣货");
									}else{
										checkFlag=true;
									}
								})
							}else{
								checkFlag=true;
							}
						}else{
							checkFlag=true;
						}
						if(checkFlag){
							var checknum;
							$("#proInfoList").find(".checkNum").each(function(){
								var checkCode=$(this).attr("skuCode");
								if(checkCode==skuCode){
									checknum=$(this).html();
								}
							})
							if(parseInt(value)+parseInt(checknum)>parseInt(buyNum)){
								obj.value="";
								return layer.msg("数量超出");
							}else{
								if(trackAndProInfoMap==null){
									trackAndProInfoMap=new Map();
								}
								var trackingNo=$("#trackingNo").val();
								var proSn=$("#proSn").val();
								var checktrackAndProInfo=trackAndProInfoMap.get(trackingNo);
								if(checktrackAndProInfo==null){
									var proInfo={
											"trackingNo":trackingNo,
											"skuCode":skuCode,
											"quantity":value,
									}
									var array=new Array();
									array.push(proInfo);
									trackAndProInfoMap.push(trackingNo,array);
								}else{
									var proInfo={
											"trackingNo":trackingNo,
											"skuCode":skuCode,
											"quantity":value,
									}
									checktrackAndProInfo.push(proInfo);
									trackAndProInfoMap.push(trackingNo,checktrackAndProInfo);
								}
								$("#proInfoList").find(".checkNum").each(function(){
									var checkCode=$(this).attr("skuCode");
									if(checkCode==skuCode){
										checknum=$(this).html(parseInt(value)+parseInt(checknum));
									}
								})
							}
						}
					}
				}
			}
		    $("#completeScan").click(function(){
		    	var count=0;
		    	$("#proInfoList").find(".checkNum").each(function(){
		    		var obj=$(this);
		    		var buyNum=obj.attr("buyNum");
		    		var skuCode=obj.attr("skuCode");
		    		var checkNum=obj.html();
		    		if(buyNum!=checkNum){
		    			return layer.msg("拣货未完成");
		    		}else{
		    			count++;
		    		}
		    	})
		    	if(count==$("#proInfoList").find(".checkNum").length){
		    		var orderInfo={
		    				"sn":$("#orderSn").val(),
		    		}
		    		var scanInfoList=new Array();
		    		if(trackAndProInfoMap!=null){
		    			$.each(trackAndProInfoMap.mapObj,function(k,p){
		    				for(var i=0;i<p.length;i++){
		    					scanInfoList.push(p[i]);
		    				}
		    			})
		    		}
		    		var data={
		    				"orderInfo":orderInfo,
		    				"scanInfoList":scanInfoList
		    		}
		    		$.ajax({
		    			url : "/admin/order/orderScan.json",
		    			type : "post",
		    			data:JSON.stringify(data),
		    			traditional : true,
		    			dataType : "json",
		    			contentType : "application/json; charset=utf-8",
		    			success : function(data) {
		    				if(data.result==true){
		    					layer.msg('分拣发货成功', {
		    						 time: 1000
		    						 ,btn: ['确定']
		    						,yes: function(index){
		    						    layer.close(index);
		    						    window.location.href="order_check.html";
		    						}
		    			    	},function(){
		    						window.location.href="order_check.html";
		    					})
		    				}else{
		    					return layer.msg("操作失败"); 
		    				}
		    			},
		    			error:function(message){
		    				return layer.msg("操作失败");
		    			}	
		    		});
		    	}
		    })
	});
   });

	