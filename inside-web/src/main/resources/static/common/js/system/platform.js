$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		var orderObj = new Order(function (obj) {
			myAjax.ajaxPage('/admin/platform/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		},"create_time");
		 myAjax.ajaxPage('/admin/platform/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		 form.on('checkbox(selectAllCheckBox)', function(data){
			 var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
		form.verify({
				platformCode: [
				    /^[a-zA-Z0-9_]{2,20}$/,
				    '编号格式不正确，为2到20位数字字母下划线'
				  ],
				  platformName: [
					/^[\u4e00-\u9fa5]{2,9}$/,
					'平台名称格式不正确，只能为2到9位中文'		    
					] 
				});  
		callParent.isLoadEnd("platform_page");
	    callParent.register(function () {
	    	 window.location.reload();
	        }, "search");
	});
   });

$(function () {
	$("#add").click(function () {
		$('#platForm')[0].reset();
		layer.open({
			  type: 1,
			  title: "添加平台",
			  btn: ['确定', '取消'],
			  closeBtn: 0,
			  btnAlign: 'r',
			  area: '600px',
			  shadeClose: true,
			  content: $('#platForm'),
			  success:function (layero, index) {
                  layero.addClass('layui-form');
                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
                  form.render();
              },
			  yes: function(index){
				  form.on('submit(fromContent)',function(){
					  savePlatfrom()
                  })
				  }
			});
    });
    
	getHtmlPlatform=function(id){
		var code = $('#platformCode').val();
		var name = $('#platformName').val();		
		var platformDesc = $('#platformDesc').val();	
		var type=$("input[name='platformType']:checked").val();
		var effective;
		if ($("input[name='effective']").is(':checked')) {
			effective = true;
		} else {
			effective = false;
		}
		var data={
				"id":id,
				"code" : code,
				"name" : name,
				"type":type,
				"platformDesc" : platformDesc,
				"effective" : effective
				};
		return data;
	}
	
	savePlatfrom=function(){
		var url = "/admin/platform/save.json";
		var data=getHtmlPlatform();
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
	  
    $("#batchForbid").click(function () {
    	var url = "/admin/platform/batchForbid.json";
    	var ids=new Array();
    	$("#page_tbody input[name='platformCheckbox']:checked").each(function(){
    		ids.push($(this).attr('value')==null?null:parseInt($(this).attr('value')));
    	  });
    	if(ids.length<1){
    		return layer.alert("请选中禁用");
    	}
    	layer.confirm("选中平台将会被全部禁用，确定继续吗？平台可能关联其他信息，请慎重操作!", {
  		 /* time: 0, //不自动关闭
  		  btn: ['确定', '取消'],
  		  shade: 0.6,//遮罩透明度
  		  shadeClose:true,//点击遮罩关闭层*/
            icon: 3, title: '提示','closeBtn':0,area: ['430px', '240px'],
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
    	var url = "/admin/platform/batchUse.json";
    	var ids=new Array();
    	$("#page_tbody input[name='platformCheckbox']:checked").each(function(){
    		ids.push($(this).attr('value'));
    	  });
    	if(ids.length<1){
    		return layer.alert("请选中启用");
    	}
    	layer.confirm("选中平台将会被全部启用，确定继续吗？", {
    		  /*time: 0, //不自动关闭
    		  shade: 0.6,//遮罩透明度
      		  shadeClose:true,//点击遮罩关闭层
      		  btn: ['确定', '取消'],*/
            icon: 3, title: '提示','closeBtn':0,area: ['430px', '240px'],
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
    
    forbidById= function(id,effective){
    	var url;
    	var msg;
    	if(effective==true){
    		url="/admin/platform/batchForbid.json";
    		msg='确定要禁用该平台吗？该平台可能关联其他信息，请慎重操作!';
    	}else{
    		url="/admin/platform/batchUse.json";
    		msg='确定要启用该平台吗？';
    	}
    	layer.confirm(msg, {
    		 /* time: 0, //不自动关闭
    		  shade: 0.6,//遮罩透明度
      		  shadeClose:true,//点击遮罩关闭层
      		  btn: ['确定', '取消'],*/
            icon: 3, title: '提示','closeBtn':0,area: ['430px', '240px'],
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
    
    updateInfo=function(id){
    	//先清空
		$('#platForm')[0].reset();
    	var url = "/admin/platform/info.json";
    	$.ajax({
			url : url,
			type : "post",
			data:{
				"id":id
			},
			traditional : true,
			dataType : "json",
			success : function(data) {
				var platForm=data.result;
				$("#platformCode").val(platForm.code);
				$("#platformName").val(platForm.name);
				$("input[type='radio'][name='platformType'][value='" + platForm.type + "']").prop("checked", true);
				$("#platformDesc").val(platForm.platformDesc);
				if(platForm.effective==true){
					$("input[type='checkbox'][name='effective']").prop('checked',true);
				}else{
					$("input[type='checkbox'][name='effective']").prop('checked',false);
				}
				var id=platForm.id;
				layer.open({
					  type: 1,
					  title: "修改平台",
					  btn: ['确定', '取消'],
					  closeBtn: 0,
					  btnAlign: 'r',
					  area: '600px',
					  shadeClose: true,
					  content: $('#platForm'),
					  success:function (layero, index) {
		                  layero.addClass('layui-form');
		                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
		                  form.render();
		              },
					  yes: function(index){
						  form.on('submit(fromContent)',function(){
							  var data=getHtmlPlatform(id);
							  updatePlatfrom(data)
		                  })
						}
					})
    }
})
};
   updatePlatfrom=function(data){
	   var url = "/admin/platform/update.json";
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
    