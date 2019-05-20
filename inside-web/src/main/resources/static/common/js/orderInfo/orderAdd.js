var form,layer,myAjax,laydate,laypage,laytpl;
var invoiceId = null;
$(function () {
layui.use(['form', 'layer', 'laytpl','laypage', 'myAjax'], function () {
		form = layui.form();layer = layui.layer ;laypage=layui.laypage;$ = layui.jquery;laytpl = layui.laytpl;myAjax = layui.myAjax;
		myAjax.ajaxTpl("/admin/platform/listInnerPaltform.json", 'platformShow', 'platformTpl');
		getProvinceList();
		form.on('radio(platformFilter)', function(data){
		var platformid=data.value;
       	 if(platformid==null){
       		 $("#accountId").val('');
       	 }else{
       		 //checkMemberAccount($("#accountNo"),platformid);
       	 }
		}); 
		form.on('select(provinceFilter)', function(data){
			changeProvince(data.value);
		}); 
		form.on('select(cityFilter)', function(data){
			changeCity(data.value);
		}); 
		form.on('submit(saveOrderInfo)',function(data){
			saveOrderInfo(null);
			return false;
		}); 
		form.on('submit(saveOrderInfoContinue)',function(data){
			saveOrderInfo(1);
			return false;
		}); 
		form.verify({
			platformShow: function(data){
				 if($("#platformShow input[type='radio']:checked").length<1){
					 return "请选择平台";
				 }
			},
			accountNo: function(data){
				 if(data==null||data==""){
					 return "请输入会员号";
				 }else{
					 var platformid;
		        	 $("#platformShow input[type='radio']:checked").each(function(){
		        			platformid=$(this).val();
		        		}) 
					 //checkMemberAccount($("#accountNo"),platformid);
				 }
			},
			reciver: function(data){
				if(data==null||data==""){
					return "请输入收货人";
				}
			},
			fullAddress: function(data){
				if(data==null||data==""){
					return "请输入详细地址";
				}
			},
			sysareaVerify: function(){
				if($("#city").val()==""||isNaN($("#province").val())){
					return '请选择所在收货地址';
				}else{
					if($("#sysarea option").length>0&&isNaN($("#sysarea").val())){
						return '请选择所在收货地址';
					}
				}
			},
			productInfolistVerify: function(){
				var count=0;
				$("#storageInItemsContent input[type='text'][name='proskuCode']").each(function(){
					var skuCode=$(this).parent().find(".proSku").val();
					if(skuCode!=null&&skuCode!=""&&skuCode!="null"){
						count++;
					}
				}) 
				if(count==0){
					return '请选择商品';
				}
				},
			});      
		 $("#add_commodity").click(function () {
	            myAjax.getTpl('storageInItemsContent', 'tplAddItems', {"result": []}, true);
	        });
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
	                        myAjax.ajaxTpl("/admin/common/category/list.json", 'slcProductType', 'tplOption', false);
	                        //获取品牌
	                        myAjax.ajaxTpl("/admin/common/brand/list.json", 'slcBrand', 'tplOption', false);

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
	                    			resetTotalAmountNum();
	                    			layer.close(index);
	                    			varTr.remove();
	                    		}, {"skuCodes":skuCodes},'post');
	                    		$("#storageInItemsContent").find('input[type="text"][name=""]').parent().parent().parent().remove();
	                    	}
	                    }
	                });
	            return false;
	        });
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
	        $("#storageInItemsContent").on("keyup change", ".proPrice", function () {
	        	resetTotalAmountPrice();
	        });
	        $("#storageInItemsContent").on("keyup change", ".proNum", function () {
	        	resetTotalAmountNum();
	        });
	        $("#storageInItemsContent").on('click', '.delete', function () {
	            $(this).closest('tr').remove();
	            resetTotalAmountNum();
			});
			/*
	        $("#accountNo").on('change',function(){
	        	 var varThis = $(this);
	        	 //changeAccountNo(varThis);
	        	 var platformid;
	        	 $("#platformShow input[type='radio']:checked").each(function(){
	        			platformid=$(this).val();
	        		}) 
	        	 if(platformid==null){
	        		 $("#accountId").val('');
	        		 return layer.msg("请先选择平台");
	        	 }else{
	        		 checkMemberAccount(varThis,platformid);
	        	 }
		       
			})
			*/
	      /*$("#accountNo").on('focus',function(){
	    	   var varThis = $(this);
	        	 changeAccountNo(varThis);
	        })*/
	        function checkMemberAccount(varThis,platformid){
	        	if(varThis.val()==""){
	        		return;
	        	}else{
	        		myAjax.ajaxSend('/admin/member/checkMemberInfo.json', function (dataJson) {
	        			var result=dataJson.result;
	        				if(result!=null){
	        					$("#accountId").val(result.id);
	        				}else{
	        					$("#accountId").val('');
	        					return layer.msg("查无此会员账号,请重新输入");
	        				}
	        		},{"name": varThis.val(),"platformId":platformid})
	        	}
	        }
	        function changeAccountNo(varThis){
	        	  if(varThis.val()==""||varThis.val()==null){
		            	$(".proSearchDiv").remove();
		            	 return false;
		           }
		         myAjax.ajaxSend('/admin/member/getMemberAddressInfo.json', function (dataJson) {
	                    var getTpl = $("#tplMemberLi").html();
	                    if(dataJson==null||dataJson.result==null){
	                    	return false;
	                    }
	                    laytpl(getTpl).render(dataJson.result.memberAddressList, function (html) {
	                        varThis.parent().children('.memberSearchDiv').each(function () {
	                            $(this).remove();
	                        });
	                        var varDivPL = '<div class="memberSearchDiv" style="position:absolute; max-height:150px; overflow:auto">' + html + '</div>';
	                        if (dataJson.result != null && dataJson.result != '') {
	                            varThis.closest('input').after(varDivPL);
	                            $(".memberSearchDiv").find('li').click(function () {
	                                var areaId = $(this).attr('areaId');
	                                var reciverName = $(this).attr('reciverName');
	                                var reciverPhone = $(this).attr('reciverPhone');
	                                var address = $(this).attr('address');
	                                $("#accountId").val(dataJson.result.id);
	                                $("#accountName").val(dataJson.result.username);
	                                if(reciverName==null||reciverName=="null"||reciverName==""){
	                                	$("#reciver").val(dataJson.result.username);
	                                }else{
	                                	$("#reciver").val(reciverName);
	                                }
	                                if(reciverPhone==null||reciverPhone=="null"||reciverPhone==""){
	                                	$("#phone").val(dataJson.phone);
	                                }else{
	                                	$("#phone").val(reciverPhone);
	                                }
	                                if(address!=null&&address!="null"&&address!=""){
	                                	$("#fullAddress").val(address);
	                                }
	                                getAreaSelect(areaId);
	                                $(".memberSearchDiv").remove();
	                            });
	                        }
	                    });
	                }, {"name": varThis.val()});
	        }
	        $("#storageInItemsContent").on('keyup', '.productSearch', function () {
	            var varThis = $(this);
	            if(varThis.val()==""||varThis.val()==null){
	            	$(".proSearchDiv").remove();
	            	 return false;
	            }
	            varThis.prev().val('');
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
	                                skuCodes.push(vSkuCode);
	                                myAjax.ajaxTpl('/admin/order/getProductInfo.json', 'storageInItemsContent', 'tplStorageInItems', true, function () {
	 	                    		   resetTotalAmountNum();
	                                    varTr.remove();
	                                },{"skuCodes":skuCodes},'post');
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
	                }, {"inputStr": varThis.val(), "notInSku": varSku},'post');
	        });
			
			//检查对应的会员是否有开票资料
			form.on('checkbox(invoice)', function(data){
				var accountNo = $("#accountNo").val();
				var platformId = null;
				var checkBoxState = $("#invoice").prop("checked")
				$("#platformShow input[type='radio']:checked").each(function(){
					platformId=$(this).val();
				}) 
				if(checkBoxState&&accountNo!=null&&accountNo!=""&&platformId!=null){
					var url = "/admin/invoice/getInvoiceInfo.json";
					var data={
							"userName":accountNo,
							"platformId":platformId
					}
					$.ajax({
						url : url,
						type : "get",
						data:{"userName":accountNo,"platformId":platformId},
						traditional : true,
						dataType : "json",
						contentType : "application/json; charset=utf-8",
						success : function(data) {
							if(data.result!=null){
								data = data.result;
								if(data.id==null){
									$("#invoice").prop("checked", false);
									form.render()
									layer.alert("该会员还未绑定开票资料，请先绑定再开票");
								}else{
									invoiceId = data.id;
								}
							}else{
								$("#invoice").prop("checked", false);
								form.render()
								layer.alert("该会员还未绑定开票资料，请先绑定再开票");
							}
						},
						error:function(message){
							layer.alert(message,{icon: 5});
						}	
					});
				}
			})

	        $("#storageInItemsContent").on('blur', '.productSearch', function () {
	            var varThis = $(this);
	            var hideSku = varThis.prev().val();
	            if (hideSku == '') {
	                varThis.val('');
	                varThis.closest("tr").find(".clearTd").html("");
	            }
	            resetTotalAmountNum();
	        });
	        $("#cancel").click(function () {
				 callParent.parentUse("order_list", "search");
                 callParent.openTab("order_list");
                 callParent.closeTab('order_add');
	        });
	});
})
updateInfo=function(id){
	var url = "/admin/order/info.json";
	var data={
			'id':id
	}
	var data=getOrderInfo();
		$.ajax({
			url : url,
			type : "post",
			data:data,
			traditional : true,
			dataType : "json",
			success : function(data) {
				var order=data.result;
				myAjax.ajaxTpl("/admin/platform/listInnerPaltform.json", 'platformShow', 'platformTpl');
				if(order.platformId!=null){
					$("#platformShow input[type='radio'][value='"+order.platformId+"']").prop("checked",true);
				}
				$("#accountNo").val(order.userNo);
				$("#reciver").val(order.consignee);
				$("#phone").val(order.phoneNo);
				if(order.areaId!=null){
					getAreaSelect(order.areaId)
				}
				$("#salesman").val(order.salesman);
				$("#fullAddress").val(order.fullAddress);
				$("#remark").val(order.buyerMessage);
				$.each(order.orderItemList,function(k,v){
					myAjax.getTpl('storageInItemsContent', 'tplAddItems', {"result": []}, true);
					
				})
			},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
		});
	
}

