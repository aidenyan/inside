var form,element,layer,laytpl,myAjax,laydate;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		var orderObj = new Order(function (obj) {
			myAjax.ajaxPage('/admin/payMethod/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		},"create_time");
		 myAjax.ajaxPage('/admin/payMethod/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		 form.on('checkbox(selectAllCheckBox)', function(data){
			 var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		form.verify({
			payMethodCode: [
			    /^[a-zA-Z]{2,20}$/,
			    '支付方式编号格式不正确，为2到20位字母'
			  ],
			  payMethodName: [
				/^[\u4e00-\u9fa5]{2,9}$/,
				'支付方式名称不正确，只能为2到9位中文'		    
				] 
			});
		callParent.isLoadEnd("payMethod_page");
	    callParent.register(function () {
	    	 window.location.reload();
	        }, "search");
	});
   });

$(function () {
    $("#add").click(function () {
    	$('#payMethodForm')[0].reset();
		layer.open({
			  type: 1,
			  title: "添加支付方式",
			  btn: ['确定', '取消'],
			  closeBtn: 0,
			  btnAlign: 'r',
			  area: '600px',
			  shadeClose: true,
			  content: $('#payMethodForm'),
			  success:function (layero, index) {
                  layero.addClass('layui-form');
                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
                  form.render();
              },
			  yes: function(index){
				  form.on('submit(fromContent)',function(){
					  savePayMethod()
                  })
				  }
			});
    });
   
    getHtmlPayMethodInfo=function(id){
		var payMethodCode = $('#payMethodCode').val();
		var payType = $('#payType').val();		
		var payMethodName = $('#payMethodName').val();	
		var remark = $('#remark').val();	
		var effective;
		if ($("input[name='effective']").is(':checked')) {
			effective = true;
		} else {
			effective = false;
		}
		var data={
			"id" : id,
			"code" : payMethodCode,
			"name" : payMethodName,
			"type":payType,
			"desciption" : remark,
			"effective" : effective
			};
		return data;
    }
    savePayMethod=function(){
    	var data=getHtmlPayMethodInfo();
    	var url = "/admin/payMethod/save.json";
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
    
    updateInfo=function(id){
    	$('#payMethodForm')[0].reset();
    	var url = "/admin/payMethod/info.json";
    	$.ajax({
			url : url,
			type : "post",
			data:{
				"id":id
			},
			traditional : true,
			dataType : "json",
			success : function(data) {
				var model=data.result;
				$("#payMethodCode").val(model.code);
				$("#payType").val(model.type);
				$("#payMethodName").val(model.name);
				$("#remark").val(model.desciption);
				if(model.effective==true){
					$("input[type='checkbox'][name='effective']").prop('checked',true);
				}else{
					$("input[type='checkbox'][name='effective']").prop('checked',false);
				}
				var id=model.id;
				layer.open({
					  type: 1,
					  title: "修改支付方式",
					  btn: ['确定', '取消'],
					  closeBtn: 0,
					  btnAlign: 'r',
					  area: '600px',
					  shadeClose: true,
					  content: $('#payMethodForm'),
					  success:function (layero, index) {
		                  layero.addClass('layui-form');
		                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
		                  form.render();
		              },
					  yes: function(index){
						  form.on('submit(fromContent)',function(){
							  var data=getHtmlPayMethodInfo(id);
							  updatePayMethod(data)
		                  })
						  }
					});
			},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
			});
    	
    }
    $("#batchForbid").click(function () {
    	var url = "/admin/payMethod/batchForbid.json";
    	var ids=new Array();
    	$("#page_tbody input[name='payMethodCheckbox']:checked").each(function(){
    		ids.push($(this).attr('value')==null?null:parseInt($(this).attr('value')));
    	  });
    	if(ids.length<1){
    		return layer.alert("请选中禁用");
    	}
    	layer.confirm("选中支付方式将会被全部禁用，确定继续吗？请慎重操作!", {
  		  /*time: 0, //不自动关闭
  		  btn: ['确定', '取消'],
  		  shade: 0.6,//遮罩透明度
  		  shadeClose:true,//点击遮罩关闭层*/
            icon: 3, title: '提示','closeBtn':0,area: ['480px', '240px'],
  		  yes: function(index){
    	$.ajax({
			url : url,
			type : "post",
			data:JSON.stringify(ids),
			traditional : true,
			dataType : "json",
			contentType : "application/json; charset=utf-8",
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
    });
    
    $("#batchUse").click(function () {
    	var url = "/admin/payMethod/batchUse.json";
    	var ids=new Array();
    	$("#page_tbody input[name='payMethodCheckbox']:checked").each(function(){
    		ids.push($(this).attr('value'));
    	  });
    	if(ids.length<1){
    		return layer.alert("请选中启用");
    	}
    	layer.confirm("选中支付方式将会被全部启用，确定继续吗？", {
    		 /* time: 0, //不自动关闭
    		  shade: 0.6,//遮罩透明度
      		  shadeClose:true,//点击遮罩关闭层
      		  btn: ['确定', '取消'],*/
            icon: 3, title: '提示','closeBtn':0,area: ['480px', '240px'],
    		  yes: function(index){
    	$.ajax({
			url : url,
			type : "post",
			data:JSON.stringify(ids),
			traditional : true,
			dataType : "json",
			contentType : "application/json; charset=utf-8",
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
    });
    
    forbidOrUseById= function(id,effective){
    	var url;
    	var msg;
    	if(effective==true){
    		url="/admin/payMethod/batchForbid.json";
    		msg='确定要禁用该支付方式吗？请慎重操作!';
    	}else{
    		url="/admin/payMethod/batchUse.json";
    		msg='确定要启用该支付方式吗？';
    	}
    	layer.confirm(msg, {
    		  /*time: 0, //不自动关闭
    		  shade: 0.6,//遮罩透明度
      		  shadeClose:true,//点击遮罩关闭层
      		  btn: ['确定', '取消'],*/
            icon: 3, title: '提示','closeBtn':0,area: ['480px', '240px'],
    		  yes: function(index){
    			  var ids=new Array();
    			  ids.push(id);
    			  $.ajax({
					url : url,
					type : "post",
					data:JSON.stringify(ids),
					traditional : true,
					dataType : "json",
					contentType : "application/json; charset=utf-8",
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
    };
    updatePayMethod=function(data){
    	var url = "/admin/payMethod/update.json";
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