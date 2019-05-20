var form,element,layer,laytpl,myAjax,laydate;
var snAndProMap;
var proSnAndSkuNameMap;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		var bcCode=params.get("bcCode");
		$("#localBcCode").html(bcCode);
		if(localBcCode!=null){
			 myAjax.ajaxTpl("/admin/order/bcOrderScanInfo.json?bcCode="+bcCode, 'all_jxd_tbody', 'allJxdTpl',false,function(data){
				 var orderProductList=data.orderProductList;
				 $.each(orderProductList,function(k,p){
					 var skuCode=p.skuCode;
					 var proName=p.proName;
					 var proSn=p.proSn;
					 var key= (proSn?proSn:skuCode);
					 if(proSnAndSkuNameMap==null){
						 proSnAndSkuNameMap=new Map();
						 var proInfo={
								 "proName":proName,
								 "key":key,
						 }
						 proSnAndSkuNameMap.push(key,proInfo);
					 }else{
						 var proInfo={
								 "proName":proName,
								 "key":key,
						 }
						 proSnAndSkuNameMap.push(key,proInfo);
					 }
					 var buyNum=p.buyNum;
					 var inventorySnNum=p.inventorySnNum;
					 if(inventorySnNum==null){
						 return layer.msg("无库位信息");
					 }
					 var snAndNumList=inventorySnNum.split(",");
					 if(snAndNumList!=null&&snAndNumList.length>0){
						 for(var i=0;i<snAndNumList.length;i++){
							 if(snAndNumList[i]!=null&&snAndNumList[i]!=""){
								 var snNumList=snAndNumList[i].split("*");
								 if(snNumList!=null&&snNumList.length>1){
									 var sn=snNumList[0];
									 var num=parseInt(snNumList[1]);
									 if(snAndProMap==null){
										 snAndProMap=new Map();
										 var proMap=new Map();
										 proMap.push(key,num);
										 snAndProMap.push(sn,proMap);
									 }else{
										 var proMap=snAndProMap.get(sn);
										 if(proMap!=null){
											 var normalnum=proMap.get(key);
											 if(normalnum!=null&&normalnum>0){
												 normalnum=num+normalnum;
												 proMap.push(key,normalnum);
											 }else{
												 proMap.push(key,num);
											 }
										 }else{
											 proMap=new Map();
											 proMap.push(key,num);
										 }
										 snAndProMap.push(sn,proMap);
									 }
								 }
							 }
						 }
					 }
				 })
		    	});
		}
	    
	        $('.no1').focus();
        $('.container-wrap').on('keyup',function (e) {
            var theEvent=e||window.event;
            var $target = $(e.target || e.srcElement);
            var code=theEvent.keyCode ||theEvent.which||theEvent.charCode;
            if(code===13){
                if($target.is('#inventorySn')){
                    var $inventorySn= $('#inventorySn')[0]
                    change1($inventorySn)
                }else if($target.is('.no2')){
                    var $proSn=$('.no2')[0]
                    change2($proSn)
                }
            }
        })
		   change1=function(obj) {
		 	var inventorySn=obj.value;
		 	if(snAndProMap!=null){
		 		var proMap=snAndProMap.get(inventorySn);
		 		if(proMap==null){
		 			obj.value="";
		 			return layer.msg("该波次无此库位");
		 		}else{
		 			$('.no2').focus(function () {
						$(this).select()
                    })
		 		}
		 	}
		    };
		    change2=function(obj) {
		    	var proSn=obj.value;
		    	var inventorySn=$('#inventorySn').val();
		    	if(proSnAndSkuNameMap!=null){
		    		var proInfo=proSnAndSkuNameMap.get(proSn);
		    		if(proInfo==null){
		    			obj.value="";
			 			return layer.msg("该波次无库位信息");
			 		}else{
			 			if(inventorySn!=null&&inventorySn!=""){
			 				if(snAndProMap==null){
			 					return layer.msg("该波次无此库位");
			 				}
			 				var proMap=snAndProMap.get(inventorySn);
			 				if(proMap==null){
			 					obj.value="";
			 					return layer.msg("该波次无此库位");
			 				}else{
			 					var proCheckInfo=proMap.get(proSn);
			 					if(proCheckInfo==null){
			 						obj.value="";
			 						return layer.msg("该波次库位下无此商品");
			 					}else{
			 						var proName=proInfo.proName;
					 				var key=proInfo.key;
					 				$("#localProName").html(proName);
					 				$("#hideSkuCode").val(key);
					 				$('.no3').focus(function () {
										$(this).select()
                                    })
			 					}
			 				}
			 			}else{
			 				var proName=proInfo.proName;
			 				var key=proInfo.key;
			 				$("#localProName").html(proName);
			 				$("#hideSkuCode").val(key);
			 				$('.no3').focus(function () {
								$(this).select()
                            })
			 			}
			 		}
		    	}
		    }
		    change3=function(obj) {
		    	var proNum=parseInt(obj.value);//输入数量
		    	var skuCode=$("#hideSkuCode").val();
		    	var inventorySn=$('#inventorySn').val();
		    	var buyNum;//实际购买数量
		    	var checkNum;//已检数量
		    	$("#all_jxd_tbody").find(".checkNum").each(function(){
		    		var checkCode=$(this).attr("skuCode");
		    		if(skuCode==checkCode){
		    			buyNum=$(this).attr("buyNum");
		    			checkNum=$(this).html();
		    		}
		    	})
		    	if(inventorySn!=null&&inventorySn!=""){
	 				var proMap=snAndProMap.get(inventorySn);
	 				if(proMap==null){
	 					obj.value="";
	 					return layer.msg("该波次无此库位");
	 				}else{
	 					var proCheckNum=proMap.get(skuCode);
	 					if(proCheckNum==null){
	 						obj.value="";
	 						return layer.msg("该波次库位下无此商品");
	 					}else{
			 				if(proNum!=proCheckNum){
			 					obj.value="";
					    		return layer.msg("数量不符");
			 				}else{
			 					if(proNum+parseInt(checkNum)>buyNum){
			 						obj.value="";
						    		return layer.msg("请不要重复拣此商品");
			 					}else{
			 						$("#all_jxd_tbody").find(".checkNum").each(function(){
			 				    		var checkCode=$(this).attr("skuCode");
			 				    		if(skuCode==checkCode){
			 				    			$(this).html(proNum+parseInt(checkNum));
			 				    		}
			 				    	})
			 					}
			 				}
	 					}
	 				}
	 			}
		    }
		    $("#completeScan").click(function(){
		    	var count=0;
		    	var array=new Array();
		    	$("#all_jxd_tbody").find(".checkNum").each(function(){
		    		var obj=$(this);
		    		var buyNum=obj.attr("buyNum");
		    		var skuCode=obj.attr("skuCode");
		    		var checkNum=obj.html();
		    		if(buyNum!=checkNum){
		    			return layer.msg("拣货未完成");
		    		}else{
		    			count++;
		    			var item={
		    					"skuCode":skuCode,
		    					"quantity":buyNum,
		    			}
		    			array.push(item);
		    		}
		    	})
		    	if(count==$("#all_jxd_tbody").find(".checkNum").length){
		    		var data={
		    				"bcCode":$("#localBcCode").html(),
		    				"orderItemList":array
		    		}
		    		$.ajax({
		    			url : "/admin/order/bcOrderScan.json",
		    			type : "post",
		    			data:JSON.stringify(data),
		    			traditional : true,
		    			dataType : "json",
		    			contentType : "application/json; charset=utf-8",
		    			success : function(data) {
		    				if(data.result==true){
		    					layer.msg('总拣成功', {
		    						 time: 1000
		    						 ,btn: ['确定']
		    						,yes: function(index){
		    						    layer.close(index);
		    						    window.location.href="bc_choice.html";
		    						}
		    			    	},function(){
		    						window.location.href="bc_choice.html";
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

	