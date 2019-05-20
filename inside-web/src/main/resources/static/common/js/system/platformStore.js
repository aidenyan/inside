var form,element,layer,laytpl,myAjax,laydate;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		var orderObj = new Order(function (obj) {
			myAjax.ajaxPage('/admin/platformStore/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		},"s.create_time");
		 myAjax.ajaxPage('/admin/platformStore/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		 form.on('checkbox(selectAllCheckBox)', function(data){
			 var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		form.verify({
			platfromList: function(data,item){
				 if($("#platfromList input[type='radio']:checked").length<1){
					 return "请选择平台";
				 }
			},
			storeName: function(data,item){
				if(data==""||data==null){
					return "请输入店铺名称";
				}
			}
				});  
		callParent.isLoadEnd("platform_store_list");
	    callParent.register(function () {
	    	 window.location.reload();
	        }, "search");
	});
   });

$(function () {
	$("#add").click(function () {
		$('#platformStore')[0].reset();
		layer.open({
			  type: 1,
			  title: "添加店铺",
			  btn: ['确定', '取消'],
			  closeBtn: 0,
			  btnAlign: 'r',
			  area: '600px',
			  shadeClose: true,
			  content: $('#platformStore'),
			  success:function (layero, index) {
				  myAjax.ajaxTpl("/admin/platform/listOuterPaltform.json", 'platfromList', 'platformTpl');
                  layero.addClass('layui-form');
                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
                  form.render();
              },
			  yes: function(index){
				  form.on('submit(fromContent)',function(data){
					  savePlatfromStore()
                  })
				  }
			});
    });
    
	getHtmlPlatformStore=function(id){
		var platformId=null;
		$("#platfromList input[type='radio']:checked").each(function(){
			platformId=$(this).val();
		})
		var storeName = $('#storeName').val();
		var website = $('#website').val();		
		var storeCode = $('#storeCode').val();		
		var remark = $('#remark').val();	
		var data={
				"id":id,
				"code" : storeCode,
				"name" : storeName,
				"webSite":website,
				"remark" : remark,
				"platformId" : platformId
				};
		return data;
	}
	getHtmlPlatformStoreSecret=function(id,platformStoreId){
		var url=$("#applicationUrl").val();
		var appkey=$("#appkey").val();
		var secret=$("#secret").val();
		var sessionKey=$("#sessionKey").val();
		var refreshToken=$("#refreshToken").val();
		var effective="";
		if ($("input[name='effective']").is(':checked')) {
			effective = true;
		} else {
			effective = false;
		}
		var data={
				"id":id,
				"platformStoreId":platformStoreId,
				"url" : url,
				"appkey" : appkey,
				"sessionKey":sessionKey,
				"refreshToken" : refreshToken,
				"secret" : secret,
				"enabled" : effective
		};
		return data;
	}
	
	savePlatfromStore=function(){
		var url = "/admin/platformStore/save.json";
		var data=getHtmlPlatformStore();
		$.ajax({
				url : url,
				type : "post",
				data:data,
				traditional : true,
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					if(data.result==true){
						window.location.reload();
					}else{
						layer.alert(data.message,{icon: 5});
					}
					},
				error:function(message){
					layer.alert(message,{icon: 5});
				}	
				});
	}
	secretEdit=function(storeId){
		//先清空
		$('#platformStoreSecret')[0].reset();
    	var url = "/admin/platformStore/secretInfo.json";
    	$.ajax({
			url : url,
			type : "post",
			data:{
				"id":storeId
			},
			traditional : true,
			dataType : "json",
			success : function(data) {
				var platFormStoreSecret=data.result;
				var platformStoreSecretId="";
				if(platFormStoreSecret!=null){
					$("#storeShowName").val(platFormStoreSecret.name);
					$("#applicationUrl").val(platFormStoreSecret.secretUrl);
					$("#appkey").val(platFormStoreSecret.appkey);
					$("#secret").val(platFormStoreSecret.secret);
					$("#sessionKey").val(platFormStoreSecret.sessionKey);
					$("#refreshToken").val(platFormStoreSecret.refresh_token);
					if(platFormStoreSecret.secretEnabled==true){
						$("#effective").prop("checked",true)
					}
					platformStoreSecretId=platFormStoreSecret.platformStoreSecretId;
				}
				layer.open({
					  type: 1,
					  title: "秘钥信息",
					  btn: ['确定', '取消'],
					  closeBtn: 0,
					  btnAlign: 'r',
					  area: '600px',
					  shadeClose: true,
					  content: $('#platformStoreSecret'),
					  success:function (layero, index) {
		                  layero.addClass('layui-form');
		                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
		                  form.render();
		              },
					  yes: function(index){
						  form.on('submit(fromContent)',function(){
							  var data=getHtmlPlatformStoreSecret(platformStoreSecretId,storeId);
							  updatePlatfromStoreSecret(data)
		                  })
						}
					})
    }
})
	}
	
	updatePlatfromStoreSecret=function(data){
		   var url = "/admin/platformStore/secretUpdate.json";
		   $.ajax({
				url : url,
				type : "post",
				data:data,
				traditional : true,
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					if(data.result==true){
						window.location.reload();
					}else{
						layer.alert(data.message,{icon: 5});
					}
					},
				error:function(message){
					layer.alert(message,{icon: 5});
				}	
				});
	   }
	authorize=function(id){
		//先清空
		$('#platformStoreSecret')[0].reset();
    	var url = "/admin/platformStore/secretInfo.json";
    	$.ajax({
			url : url,
			type : "post",
			data:{
				"id":id
			},
			traditional : true,
			dataType : "json",
			success : function(data) {
				var platFormStoreSecret=data.result;
				var platformStoreSecretId="";
				if(platFormStoreSecret!=null&&platFormStoreSecret.appkey!=null&&platFormStoreSecret.appkey!=""){
					if(platFormStoreSecret.platformId == 1){
						window.location.href="https://oauth.taobao.com/authorize?response_type=token&client_id="+platFormStoreSecret.appkey+"&state=1212&view=web";
					}
					if(platFormStoreSecret.platformId == 2){
						window.location.href="https://oauth.jd.com/oauth/authorize?response_type=code&client_id="+platFormStoreSecret.appkey+"&redirect_uri=urn:ietf:wg:oauth:2.0:oob&state=1212";
					}
				}else{
					return layer.msg("请先填写秘钥信息appkey");
				}
    }
})
	}
    updateInfo=function(id){
    	//先清空
		$('#platformStore')[0].reset();
		myAjax.ajaxTpl("/admin/platform/listOuterPaltform.json", 'platfromList', 'platformTpl');
    	var url = "/admin/platformStore/info.json";
    	$.ajax({
			url : url,
			type : "post",
			data:{
				"id":id
			},
			traditional : true,
			dataType : "json",
			success : function(data) {
				var platFormStore=data.result;
				$("#platfromList input[type='radio'][value='" + platFormStore.platformId + "']").prop("checked", true);
				$("#storeName").val(platFormStore.name);
				$("#storeCode").val(platFormStore.code);
				$("#website").val(platFormStore.webSite);
				$("#remark").val(platFormStore.remark);
				var id=platFormStore.id;
				layer.open({
					  type: 1,
					  title: "修改店铺",
					  btn: ['确定', '取消'],
					  closeBtn: 0,
					  btnAlign: 'r',
					  area: '600px',
					  shadeClose: true,
					  content: $('#platformStore'),
					  success:function (layero, index) {
		                  layero.addClass('layui-form');
		                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
		                  form.render();
		              },
					  yes: function(index){
						  form.on('submit(fromContent)',function(){
							  var data=getHtmlPlatformStore(id);
							  updatePlatfromStore(data)
		                  })
						}
					})
    }
})
};
updatePlatfromStore=function(data){
	   var url = "/admin/platformStore/update.json";
	   $.ajax({
			url : url,
			type : "post",
			data:data,
			traditional : true,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				if(data.result==true){
					window.location.reload();
				}else{
					layer.alert(data.message,{icon: 5});
				}
				},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
			});
   }
})
    