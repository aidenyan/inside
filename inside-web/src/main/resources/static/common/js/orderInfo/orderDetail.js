var form,element,layer,laytpl,myAjax,laydate;
var statusListMap;
var source;
var localOrderFlag;
var printFlag = false;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		form.on('select(provinceFilter)', function(data){
			changeProvince(data.value);
			}); 
		form.on('select(cityFilter)', function(data){
			changeCity(data.value);
			}); 
		form.on('select(warehouseFilter)', function(data){
			changeWarehouse(data.value);
		}); 
		 form.on('select(consumeFilter)', function(data){
			 changeConsume(data.value);
		 }); 
		form.on('select(expressChange)', function(data){
			 var warehouseId=$("#hideWarehouseId").val();
			 myAjax.ajaxSend("/express/selectOrgExpressNo.json",function(data){
    			 $("#maxExpressNo").val(data.result);
			 },{'warehouseId': warehouseId,'expressId':data.value})
		 });
		callParent.isLoadEnd("order_detail");
	    callParent.register(function () {
	    	 window.location.reload();
	        }, "search");
		var id=params.get("id");
		var parentId="";
		var msgToclose=params.get("msgToclose");
		var selectDivFlag=params.get("selectFlag");
		if(selectDivFlag!=null&&selectDivFlag!=""){
			$(".layui-tab-item").removeClass("layui-show");
			$(".show-this").removeClass("layui-this");
			$("#topProDiveInfo").addClass("layui-this");
			$("#proDiveInfo").addClass("layui-show");
		}
		var orderDetailInfo;
		if(id!=null){
			myAjax.ajaxSend("/admin/order/info.json",function(data){
				console.log(data)
				if(data!=null&&data.result!=null){
					var authorityCodeList=data.authorityCodeList;
					data=data.result;
					orderDetailInfo=data;
					parentId=data.parent;
					var inputStatus=data.status;
					var newStatus=data.newStatus;
					var sourceType=data.sourceType;
					source = data.source;
					localOrderFlag = data.localOrderFlag;
					var expressCount=data.expressCount;
					var printCount=data.printCount;
					if(printCount>0){
						printFlag = true;
					}
					var bcStatus=data.bcStatus;
					var toDtowarehouseId=data.warehouseId;
					var addressAreaId=data.areaId;
					if(addressAreaId==null){
						var addressMsg="(参考地址为："+data.fullAddress+"，请参考该地址选择区域，补充完整地址信息！)";
						$("#addresstips").append("<div style='display: inline-block;height: 30px;line-height: 30px'>" +
						"<span style='vertical-align: middle;color: #009cff;font-size:10px'>"+addressMsg+"</span></div>");
					}
					$("#hideWarehouseId").val(data.warehouseId);
					$("#orderSn").html(data.sn);
					$("#consignee").html(data.consignee);
					$("#platformName").html(data.sourceName);
					$("#warehouseName").html(data.warehouseName);
					$("#bcStatus").html(data.bcStatus==true?"已加入波次":"未加入波次");
					$("#userAccount").html(data.userName);
					$("#warehouseId").val(data.warehouseId);
					var ordertotalAmount=data.totalAmount;
					var orderpostFee=data.freight==null?0:data.freight;
					var orderpromotion=data.promotion==null?0:data.promotion;
					var ordercoupon=data.coupon==null?0:data.coupon;
					var orderadjustFee=data.offsetAmount==null?0:data.offsetAmount;
					var orderpayAmount=data.payAmount==null?0:data.payAmount;
					var orderPointpayAmount=data.pointPaid==null?0:data.pointPaid;
					var orderbalancepayAmount=data.balancePaid==null?0:data.balancePaid;
					var pointUsed=0
					if(data.orderDiscount !=null){
						pointUsed=data.orderDiscount.pointUsed==null?0:data.orderDiscount.pointUsed;
					}
					$("#orderAmount").html(ordertotalAmount);
					$("#postFee").html(orderpostFee);
					$("#promotion").html(orderpromotion);
					$("#promotionDesc").html(data.promotionName);
					$("#coupon").html(ordercoupon);
					$("#couponDesc").html(data.couponName);
					$("#adjustFee").html(orderadjustFee);
					$("#adjustRemark").html(data.offsetAmountRemark);
					var actrualFee=Utils.scale(ordertotalAmount+orderpostFee-orderpromotion-ordercoupon+orderadjustFee,2);
					$("#actrualFee").html(actrualFee);
					$("#showActrualPay").html(actrualFee);
					$("#payAmount").html(orderpayAmount);
					$("#proNum").html(data.proNum);
					$("#weight").html(data.proWeight);
					$("#coinAmount").html(orderPointpayAmount);
					$("#createTime").html(laydate.now(data.createTime,'YYYY-MM-DD hh:mm:ss'));
					$("#balancePayment").html(pointUsed);
					$("#consignTime").html(data.consignTime!=null?laydate.now(data.consignTime,'YYYY-MM-DD hh:mm:ss'):'');
					$("#jxdPrintCount").html(data.printCount);
					$("#expressPrintCount").html(data.expressCount);
					/*if(data.payMethod==0){
						$("#offlinePay").html(orderpayAmount);
					}else{
						$("#onlinePay").html(orderpayAmount);
					}*/
					$("#reciverName").val(data.consignee);
					$("#reciverNameShow").html(data.consignee);
					$("#reciverPhone").val(data.phoneNo);
					$("#reciverPhoneShow").html(data.phoneNo);

					laytpl($("#logisticsListTpl").html()).render(data.logisticsList, function (html) {
						$("#logisticsList").html(html);
	                        });
					laytpl($("#logListTpl").html()).render(data.logList, function (html) {
						$("#logInfoList").html(html);
					});
					laytpl($("#invoiceListTpl").html()).render(data.invoiceList, function (html) {
						$("#invoiceList").html(html);
					});
					laytpl($("#payInfoListTpl").html()).render(data.payInfoList, function (html) {
						$("#payInfoList").html(html);
					});
					if(data.areaId!=null&&data.areaId!=""){
						getAreaSelect(data.areaId);
					}else{
						getProvinceList();
					}
					$("#fullAddress").val(data.address);
                    $("#fullAddressT").html(data.fullAddress);
					$("#buyerMessage").val(data.buyerMessage);
					$("#sellerMessage").val(data.sellerMessage);
					var skuCodes=new Array();
					var checkOrderItemList=new Array();
					var orderItemList=data.orderItemList;
					$.each(orderItemList,function(k,p){
						skuCodes.push(p.skuCode);
						checkOrderItemList.push(p);
					})
					var orderProductInventoryList=data.orderProductInventoryList;
					var checkSkuCodeFlag=true;
					var orderItemInventoryListDetail=new Array();
					$.each(orderProductInventoryList,function(k,p){
						var normalSkuCode=p.skuCode;
						var checkSkuCode=p.checkSkuCode;
						if(normalSkuCode==null||normalSkuCode==""||checkSkuCode!=normalSkuCode){
							checkSkuCodeFlag=false;
						}
						var itemInfo={
								'skuCode':p.skuCode,
								'checkSkuCode':p.checkSkuCode,
								'productName':p.proName,
								'brandName':p.brandName,
								'productUnit':p.packageUnit,
								'categoryName':p.categoryName,
								'price':p.price,
								'num':p.buyNum,
								'saleInventory':p.saleNum,
								'inventoryNum':p.inventoryNum,
								'checkSkuCodeFlag':checkSkuCodeFlag
						}
						orderItemInventoryListDetail.push(itemInfo);
					})
					var orderItemDetail={
						"storageItemDTOList":orderItemInventoryListDetail
					}
					laytpl($("#tplStorageInItems").html()).render(orderItemDetail, function (html) {
						$("#storageInItemsContent").html(html);
					});
					if(checkSkuCodeFlag){
						clearProButton();
         	   			checkButtonStatus(data,authorityCodeList);
         	   			clearRecieverStatus();
         	   			clearEditButton(data);
					}else{
						checkButtonStatus(data,authorityCodeList);
         	   			forbidAllButton();
         	   			clearEditButton(data);
         	   			clearProButton();
					}
             	   	/*myAjax.ajaxTpl('/admin/order/getProductInfo.json?', 'storageInItemsContent', 'tplStorageInItems', true, function (dataJson) {
             	   		var itemcheckFlag=false;
             	   		var countItem=0;
             	   		var proNum=data.proNum;
             	   		$("#storageInItemsContent input[type='text'][name='proskuCode']").each(function(){
             	   			var skuCode=$(this).parent().find(".proSku").val();
             	   			var obj=$(this);
             	   			$.each(orderItemList,function(k,p){
             	   				if(skuCode==p.skuCode){
             	   					countItem+=p.quantity;
             	   					obj.parent().parent().parent().find(".proPrice").val(p.price);
             	   					obj.parent().parent().parent().find(".proNum").val(p.quantity);
             	   					obj.parent().parent().parent().find(".priceAmount").html(p.quantity*p.price);
             	   					obj.val(p.skuCode+"/"+p.name);
             	   					itemcheckFlag=true;
             	   					checkOrderItemList=removeOrderItem(checkOrderItemList,p.skuCode)
             	   				}
             	   			})
             	   		});
             	   		if(proNum==countItem){
             	   			clearProButton();
             	   			checkButtonStatus(data);
             	   			clearRecieverStatus();
             	   			clearEditButton(data);
             	   		}else{
             	   			checkButtonStatus(data);
             	   			forbidAllButton();
             	   			clearEditButton(data);
             	   			clearProButton();
             	   			var smg="";
             	   			$.each(checkOrderItemList,function(k,p){
             	   				var totalproprice=(p.price==null?0:p.price)*(p.quantity==null?0:p.quantity);
             	   				var skuInfo=(p.skuCode==null?'':p.skuCode);
             	   				smg+="<tr style='color:red'><td><div style='display:inline-block;' class='productSearchDiv'><input class='proSku' type='hidden' name='"+p.name+"'"
             	   				+"value='"+skuInfo+"'/> <input type='text' name='proskuCode' placeholder='商品名称/SKU编码' value='"+(skuInfo==''?'':skuInfo+'/')+p.name+"(没有本地sku商品信息)'"
				                +"class='layui-input small mizo-srarch-input productSearch' style='width:450px;color:red' autocomplete='off'></div></td>"
				               +"<td class='clearTd'></td>" 
				                +"<td class='clearTd'></td>"
				                +"<td class='clearTd'></td>"      
				                +"<td class='clearTd'>"+p.price+"</td>"
				                +"<td class='clearTd'>"+p.quantity+"</td>"
				                 +"<td name='priceAmount' class='priceAmount clearTd'>"+totalproprice+"</td>"   
				                   +"<td class='clearTd'></td>" 
				                +"<td class='clearTd'><div class='layui-btn-group deleteDiv'></div></td></tr>";
         	   				})
         	   				if($("#storageInItemsContent").find(".proPrice").length<1){
         	   					$("#storageInItemsContent").html(smg);
         	   				}else{
         	   					$("#storageInItemsContent").append(smg);
         	   				}
             	   		}
             	   	},{"skuCodes":skuCodes,"warehouseId":toDtowarehouseId},'post')*/
				}
			},{'id':id});
			myAjax.ajaxSend("/admin/order/storeInfo.json",function(data){
				if(data!=null&&data.result!=null){
					$("#storeInfo").show();
					$("#storeNo").html(data.result.agentCode);
					$("#storeName").html(data.result.companyName);
					$("#storeContact").html(data.result.legalPerson);
					$("#contactsPhone").html(data.result.contactPhone);
					$("#storeAddress").html(data.result.fullAddress);
				}else{
					$("#storeInfo").hide();
				}
			},{'orderId':id});
		}

		$("#sellerMessage").blur(function(){
			var data = {
				"id":id,
				"sellerMessage":$("#sellerMessage").val(),
			}
			myAjax.ajaxSend("/admin/order/updateOrder.json",function(data){
				if(!data.result==true){
					layer.msg("修改失败");
				}
			},data,'post')
		});

		$("#sellerMessage").keydown(function() {
			if (event.keyCode == "13") {
				$("#sellerMessage").blur();
				editSellerMessage();
			}
		});

		editSellerMessage=function(){
		var data = {
			"id":id,
			"sellerMessage":$("#sellerMessage").val(),
		}
		myAjax.ajaxSend("/admin/order/updateOrder.json",function(data){
			if(!data.result==true){
				layer.msg("修改失败");
			}
		},data,'post')
	}

		removeOrderItem=function(checkOrderItemList,sku){
			var newarray=new Array();
			$.each(checkOrderItemList,function(k,p){
				if(sku!=p.skuCode){
					newarray.push(p);
				}
			})
			return newarray;
		}
		changeWarehouse=function(value){
			if(value<0){
				value="";
			}
			var url="/admin/order/OrderProductInventoryInfoByOrderIdAndWarehouseId.json?orderId="+id+"&warehouseId="+value;
	   		myAjax.ajaxTpl(url, 'productAndInventoryList', 'tplOrderProductInventoryInfoTpl');

		}
		//编辑按钮
		clearEditButton=function(data){
			var value=data.status;
			var newStatus=data.newStatus;
			var sourceType=data.sourceType;

			//newStatus:拆单状态
			if(newStatus!=0||sourceType==null||(value==1&&sourceType==1)||value>2||value==null){
				$("#orderPriceEdit").addClass("layui-btn-disabled");
				$("#orderPriceEdit").unbind();
				$("#orderAddressEdit").addClass("layui-btn-disabled");
				$("#orderAddressEdit").unbind();
				$("#edit_commodity").addClass("layui-btn-disabled");
				$("#edit_commodity").unbind();
			}else{
				if(value>1){
					$("#orderPriceEdit").addClass("layui-btn-disabled");
					$("#orderPriceEdit").unbind();
				}else{
					$("#orderPriceEdit").addClass("active");
				}
				$("#orderAddressEdit").addClass("active");
				$("#edit_commodity").addClass("active");
			}
		}
		//商品信息按钮
		clearProButton=function(){
			$("#add_commodity").remove();
			$("#storageInItemsContent .productSearchDiv").find(".change").remove();
			$("#storageInItemsContent .deleteDiv").find(".delete").remove();
			$("#storageInItemsContent input[type='text'][name='proskuCode']").attr("disabled",true);
			$("#storageInItemsContent input[type='num'][name='proPrice']").attr("disabled",true);
			$("#storageInItemsContent .proPrice").each(function () {
				 $(this).attr("disabled",true);
		     });
			$("#storageInItemsContent .proNum").each(function () {
				$(this).attr("disabled",true);
			});
			form.render()
		}
		//解除流程按钮
		forbidAllButton=function(){
			clearButtonStatus();
			$("#payButton").addClass("layui-btn-disabled");
			$("#payButton").unbind();
			$("#divideButton").addClass("layui-btn-disabled");
			$("#divideButton").unbind();
			$("#checkButton").addClass("layui-btn-disabled");
			$("#checkButton").unbind();
			$("#printJxdButton").addClass("layui-btn-disabled");
			$("#printJxdButton").unbind();
			$("#printExpressButton").addClass("layui-btn-disabled");
			$("#printExpressButton").unbind();
			$("#sendGoodsButton").addClass("layui-btn-disabled");
			$("#sendGoodsButton").unbind();
			$("#cansleButton").addClass("layui-btn-disabled");
			$("#cansleButton").unbind();
			$("#completeButton").addClass("layui-btn-disabled");
			$("#completeButton").unbind();
		}
		//按条件控制流程按钮
		checkButtonStatus=function(data,authorityCodeList){
			if(data==null){
				forbidAllButton();
				return false;
			}
			var status=data.status;
			var newStatus=data.newStatus;
			var sourceType=data.sourceType;
			var expressCount=data.expressCount;
			var printCount=data.printCount;
			var bcStatus=data.bcStatus;
			if(newStatus==1||newStatus==2||newStatus==5||status==null){
				forbidAllButton();
			}else{
				switch (status) {
				case 1:
					clearButtonStatus();
					$("#logoInfo").addClass("ready_pay");
					if(sourceType==1){
						$("#payButton").addClass("layui-btn-disabled");
						$("#payButton").unbind();
						$("#cansleButton").addClass("layui-btn-disabled");
						$("#cansleButton").unbind();
					}else{
						var payFlag=false;
						for(var i=0;i<authorityCodeList.length;i++){
							if(authorityCodeList[i]=="order_payLocalOrder"){
								payFlag=true;
								break;
							}
						}
						if(payFlag){
							$("#payButton").addClass("active");
						}else{
							$("#payButton").addClass("layui-btn-disabled");
							$("#payButton").unbind();
						}
						$("#cansleButton").addClass("active");
					}
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");
					$("#printExpressButton").unbind();
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 2:
					clearButtonStatus();
					$("#logoInfo").addClass("ready_check");
					$("#divideButton").addClass("active");
					$("#checkButton").addClass("active");
					if(sourceType==1){
						$("#cansleButton").addClass("layui-btn-disabled");//第三方平台订单支付之后订单不能取消
						$("#cansleButton").unbind();//第三方平台订单支付之后订单不能取消
					}else{
						$("#cansleButton").addClass("active");//
					}
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");
					$("#printExpressButton").unbind();
					$("#sendGoodsButton").addClass("layui-btn-disabled");                 
					$("#sendGoodsButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 3:
					clearButtonStatus();
					$("#logoInfo").addClass("ready_send");
					if(expressCount!=null&&expressCount>0&&printCount!=null&&printCount>0){
						$("#sendGoodsButton").addClass("active");
					}else{
						$("#sendGoodsButton").addClass("layui-btn-disabled");
						$("#sendGoodsButton").unbind();
					}
					$("#printJxdButton").addClass("active");
					$("#printExpressButton").addClass("active");
					if(sourceType==1){
						$("#cansleButton").addClass("layui-btn-disabled");
						$("#cansleButton").unbind();
					}else{
						$("#cansleButton").addClass("active");//
					}
					$("#checkButton").html("取消审核");
					if(printCount>0||expressCount>0||bcStatus==true){
						$("#checkButton").addClass("layui-btn-disabled");
						$("#checkButton").unbind();
					}else{
						$("#checkButton").addClass("active");
					}
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 4:
					clearButtonStatus();
					$("#logoInfo").addClass("part_send");
					if(sourceType==1){
						$("#cansleButton").addClass("layui-btn-disabled");
						$("#cansleButton").unbind();
					}else{
						$("#cansleButton").addClass("active");////目前支付之后订单不能取消
					}
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");
					$("#printExpressButton").unbind();
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 5:
					clearButtonStatus();
					$("#logoInfo").addClass("already_send");
					$("#completeButton").addClass("active");
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#printJxdButton").addClass("active");
					$("#printExpressButton").addClass("active");					
					$("#cansleButton").addClass("layui-btn-disabled");
					$("#cansleButton").unbind();
					break;
				case 6:
					clearButtonStatus();
					$("#logoInfo").addClass("finsh");
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#printJxdButton").addClass("active");
					$("#printExpressButton").addClass("active");				
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#cansleButton").addClass("layui-btn-disabled");
					$("#cansleButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 7:
					clearButtonStatus();
					$("#logoInfo").addClass("backing");
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");					
					$("#printExpressButton").unbind();					
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#cansleButton").addClass("layui-btn-disabled");
					$("#cansleButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 8:
					clearButtonStatus();
					$("#logoInfo").addClass("already_back");
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");					
					$("#printExpressButton").unbind();				
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#cansleButton").addClass("layui-btn-disabled");
					$("#cansleButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 9:
					clearButtonStatus();
					$("#logoInfo").addClass("cancel");
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");					
					$("#printExpressButton").unbind();					
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#cansleButton").addClass("layui-btn-disabled");
					$("#cansleButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				case 10:
					clearButtonStatus();
					$("#logoInfo").addClass("canceling");
					$("#payButton").addClass("layui-btn-disabled");
					$("#payButton").unbind();
					$("#divideButton").addClass("layui-btn-disabled");
					$("#divideButton").unbind();
					$("#checkButton").html("取消审核");
					$("#checkButton").addClass("layui-btn-disabled");
					$("#checkButton").unbind();
					$("#printJxdButton").addClass("layui-btn-disabled");
					$("#printJxdButton").unbind();
					$("#printExpressButton").addClass("layui-btn-disabled");					
					$("#printExpressButton").unbind();					
					$("#sendGoodsButton").addClass("layui-btn-disabled");
					$("#sendGoodsButton").unbind();
					$("#cansleButton").html("取消中");
					$("#cansleButton").addClass("layui-btn-disabled");
					$("#cansleButton").unbind();
					$("#completeButton").addClass("layui-btn-disabled");
					$("#completeButton").unbind();
					break;
				default:
					break;
				}
			}
		}
		//收货人信息不可编辑
		clearRecieverStatus=function(){
			$(".addressEdit").attr("disabled",false);
		}
		//
		clearProButton=function(){
			$("#add_commodity").remove();
			$("#storageInItemsContent").find(".change").remove();
			$("#storageInItemsContent").find(".delete").remove();
			$("#storageInItemsContent input[type='num'][name='proPrice']").attr("disabled","disabled");
			$("#storageInItemsContent .proPrice").each(function () {
				 $(this).attr("disabled","disabled");
		     });
			$("#storageInItemsContent .proNum").each(function () {
				$(this).attr("disabled","disabled");
			});
		}
		clearButtonStatus=function(){
			$("#payButton").removeClass("layui-btn-disabled active");
			$("#divideButton").removeClass("layui-btn-disabled active");
			$("#checkButton").removeClass("layui-btn-disabled active");
			$("#printJxdButton").removeClass("layui-btn-disabled active");
			$("#printExpressButton").removeClass("layui-btn-disabled active");			
			$("#sendGoodsButton").removeClass("layui-btn-disabled active");
			$("#cansleButton").removeClass("layui-btn-disabled active");
			$("#completeButton").removeClass("layui-btn-disabled active");
		}
		refreshLocalHtml=function(selectFlag){
			callParent.parentUse(msgToclose, "search");
			if(selectFlag!=null&&selectFlag!=""){
				window.location.href='order_details.html?msgToclose='+msgToclose+"&id="+orderDetailInfo.id+"&selectFlag="+selectFlag;
			}else{
				window.location.href='order_details.html?msgToclose='+msgToclose+"&id="+orderDetailInfo.id;
			}
		}
		/*$("#add_commodity").bind('click',function () {
			myAjax.getTpl('storageInItemsContent', 'tplAddItems', {"result": []}, true);
		});*/
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
		addCommodity=function(){
			myAjax.getTpl('storageInItemsContent', 'tplAddItems', {"result": []}, true);
		}
		var varTr;
        $(document).on('click', '.change', function () {
            varTr = $(this).closest("tr");
                $("#proListContent").html('');
                $("#pageNum").html('');
                $("#form_addCommodity").find('input[type="checkbox"]').attr('checked', false);
                layer.open({
                    title: "添加商品"
                    , type: 1
                    , content: $("#form_addCommodity")            //弹窗内容
                    , area: ["800px", "500px"]         //设置窗体高度 和宽度
                    , btn: ["确定", "取消"]
                    , closeBtn: 0                      //取消右上角关闭按钮
                    , btnAlign: 'r'

                    , success: function (layero, index) {
                        //获取分类
                        myAjax.ajaxTpl("/admin/common/category/list.json", 'slcProductType', 'tplOption', true);
                        //获取品牌
                        myAjax.ajaxTpl("/admin/common/brand/list.json", 'slcBrand', 'tplOption', true);

                        layero.addClass('layui-form');
                        layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '');
                        form.render();
                    }
                    , yes: function (index, item) {
                    	if($(item.selector + " input[name='skuCodes']:checked").serialize().length>0){
                    		var skuCodes=new Array();
                    		$(item.selector + " input[name='skuCodes']:checked").each(function(){
                    			skuCodes.push($(this).val())
                    		})
                    		myAjax.ajaxTpl('/admin/order/getProductInfo.json?', 'storageInItemsContent', 'tplStorageInItems', true, function (data) {
                    			layer.close(index);
                    			varTr.remove();
                    			resetTotalAmountNum();
                    		}, {"skuCodes":skuCodes,"warehouseId":orderDetailInfo.warehouseId},'post');
                    		$("#storageInItemsContent").find('input[type="text"][name=""]').parent().parent().parent().remove();
                    	}else{
                    		return false;
                    	}
                    }
                    , btn: ["确定", "取消"]
                });
            return false;
        });
        $("#storageInItemsContent").on('keyup', '.productSearch', function () {
            var varThis = $(this);
            if(varThis.val()==""||varThis.val()==null){
            	$(".proSearchDiv").remove();
            	 return false;
            }
           // varThis.prev().val('');
                var varSku = [];
                $("#storageInItemsContent").find(".proSku").each(function () {
                    varSku.push($(this).val());
                });
                myAjax.ajaxSend('/admin/order/listProduct.json', function (dataJson) {
                    var getTpl = $("#tplProductLi").html();
                    laytpl(getTpl).render(dataJson.result.result, function (html) {
                        varThis.parent().children('.proSearchDiv').each(function () {
                           $(this).remove();
                        });
                        var varDivPL = '<div class="proSearchDiv" style="position:absolute; max-height:150px; overflow:auto">' + html + '</div>';
                        if (dataJson.result != null && dataJson.result != ''&&dataJson.result.result.length>0) {
                            varThis.next().after(varDivPL);
                            varTr = varThis.closest("tr");
                            $("#storageInItemsContent .proSearchDiv").find('li').click(function () {
                                var vSkuCode = $(this).attr('skucode');
                                var skuCodes=new Array();
                                skuCodes.push(vSkuCode)
                                var url="/admin/order/getProductInfo.json";
                                myAjax.ajaxTpl(url, 'storageInItemsContent', 'tplStorageInItems', true, function () {
                                    varTr.remove();
                                    resetTotalAmountNum();
                                },{"skuCodes":skuCodes,"warehouseId":$("#warehouseId").val()},'post');
                                $(this).closest('div').remove();
                            });
                        }else{
                             var hideSku = varThis.prev().val();
                             if (hideSku == '') {
                                 varThis.closest("tr").find(".clearTd").html("");
                             }
                             resetTotalAmountNum();
                        }
                    });
                }, {"warehouseId":$("#warehouseId").val(),"inputStr": varThis.val(), "notInSku": varSku},'post');
        });
        /*$("#storageInItemsContent").on('blur', '.productSearch', function () {
            var varThis = $(this);
            var hideSku = varThis.prev().val();
            if (hideSku == '') {
                varThis.val('');
                varThis.closest("tr").find(".clearTd").html("");
            }
            resetTotalAmountNum();
        });*/
        form.on('submit(search)', function (data) {
                var varSku = [];
                $("#storageInItemsContent").find(".proSku").each(function () {
                    varSku.push($(this).val());
                });
                myAjax.ajaxPage('/admin/order/listProduct.json', 'pageNum','proListContent','tplProList',$.extend(data.field, {
                    "notInSku": varSku
                }),'post');
            return false;
        });
        
        $('.list-details').click(function (e) {
            e = e || window.event
            var $target = $(e.target || e.srcElement);
            if ($target.is(".btn_edit")) {
                $target.parent().siblings('div').show();
                $target.parent().siblings('div').children('input').focus()
                $target.parent().hide();
                $target.parent().siblings('div').children('input').val($target.siblings('span').html())
                var $input=$target.parent().siblings('div').children('input');
                $input.blur(function () {
                    $target.prev().html($(this).val());
                    $(this).parent().hide();
                    $target.parent().show();
                    resetAdjustFee();
                })
            }
        })
        $("#storageInItemsContent").on('click', '.delete', function () {
            $(this).closest('tr').remove();
        	resetTotalAmountNum();
        });
        $("#storageInItemsContent").on("keyup change", ".proPrice", function () {
        	resetTotalAmountPrice();
        });
        $("#storageInItemsContent").on("keyup change", ".proNum", function () {
        	resetTotalAmountNum();
        });
        $("#closeButton").click(function () {
		    callParent.openTab(msgToclose);
		    callParent.closeTab('order_detail'); 
        });
        $("#divideButton").click(function () {
        	  $(this).parents('.layui-tab-item').removeClass("layui-show");
              $(this).parents('.layui-tab-item').next().addClass("layui-show");
              $('.layui-this').next().addClass('layui-this')
              $('.layui-this').eq(0).removeClass('layui-this');
        });
        $("#reduceOrder").click(function () {
        	if($("#showDivideNum").val()==1){
        		return layer.msg("无法再减少");
        	}
        	$("#parentProductInfo").append($("#parentProductInfo").html());
        });
        
        $("#cansleButton").click(function () {
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
			}
			if(printFlag){
				layer.msg("此单已打印,是否取消",{
					time: 0, //不自动关闭
					shade: 0.6,//遮罩透明度
					shadeClose:true,//点击遮罩关闭层
					btn: ['确定', '取消'],
					yes: function(index){
						var newStatus=orderDetailInfo.newStatus;
						if(newStatus!=null&&newStatus==3){
							var checkFlag=false;
							myAjax.ajaxSend("/admin/order/checkCansleOrder.json",function(data){
								if(data!=null&&data.result!=null&&data.result==true){
									layer.msg("此子单原单中有赠送商品，不能部分取消，只能全部取消，是否全部取消", {
										time: 0, //不自动关闭
										shade: 0.6,//遮罩透明度
										shadeClose:true,//点击遮罩关闭层
										btn: ['确定', '取消'],
										yes: function(index){
											 myAjax.ajaxSend("/admin/order/cansleOrder.json",function(){
												 layer.close(index);
												 layer.msg("已发起取消订单流程");
												 refreshLocalHtml();
											 },{'id':id})
										}
									})
								}else{
									layer.msg('此操作会发起取消订单流程，<br>待审核之后会自动取消', {
										  time: 0, //不自动关闭
										  shade: 0.6,//遮罩透明度
											shadeClose:true,//点击遮罩关闭层
											btn: ['确定', '取消'],
										  yes: function(index){
											  myAjax.ajaxSend("/admin/order/cansleOrder.json",function(){
												  layer.msg("已发起取消订单流程");
												  refreshLocalHtml();
											  },{'id':id})
										  }
									 })
								}
							},{'id':orderDetailInfo.parent})
							
						}else{
							layer.msg('此操作会发起取消订单流程，<br>待审核之后会自动取消', {
								time: 0, //不自动关闭
								shade: 0.6,//遮罩透明度
								shadeClose:true,//点击遮罩关闭层
								btn: ['确定', '取消'],
								yes: function(index){
									myAjax.ajaxSend("/admin/order/cansleOrder.json",function(){
										layer.msg("已发起取消订单流程");
										 refreshLocalHtml();
									},{'id':id})
								}
							})
						}
					}
				})
			}else{
				var newStatus=orderDetailInfo.newStatus;
				if(newStatus!=null&&newStatus==3){
					var checkFlag=false;
					myAjax.ajaxSend("/admin/order/checkCansleOrder.json",function(data){
						if(data!=null&&data.result!=null&&data.result==true){
							layer.msg("此子单原单中有赠送商品，不能部分取消，只能全部取消，是否全部取消", {
								time: 0, //不自动关闭
								shade: 0.6,//遮罩透明度
								shadeClose:true,//点击遮罩关闭层
								btn: ['确定', '取消'],
								yes: function(index){
									 myAjax.ajaxSend("/admin/order/cansleOrder.json",function(){
										 layer.close(index);
										 layer.msg("已发起取消订单流程");
										 refreshLocalHtml();
									 },{'id':id})
								}
							})
						}else{
							layer.msg('此操作会发起取消订单流程，<br>待审核之后会自动取消', {
								  time: 0, //不自动关闭
								  shade: 0.6,//遮罩透明度
									shadeClose:true,//点击遮罩关闭层
									btn: ['确定', '取消'],
								  yes: function(index){
									  myAjax.ajaxSend("/admin/order/cansleOrder.json",function(){
										  layer.msg("已发起取消订单流程");
										  refreshLocalHtml();
									  },{'id':id})
								  }
							 })
						}
					},{'id':orderDetailInfo.parent})
					
				}else{
					layer.msg('此操作会发起取消订单流程，<br>待审核之后会自动取消', {
						time: 0, //不自动关闭
						shade: 0.6,//遮罩透明度
						shadeClose:true,//点击遮罩关闭层
						btn: ['确定', '取消'],
						yes: function(index){
							myAjax.ajaxSend("/admin/order/cansleOrder.json",function(){
								layer.msg("已发起取消订单流程");
								 refreshLocalHtml();
							},{'id':id})
						}
					})
				}
			}
        });
        var orderPriceEditFlag=true;
        $("#orderPriceEdit").click(function () {
			var defaultVal = $('#userAccount').text();
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
			}
        	if(orderPriceEditFlag){
        		orderPriceEditFlag=false;
        		$("#orderPriceEdit").html("完成");
        		if(localOrderFlag===1){
					$('#userAccount').hide();
					$('.userAccountEdit').after('<input type="text" id="userAccountEdit" class="addEditinput" style="border: 1px solid #FF5722;height: 23px;margin-left: 5px;padding-left: 3px;color: #646976">')
					$('.addEditinput').val(defaultVal);
				}
        		$(".priceEdit").each(function(){
        			$(this).parent().hide();
        			$(this).parent().parent().find(".editInput").val($(this).html());
        			$(this).parent().parent().find(".edit").show();
        		})
        		forbidAllButton();
			} else if($("#userAccountEdit").val()!=undefined&&(($("#userAccountEdit").val()==""||$("#userAccountEdit").val().length>40))){
				if($("#userAccountEdit").val()==""){
					layer.msg("会员帐号不能为空");
				}
				if($("#userAccountEdit").val().length>40){
					layer.msg("会员帐号不能超过40个字符");
				}
			} else{
        		orderPriceEditFlag=true;
				$("#orderPriceEdit").html("编辑");
                $('#userAccount').show().html($('.addEditinput').val());
				$('.addEditinput').remove()
        		$(".editInput").each(function(){
        			$(this).parent().hide();
        			$(this).parent().parent().find("span").html($(this).val());
        			$(this).parent().parent().find(".normalEdit").show();
        		})
        		resetTotalAmountPrice();
        		var data={
        				"orderId":id,
        				"offsetAmount":$("#adjustFee").html(),
        				"offsetAmountRemark":$("#adjustRemark").html(),
						"postFee":$("#postFee").html(),
						"source":source,
						"userName":$("#userAccount").html()
				}
        		myAjax.ajaxSend("/admin/order/updatePrice.json",function(data){
        			if(data!=null&&data.result==true){
						layer.msg("修改成功");
						refreshLocalHtml();
        			}
				},data,'post')
				// myAjax.ajaxSend("/admin/order/updateUser.json",function(data){
        		// 	if(data!=null&&data.result==true){
        		// 		layer.msg("修改成功");
        		// 		 refreshLocalHtml();
        		// 	}
				// },userData,'post')
				

        	}
        });
        var orderAddressEditFlag=true;
        $("#orderAddressEdit").click(function () {
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
        	}
			$('#addresstipsW').show();
        	$('#fullAddressW').show();
        	$('#fullAddressTW').hide();
        	$('#nameTelMessage').show();
        	$('#nameTelMessageShow').hide();
        	if(orderAddressEditFlag){
        		orderAddressEditFlag=false;
        		$("#orderAddressEdit").html("完成");
        		$(".addressEdit").attr("disabled",false);
        		forbidAllButton();
        		form.render();
        	}else{
    			var consignee=$("#reciverName").val();
				var phoneNo=$("#reciverPhone").val();
				var areaId=getselectAreaId();
				var fullAddress=$("#fullAddress").val();
				var sellerMessage=$("#sellerMessage").val();
				var province=""+$("#province").find("option:selected").text();
				var city=""+$("#city").find("option:selected").text();
				var area=""+$("#sysarea").find("option:selected").text();
				var address="";
				if($("#sysarea").val()!=""&&$("#sysarea").val()!=null){
					address+=province+city+area;
				}else{
					address+=province+city;
				}
				if(consignee==null||consignee==""||phoneNo==null||phoneNo==""||areaId==null||areaId==""||fullAddress==""||fullAddress==null){
					return layer.msg("收货人信息不能为空");
					
				}
				/*if(($("#city").find("option").length>1&&$("#city").find("option:selected").val=="")||($("#sysarea").find("option").length>1&&$("#sysarea").find("option:selected").val()=="")){
					return layer.msg("所在地区请选择完整");
				}*/
				if($("#city").find("option").length>1&&($("#city").find("option:selected").val==""||$("#city").find("option:selected").text()=="")){
					return layer.msg("市区必须选择");
				}
				 var data={
						  'id':id,
						  'consignee':consignee,
						  'phoneNo':phoneNo,
						  'areaId':areaId,
						  'province':province,
						  'city':city,
						  'distrinct':area,
						  'address':fullAddress,
						  'fullAddress':address+fullAddress,
						  'sellerMessage':sellerMessage
				  }
        		myAjax.ajaxSend("/admin/order/updateAddress.json",function(data){
        			if(data!=null&&data.result==true){
        				$("#orderAddressEdit").html("编辑");
        				orderAddressEditFlag=true;
        				layer.msg("修改成功");
        				 refreshLocalHtml();
        			}
        		},data,'post')
        	}
        });
        getProInfo=function(){
        	var totalAmount=$("#orderAmount").html();
        	var payAmount=$("#actrualFee").html();
        	var orderItemList=new Array();
        	$("#storageInItemsContent input[type='text'][name='proskuCode']").each(function(){
        		var skuCode=$(this).parent().find(".proSku").val();
        		var name=$(this).parent().find(".proSku").attr("name");
        		var singlePrice=$(this).parent().parent().parent().find(".proPrice").val();
        		var singleNum=$(this).parent().parent().parent().find(".proNum").val();
        		var trPrice=(singlePrice==null?0:singlePrice)*(singleNum==null?0:singleNum);
        		var productInfo={
        				'skuCode':skuCode,
        				'name':name,
        				'price':singlePrice,
        				'quantity':singleNum
        		}
        		orderItemList.push(productInfo);
        	})
        	var data={
        		'totalAmount':totalAmount,
        		'id':id,
        		'orderItemList':orderItemList
        	}
        	return data;
        }
        editProInfo=function(){
        	$("#addProDiv").html('<a href="javascript:void(0)" class="layui-btn layui-btn-small" id="add_commodity" onclick="addCommodity()"> <i class="layui-icon"  style="vertical-align: middle">&#xe61f;</i>添加商品</a>');
        	$("#storageInItemsContent").find(".productSearchDiv").append('<input type="button" class="layui-btn layui-btn-small layui-icon change relative-search-btn" value="&#xe615;">');
			$("#storageInItemsContent").find(".deleteDiv").append('<button class=" delete"><i class="icon-delete"></i></button>');
			$("#storageInItemsContent input[type='text'][name='proskuCode']").attr("disabled",false);
			$("#storageInItemsContent input[type='num'][name='proPrice']").attr("disabled",false);
			$("#storageInItemsContent .proPrice").each(function () {
				 $(this).attr("disabled",false);
		     });
			$("#storageInItemsContent .proNum").each(function () {
				$(this).attr("disabled",false);
			});
			form.render()
        }
        var edit_commodity=true;
        $("#edit_commodity").click(function () {
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
        	}
        	if(edit_commodity){
        		edit_commodity=false;
        		$("#edit_commodity").html("完成");
        		clearProButton();
        		editProInfo();
        		forbidAllButton();
        	}else{
        		edit_commodity=true;
        		$("#edit_commodity").html("编辑");
        		/*myAjax.ajaxSend("/admin/order/updateProInfo.json",function(data){
        			if(data!=null&&data.result==true){
        				clearProButton();
        				layer.msg("修改成功");
        			}
        		},JSON.stringify(getProInfo()),'post')*/
        		var data=getProInfo();
        		if(data!=null&&data.orderItemList!=null&&data.orderItemList.length>0){
        		$.ajax({
        			url :"/admin/order/updateProInfo.json",
        			type : "post",
        			data:JSON.stringify(data),
        			traditional : true,
        			dataType : "json",
        			contentType : "application/json; charset=utf-8",
        			success : function(data) {
        				if(data.result==true){
        					layer.msg("修改成功");
        					refreshLocalHtml("proSelect");	
        				}else{
        					layer.alert(data.message,{icon: 5});
        				}
        			},
        			error:function(message){
        				layer.alert(message,{icon: 5});
        			}	
        		});
        		}else{
        			return layer.msg("商品数量不能为空");
        		}
        	}
        });
        
        $(".editInput").on("keyup change", function () {
        	var value=$(this).val();
        	if(value==""||value==null){
        		value=0;
        	}
        	$(this).parent().parent().find("span").html(value);
        	resetTotalAmountPrice();
        });
        
        $("#completeButton").click(function () {
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
        	}
        	layer.msg('订单结束之后将结束整个订单流程，<br>在此之前请确认买家是否已经收到货<br>点击确认完成', {
        		time: 0, //不自动关闭
        		shade: 0.6,//遮罩透明度
        		shadeClose:true,//点击遮罩关闭层
        		btn: ['确定', '取消'],
        		yes: function(index){
        			myAjax.ajaxSend("/admin/order/completeOrder.json",function(){
        				callParent.parentUse(msgToclose, "search");
        				refreshLocalHtml();	 
        			},{'id':id})
        		}
        	})
        });
        
        $("#checkButton").click(function () {
    	if($(this).hasClass("layui-btn-disabled")){
    		return false;
    	}
    	var status=orderDetailInfo.status;
    	if(status==2){//已支付审核
    		var warehouseId=orderDetailInfo.warehouseId;
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
       	 var logisticsList=orderDetailInfo.logisticsList;
       	 var trackingId="";
       	 if(logisticsList!=null&&logisticsList.length>0){
       		 trackingId=logisticsList[0].trackingId;
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
             $('#am-selected-supervisorList').selectMy({multiselect:false});
    		 form.render("select");
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
      	                    		 layero.addClass('layui-form');
      	                      		 layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
      	                      		 form.render();
      	                         },
      	           			  yes: function(index){
      	           				  if(checkProflag){
      	           					var consignee=$("#reciverName").val();
      	           					var phoneNo=$("#reciverPhone").val();
      	           					var areaId=getselectAreaId();
      	           					var fullAddress=$("#fullAddress").val();
      	           					var sellerMessage=$("#sellerMessage").val();
      	           					var province=""+$("#province").find("option:selected").text();
      	           					var city=""+$("#city").find("option:selected").text();
      	           					var area=""+$("#sysarea").find("option:selected").text();
										 var address="";
									var supervisorId=$("#supervisorList").val();
      	           					if($("#sysarea").val()!=""&&$("#sysarea").val()!=null){
      	           						address+=province+city+area;
      	           					}else{
      	           						address+=province+city;
      	           					}
      	           					if(consignee==null||consignee==""||phoneNo==null||phoneNo==""||areaId==null||areaId==""||fullAddress==""||fullAddress==null){
      	           						return layer.msg("收货人信息不能为空");
      	           						
      	           					}
      	           					if(($("#city").find("option").length>1&&$("#city").find("option:selected").val=="")||($("#sysarea").find("option").length>1&&$("#sysarea").find("option:selected").val()=="")){
      	           						return layer.msg("所在地区请选择完整");
      	           					}
      	           					if($("#warehoustListSelect").val()==null||$("#warehoustListSelect").val()==""||$("#warehoustListSelect").val()<0||$("#consumeListSelect").val()==""||$("#consumeListSelect").val()<0){
      	           						return layer.msg("请选择经销商,仓库");
      	           					}
      	           					var logisticsInfoList=new Array();
      	           					// if($("#expressListSelect").val()!=null&&$("#expressListSelect").val()>0){
      	           					// 	var logisticsInfo={
      	           					// 			"trackingId":$("#expressListSelect").val(),
      	           					// 			"trackingName":$("#expressListSelect").find("option:selected").attr("title"),
      	           					// 	}
      	           					// 	logisticsInfoList.push(logisticsInfo);
      	           					// }
      	           					//var supervisorId=$("#supervisorList .am-checked").val();
      	           					if(supervisorId<0){
      	           						supervisorId=null;
      	           					}
      	           				  var data={
      	           						  'id':id,
      	           						  'warehouseId': $("#warehoustListSelect").val(), 
      	           						  'logisticsList':logisticsInfoList,
      	           						  'version':orderDetailInfo.version,
      	           						  'siteId':$("#consumeListSelect").val(),
	             						  'supervisorId':supervisorId
									   }   
      	           				 $.ajax({
      	            					type: 'post',
      	            	                url: '/admin/order/verifyOrder.json',
      	            	                data: JSON.stringify(data),
      	            	                traditional : true,
      	            	                dataType: "json",
      	            	                contentType : "application/json; charset=utf-8",
      	            	                success: function (dataJson) {
											var includeTag = false;
      	            	                    if (dataJson.code == "0") {
												$.ajax({
													type: 'post',
													url: '/admin/companyOrg/listWarehouseList.json',
													traditional : true,
													dataType: "json",
													contentType : "application/json; charset=utf-8",
													async: false,
													success: function (result) {
														for(var i=0;i<result.result.length;i++){
															if(data.warehouseId == result.result[i].id){
																includeTag = true;
															}
														}
													}
												})
												if(includeTag){
      	            	                    	  //callParent.parentUse(msgToclose, "search");
												  refreshLocalHtml();	
												} else {
													callParent.openTab(msgToclose);
													callParent.closeTab('order_detail'); 
												}
      	            	                    } else {
      	            	                        layer.alert(dataJson.message);
      	            	                    }
      	            	                },
      	            	                error: function () {
      	            	                    layer.alert("系统错误请联系管理员");
      	            	                }
      	            	            }); 
      	           				  }else{
      	           					  return layer.msg("存在商品sku为空，或者没有本地商品信息，请补充完整");
      	           				  }
      	           				},
						 end:function () {
							 $('#am-selected-supervisorList').unbind();
							 $('.am-selected-btn').unbind();
                         }
      	                })
      		 });
    	}else if(status==3){//已审核取消审核
    		var bcStatus=orderDetailInfo.bcStatus;
    		var printCount=orderDetailInfo.printCount;
    		var expressCount=orderDetailInfo.expressCount;
    		if(bcStatus==true||printCount>0||expressCount>0){
    			return layer.msg("加入波次单或者打印过的订单无法取消审核");
    		}else{
    			layer.msg("是否取消审核！<br>取消审核之后的订单将会进入待审核订单里面，<br>是否继续！", {
        			time: 0, //不自动关闭
        			shade: 0.6,//遮罩透明度
        			shadeClose:true,//点击遮罩关闭层
        			btn: ['确定', '取消'],
        			yes: function(index){
    					myAjax.ajaxSend("/admin/order/cansleVerifyOrder.json?id="+orderDetailInfo.id,function(){
    						layer.close(index);
    						refreshLocalHtml();
    					})
        			}
        		})
    		}
    	}
    	
        	
        });
        $("#sendGoodsButton").click(function () {
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
        	}
        	//if(orderDetailInfo!=null&&(orderDetailInfo.storageStatus==true||orderDetailInfo.storageStatus=="true")){
				if(orderDetailInfo!=null){
        		var logistics=orderDetailInfo.logisticsList;
        		var trackingNo;
        		var trackingName;
        		if(logistics!=null&&logistics.length>0){
					var len = logistics.length;
        			trackingNo=logistics[len-1].trackingNo;
        			trackingName=logistics[len-1].trackingName;
        		}
        		if(trackingNo==null||trackingNo==""){
        			return layer.msg("没有物流信息");
        		}else{
        		myAjax.ajaxTpl("/admin/order/OrderProductInventoryInfo.json?id="+id, 'productAndInventoryListForExpress', 'tplOrderProductInventoryInfoTpl',false,function(){
        			layer.open({
        				type: 1,
        				title: '发货订单[快递公司:'+trackingName+',快递单号:'+trackingNo+"]",
        				content: $("#sendGoodsHtml"),           //弹窗内容
        				area: ["800px", "400px"],         //设置窗体高度 和宽度
        				btn: ["确定", "取消"],
        				closeBtn: 0,                      //取消右上角关闭按钮
        				btnAlign: 'r',
        				success:function (layero, index) {
        					layero.addClass('layui-form');
        					layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
        					form.render();
        				},
        				yes: function(index){
        					myAjax.ajaxSend("/admin/order/sendGoods.json?trackingNo="+trackingNo+"&orderId="+id,function(){
        						layer.msg("发货成功");
        						refreshLocalHtml();
        					})
        				}
        			})
        			
        		});
        		}
        	}else{
        		return layer.msg("库存不足！无法发货");
        	}
        });
        
        $('#printJxdButton').on('click',function (){
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
        	}
        	
        	//if(orderDetailInfo!=null&&(orderDetailInfo.storageStatus==true||orderDetailInfo.storageStatus=="true")){
			if(orderDetailInfo!=null){
				var printType=(orderDetailInfo.source==1?"A4":"A5");
			    var a4PrintHtml=printType+"打印：<input type='checkBox' class='a4print'>";
        		var warnMsg="";
        		if(orderDetailInfo.printCount==0||orderDetailInfo.printCount==null){
        			warnMsg=a4PrintHtml+"<br>您将进行第一次打印，<br>打印之后将无法合单，而且也无法再取消审核，<br>是否继续？";
        		}else{
        			warnMsg=a4PrintHtml+'<br>已打印'+orderDetailInfo.printCount+'次，是否继续？';
        		}
        		layer.msg(warnMsg, {
        			time: 0, //不自动关闭
        			shade: 0.6,//遮罩透明度
        			shadeClose:true,//点击遮罩关闭层
        			btn: ['确定', '取消'],
        			yes: function(layero,index){
        				var checkStatus=index.find(".a4print");
        				var source=orderDetailInfo.source;
        				if(source!=null&&source==1){
        					if(checkStatus.is(':checked')){
     	    				  layer.close(layero);
     	    				  myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderDetailInfo.id, 'totalOrderDetailHtml', 'taobaoA4JxdTpl',false,function(){
     	    					  var strBodyStyle = "<style>" + varTaobaoA4Css + "</style>";
     	    					  $("#totalOrderDetailHtml .a4jxd").each(function(){
  	    						var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
  	    						LODOP.ADD_PRINT_BARCODE(50, 540, 250, 47, "128A", orderDetailInfo.sn);
      					        LODOP.ADD_PRINT_BARCODE(600, 540, 250, 47, "128A", orderDetailInfo.sn);
      					        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
      					        LODOP.ADD_PRINT_HTM(5, 5, "100%", "100%", "<!DOCTYPE html>" + html);
      					        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      					        LODOP.NewPage();
  	    					})
  	    					LODOP.PREVIEW();
 	    					refreshLocalHtml();	
      	    			  	});
         	    				  
         	    			  	}else{
         	    			  	layer.close(layero);
              				myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderDetailInfo.id, 'totalOrderDetailHtml', 'taobaoJxdTpl',false,function(){
      	    			  		var strBodyStyle = "<style>" + varTaobaoCss + "</style>";
      	    					$("#totalOrderDetailHtml .jxd").each(function(){
      	    						var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
      	    				        LODOP.SET_PRINT_PAGESIZE(1, "240mm", "140mm", "");
      	    						LODOP.ADD_PRINT_HTM(5, 40, "100%", "100%", html);
      	    						LODOP.ADD_PRINT_BARCODE(50, 580, 250, 60, '128A', orderDetailInfo.sn);
      	    						LODOP.NewPage();
      	    					})
      	    					LODOP.PREVIEW();
      	    					refreshLocalHtml();	
      	    			  	});
         	    			  }
        				}else{
        					if(checkStatus.is(':checked')){
        						layer.close(layero);
        						myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderDetailInfo.id, 'totalOrderDetailHtml', 'detailA4Tpl',false,function(){
        							var strBodyStyle = "<style>" + a4Css + "</style>";
        							$("#totalOrderDetailHtml .a4jxd").each(function(){
        								var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
        								LODOP.ADD_PRINT_BARCODE(50, 540, 250, 47, "128A", orderDetailInfo.sn);
        								LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A5");
        								LODOP.ADD_PRINT_HTM(5, 5, "100%", "100%", "<!DOCTYPE html>" + html);
        								LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        								LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向时的正向显示
        								LODOP.NewPage();
        							})
        							LODOP.PREVIEW();
        							refreshLocalHtml();	
        						});
        						
        					}else{
        						layer.close(layero);
        						myAjax.ajaxTpl("/admin/order/orderJxdPrint.json?orderId="+orderDetailInfo.id, 'totalOrderDetailHtml', 'detailTpl',false,function(){
        							var strBodyStyle = "<style>" + varCss + "</style>";
        							$("#totalOrderDetailHtml .jxd").each(function(){
        								var html=strBodyStyle + "<body>" + $(this).html() + "</body>";
        								LODOP.SET_PRINT_PAGESIZE(1, "240mm", "140mm", "");
        								LODOP.ADD_PRINT_HTM(5, 40, "100%", "100%", html);
        								LODOP.ADD_PRINT_BARCODE(50, 580, 250, 60, '128A', orderDetailInfo.sn);
        								LODOP.NewPage();
        							})
        							LODOP.PREVIEW();
        							refreshLocalHtml();	
        						});
        					}
        				}
        			}
        		})
        	}else{
        		return layer.msg("库存不足！无法打印拣货单");
        	}

	    })
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
        
	   $('#printExpressButton').on('click',function (){
		   if($(this).hasClass("layui-btn-disabled")){
	    		return false;
	    	}
       	//if(orderDetailInfo!=null&&(orderDetailInfo.storageStatus==true||orderDetailInfo.storageStatus=="true")){
		   if(orderDetailInfo!=null){
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
	    			 layer.open({
	    				 type: 1,
	    				 title:'信息维护',
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
	    							 "orderId":id,
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
											layer.close(index);
											refreshLocalHtml();	
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
				 },{'warehouseId': orderDetailInfo.warehouseId,'expressId':$("#expressList").val()})
			 });
       	}else{
    		return layer.msg("库存不足！无法打印快递单发货");
       	}
	    })
        $('#payButton').on('click',function () {
        	if($(this).hasClass("layui-btn-disabled")){
        		return false;
        	}
        	var saleActiveCount=0;
        	var saleActiveList;
        	
        	$('#payOrderHtml').html($("#payOrder").html());
            layer.open({
                type: 1,
                title: '支付订单',
                content: $("#payOrderHtml"),           //弹窗内容
                area: ["800px", "400px"],         //设置窗体高度 和宽度
                btn: ["确定", "取消"],
                closeBtn: 0,                      //取消右上角关闭按钮
                btnAlign: 'r',
                success:function (layero, index) {
                	myAjax.ajaxTpl('/admin/payMethod/listOffLine.json?', 'payMethodList', 'payMethodListTpl')
        	        $('#toPayOrderSn').html($("#orderSn").html());
                	var actrualFee=parseFloat($("#actrualFee").html());
                	var promotion=parseFloat($("#promotion").html());
                	var actrualPayFee=parseFloat($("#payAmount").html());
                	myAjax.ajaxSend('/admin/order/selectSaleActivity.json?orderId='+orderDetailInfo.id+"&platformId="+orderDetailInfo.source+"&userId="+(orderDetailInfo.userId==null?"":orderDetailInfo.userId),function(dataList){
                		if(dataList!=null&&dataList.result!=null){
                			saleActiveList=dataList.result;
                			$.each(saleActiveList,function(k,p){
                				saleActiveCount=saleActiveCount+p.discountAmount;
                			})
                			var saleActiveListInfo={
                				"result":saleActiveList
                			}
                			myAjax.getTpl('saleActivityList','saleActiveTPL',saleActiveListInfo,false);
                		}
                		var waitTopay=Utils.scale(actrualFee+promotion-actrualPayFee+saleActiveCount,2);
                		$('#toPayOrderPrice').html(waitTopay<0?0:waitTopay);
                		if(saleActiveCount!=0){
                			var msg="";
                			if(promotion!=0&&-promotion!=saleActiveCount){
                				msg="(优惠变动)"
                			}
                			$("#showSaleActivityMsh").html("已优惠:"+saleActiveCount+msg)
                		}
                	});
                     layero.addClass('layui-form');
                     layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
                     form.render();
                     },
       			  yes: function(index){
       				  form.on('submit(fromContent)',function(){
       					var data=getPayOrderInfo(id,saleActiveList);
       					if($("#payMethodList").val()==null||$("#patMethod").val()==""||$("#payMethodList").val()<0){
       						return layer.msg("请选择支付方式");
       					}
       				 $.ajax({
       					type: 'post',
       	                url: '/admin/order/payLocalOrder.json',
       	                data: JSON.stringify(data),
       	                traditional : true,
       	                dataType: "json",
       	                contentType : "application/json; charset=utf-8",
       	                success: function (dataJson) {
       	                    if (dataJson.code == "0") {
       	                    	refreshLocalHtml();	
       	                    } else {
       	                        layer.alert(dataJson.message);
       	                    }
       	                },
       	                error: function () {
       	                    layer.alert("系统错误请联系管理员");
       	                }
       	            });
                     })
       			}
            })

		});
		function getSelectLiId(id){
			var idList=null;
			$("#"+id).find("li").each(function(){
				 if( $(this).hasClass("am-checked")){
					 idList=$(this).val()
				 }
			})
		   return idList;
		}		
	   resetAdjustFee=function(){
			if(orderDetailInfo!=null&&orderDetailInfo.status>1){
				return false;
			}
			var orderAmount=$("#orderAmount").html();
			var adjustFee=$("#adjustFee").html();
			var postFee=$("#postFee").html();
			var promotion=$("#promotion").html();
			var coupon=$("#coupon").html();
			var count=parseFloat(orderAmount)+parseFloat(postFee)+parseFloat(adjustFee)+parseFloat(promotion)+parseFloat(coupon);
			$("#actrualFee").html(Utils.scale(count,2));
		}
		resetTotalAmountPrice=function(){
			if(orderDetailInfo!=null&&orderDetailInfo.status>1){
				return false;
			}
			var count=0;
			 $("#storageInItemsContent .proPrice").each(function () {
				 var single=$(this).parent().parent().find(".proNum").val();
				 var trPrice=$(this).val()*(single==null?0:single);
				 count = trPrice - 0 + count;
				 $(this).parent().parent().find(".priceAmount").html(trPrice.toFixed(2));
			 });
			$("#orderAmount").text(count.toFixed(2));
			var promotion=$("#promotion").html();
			var coupon=$("#coupon").html();
			var adjustFee=$("#adjustFee").html();
			var postFee=$("#postFee").html();
			$("#actrualFee").html(Utils.scale(count-(promotion==null?0:promotion)-(coupon==null?0:coupon)+(adjustFee==null?0:parseFloat(adjustFee))+parseFloat(postFee),2));
		}
		resetTotalAmountNum=function(){
			if(orderDetailInfo!=null&&orderDetailInfo.status>1){
				return false;
			}
			var count=0;
			 $("#storageInItemsContent .proNum").each(function () {
				 var single=$(this).parent().parent().find(".proPrice").val();
				 var trPrice=$(this).val()*(single==null?0:single);
				 count = $(this).val() - 0 + count;
				 $(this).parent().parent().find(".priceAmount").html(trPrice.toFixed(2));
		    });
			resetTotalAmountPrice();
			$("#proNum").text(count);
		}
		getPayOrderInfo=function(id,saleActiveList){
			var payAmount=$("#toPayOrderPrice").html();
			var payName=$("#payUserName").val();
			var bank=$("#reciverBank").val();
			var remark=$("#payRemark").val();
			var payMethod=$("#payMethodList").val();
			var payMethodDesc=$("#payMethodList").find("option:selected").text();
			var data={
				'relationId':id,
				'payName':payName,
				'amount':payAmount,
				'reciverAccount':$("#reciverAccount").val(),
				'payMethodId':payMethod,
				'payMethodDesc':payMethodDesc,
				'bank':bank,
				'remark':remark,
				'saleActiveBaseInfoList':saleActiveList,
			}
			return data;
		}
		changePayStatus=function(value){
			switch (value) {
			case 0:
				return "线下支付";
				break;
			case 1:
				return "在线支付";
				break;
			case 2:
				return "预存款支付";
				break;

			default:
				return "";
				break;
			}
		}
		clearNoNum=function(obj){ 
    	    obj.value = obj.value.replace(/[^-\d.]/g,"");  //清除“数字”和“.”以外的字符  
    	    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
    	    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    	    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
    	    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
    	        //obj.value= parseFloat(obj.value); 
    	    } 
    	}
	});
  });