saveOrderInfo=function(flag){
	var url = "/admin/order/save.json";
	var data=getOrderInfo();
	// if(data!=null&&(data.userId==null||data.userId=="")){
	// 	return layer.msg("会员账号错误");
	// }else{
		$.ajax({
			url : url,
			type : "post",
			data:JSON.stringify(data),
			traditional : true,
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				if(data.result==true){
					if(flag!=null){
						layer.msg("保存成功，请继续");
						callParent.parentUse("order_list", "search");		
						parent.$("#order_add").attr('src', 'admin/order/order_add.html');
					}else{
						callParent.parentUse("order_list", "search");		
						callParent.openTab("order_list");
						callParent.closeTab('order_add');
						layer.msg("保存成功");
					}
				}else{
					layer.alert(data.message,{icon: 5});
				}
			},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
		});
	//}
}

getOrderInfo=function(id){
	var platformid=null;
	$("#platformShow input[type='radio']:checked").each(function(){
		platformid=$(this).val();
	}) 
	var accountId=$("#accountId").val();
	var accountName=$("#accountName").val();
	var accountNo=$("#accountNo").val();
	var reciver=$("#reciver").val();
	var phone=$("#phone").val();
	var areaId=getselectAreaId();
	var province=""+$("#province").find("option:selected").text();
	var city=""+$("#city").find("option:selected").text();
	var area=""+$("#sysarea").find("option:selected").text();
	var address="";
	if($("#sysarea").val()!=""&&$("#sysarea").val()!=null){
		address+=province+city+area;
	}else{
		address+=province+city;
	}
	var fullAddress=$("#fullAddress").val();
	var salesman=$("#salesman").html();
	var remark=$("#remark").val();
	var orderItemList=new Array();
	var totalPriceAmount=0;
	$("#storageInItemsContent input[type='text'][name='proskuCode']").each(function(){
		var skuCode=$(this).parent().find(".proSku").val();
		if(skuCode!=""&&skuCode!=null){
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
			totalPriceAmount+=trPrice;
			orderItemList.push(productInfo);
		}
	}) 
	var data={
		'userId':accountId,
		'userName':accountNo,
		'areaId':areaId,
		'source':platformid,
		'totalAmount':totalPriceAmount,
		'payAmount':0,
		'province':province,
		'city':city,
		'distrinct':area,
		'consignee':reciver,
		'address':fullAddress,
		'fullAddress':address+fullAddress,
		'phoneNo':phone,
		'consignee':reciver,
		'sellerMessage':remark,
		'orderItemList':orderItemList,
		'invoiceId':invoiceId
	}
	return data;
}

resetTotalAmountPrice=function(){
	var count=0;
	 $("#storageInItemsContent .proPrice").each(function () {
		 var single=$(this).parent().parent().find(".proNum").val();
		 var trPrice=$(this).val()*(single==null?0:single);
		 trPrice = trPrice.toFixed(2)
		 count = trPrice - 0 + count;
		 $(this).parent().parent().find(".priceAmount").html(trPrice);
     });
	$("#tdTotalPrice").text(count);
}
resetTotalAmountNum=function(){
	var count=0;
	 $("#storageInItemsContent .proNum").each(function () {
		 var single=$(this).parent().parent().find(".proPrice").val();
		 var trPrice=$(this).val()*(single==null?0:single);
		 count = $(this).val() - 0 + count;
		 $(this).parent().parent().find(".priceAmount").html(trPrice);
    });
	$("#tdTotalNum").text(count);
	resetTotalAmountPrice();
}
