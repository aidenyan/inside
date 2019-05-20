var form,element,layer,laytpl,myAjax,laydate;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		var orderObj = new Order(function (obj) {
			myAjax.ajaxPage('/admin/model/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		},"create_time");
		 myAjax.ajaxPage('/admin/model/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption());
		 form.on('checkbox(selectAllCheckBox)', function(data){
			 var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
	            child.each(function (index, item) {
	                item.checked = data.elem.checked;
	            });
	            form.render('checkbox');
		});
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
		callParent.isLoadEnd("model_page");
	    callParent.register(function () {
	    	 window.location.reload();
	        }, "search");
	});
   });

$(function () {
    $("#add").click(function () {
    	$('#modelForm')[0].reset();
		layer.open({
			  type: 1,
			  title: "添加模板",
			  btn: ['确定', '取消'],
			  closeBtn: 0,
			  btnAlign: 'r',
			  area: '600px',
			  shadeClose: true,
			  content: $('#modelForm'),
			  success:function (layero, index) {
                  layero.addClass('layui-form');
                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
                  form.render();
              },
			  yes: function(index){
				  form.on('submit(fromContent)',function(){
					  saveModel()
                  })
				  }
			});
    });
    
  /* $("#taobaoSub").click(function () {
	  // window.location.href="https://oauth.tbsandbox.com/authorize?response_type=code&client_id=1023338424&redirect_uri=localhost:80/admin/account/ceshi.json&state=1212&view=web";
	  // window.location.href="https://oauth.taobao.com/authorize?response_type=token&client_id=23338424&state=1212&view=web";
	   //window.location.href="https://oauth.tbsandbox.com/authorize?response_type=token&client_id=1023338424&state=1212&view=web";
	  // window.location.href="https://oauth.tbsandbox.com/logoff?client_id=1023338424&view=web";
	   window.location.href="/admin/product/taobaoOrderInit.json";

   })*/
   
    getHtmlModelInfo=function(id){
		var modelCode = $('#modelCode').val();
		var name = $('#modelName').val();		
		var modelContent = $('#modelContent').val();	
		var remark = $('#remark').val();	
		var modelType=$("input[name='modelType']:checked").val();
		var data={
			"id" : id,
			"modelCode" : modelCode,
			"name" : name,
			"modelType":modelType,
			"modelContent" : modelContent,
			"remark" : remark
			};
		return data;
    }
    saveModel=function(){
    	var data=getHtmlModelInfo();
    	var url = "/admin/model/save.json";
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
    
    $("#batchDelete").click(function () {
    				var url = "/admin/model/delete.json";
	    			var ids=new Array();
    		    	$("#page_tbody input[name='modelCheckbox']:checked").each(function(){
    		    		ids.push($(this).attr('value')==null?null:parseInt($(this).attr('value')));
    		    	  });
    		    	if(ids.length<1){
    		    		return layer.alert("请选中删除");
    		    	}
    		    	layer.confirm('确定要删除该选中内容吗？删除后将无法恢复', {
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
    		});
    });
    
    deleteById=function(id){
    	layer.confirm('确定要删除内容吗？删除后将无法恢复', {
  		 /* time: 0, //不自动关闭
  		  shade: 0.6,//遮罩透明度
  		  shadeClose:true,//点击遮罩关闭层
  		  btn: ['确定', '取消'],*/
            icon: 3, title: '提示','closeBtn':0,area: ['430px', '240px'],
  		  yes: function(index){
    	var url = "/admin/model/delete.json";
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
					layer.alert(message,{icon: 5});
				}
				},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
			});
    }
    })
    }
    
    updateInfo=function(id){
    	$('#modelForm')[0].reset();
    	var url = "/admin/model/info.json";
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
				$("#modelCode").val(model.modelCode);
				$("#modelName").val(model.name);
				$("input[type='radio'][name='modelType'][value='" + model.modelType + "']").prop("checked", true);
				$("#modelContent").val(model.modelContent);
				$("#remark").val(model.remark);
				var id=model.id;
				layer.open({
					  type: 1,
					  title: "修改模板",
					  btn: ['确定', '取消'],
					  closeBtn: 0,
					  btnAlign: 'r',
					  area: '600px',
					  shadeClose: true,
					  content: $('#modelForm'),
					  success:function (layero, index) {
		                  layero.addClass('layui-form');
		                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
		                  form.render();
		              },
					  yes: function(index){
						  form.on('submit(fromContent)',function(){
							  var data=getHtmlModelInfo(id);
							  updateModel(data)
		                  })
						  }
					});
			},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
			});
    	
    }
    
    updateModel=function(data){
    	var url = "/admin/model/update.json";
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