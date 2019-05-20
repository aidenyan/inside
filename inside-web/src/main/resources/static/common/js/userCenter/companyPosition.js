var form,element,layer,laytpl,myAjax,laydate;
var checkSiteId;
layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
	form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
	form.on('checkbox(selectAllCheckBox)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
	form.verify({
		positionName: [
		 			/^[a-zA-Z0-9\u4e00-\u9fa5]{2,9}$/,
		 			'职位名称格式不正确，只能为2到9位中文数字字母'		    
		 			],
		});      
	companyInit(null,null);
	callParent.isLoadEnd("position_page");
    callParent.register(function () {
    	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
    	var nodes = treeObj.getSelectedNodes();
    	var companyId;
    	if(nodes!=null&&nodes.length>0){
    		companyId=nodes[0].id;
    	}
    	var data={
    			'companyId':companyId,
    			'positionName':$("#searchParam").val()
    	}
    	dataAjaxPage(data);
       }, "search");
});
function beforezTreeOnClick(event, treeId, treeNode,siteId){
	checkSiteId=siteId;
	zTreeOnClick(event,treeId,treeNode);
}
function zTreeOnClick(event, treeId, treeNode) {
	var companyId=treeNode.id;
	if(checkSiteId!=null&&checkSiteId!=treeNode.siteId){
		$("#page_tbody").html("");
		$("#pageNum").html("");
		return layer.msg("权限不足");
	}
	var data={
			'companyId':companyId
	}
	dataAjaxPage(data);
}

var orderObj = new Order(function (obj) {
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var companyId;
	if(nodes!=null&&nodes.length>0){
		companyId=nodes[0].id;
	}
	var data={
			'companyId':companyId,
			'positionName':$("#searchParam").val()
	}
	myAjax.ajaxPage('/admin/position/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption(data),'post');
},"p.create_time");
dataAjaxPage=function(data){
    myAjax.ajaxPage('/admin/position/page.json','pageNum','page_tbody','pageTpl',orderObj.setOption(data),'post');
}

createTableData=function(data) {
	 $.views.converters({
        format:function (vaule) {
            return new Date(vaule).format("yyyy-MM-dd hh:mm:ss")
        }
    }) 
     var jsRenderTpl = $.templates('#j-con-list'),
         finalTpl = jsRenderTpl(data);
        $('#page_tbody').html(finalTpl)
}

$("#searchPosition").click(function(){
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var companyId;
	if(nodes!=null&&nodes.length>0){
		companyId=nodes[0].id;
	}
	var data={
			'companyId':companyId,
			'positionName':$("#searchParam").val()
	}
	dataAjaxPage(data);
})

$('#searchParam').bind('keypress', function(event) {  
    var theEvent = event || window.event;      
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;      
    if (code == 13) {                    
    	event.preventDefault();      
       //回车执行查询  
      $("#searchPosition").click();   
    }   
});  

$("#add_position").click(function () {
		var treeObj = $.fn.zTree.getZTreeObj("companyTree");
		var nodes = treeObj.getSelectedNodes();
		if(nodes==null||nodes.length<1){
			return layer.alert("请选中左侧组织树添加");
		}
		if(checkSiteId!=nodes[0].siteId){
			return layer.msg("权限不足");
		}
		var selectId=nodes[0].id;
		$('#companyPositionForm')[0].reset();
		layer.open({
			  type: 1,
			  title: "新增岗位",
			  btn: ['确定', '取消'],
			  closeBtn: 0,
			  btnAlign: 'r',
			  area: ['600px','auto'],
			  shadeClose: true,
			  content: $('#companyPositionForm'),
			  success:function (layero, index) {
                  layero.addClass('layui-form');
                  layero.find('.layui-layer-btn0').attr('lay-filter', 'companyOrgContent').attr('lay-submit', '')
                  form.render();
              },
			  yes: function(index){
				  form.on('submit(companyOrgContent)',function(){
				  savePosition(selectId,index);
				  })
				 }
			});
    });

getPosition=function(id){
		var positionName=$("#positionName").val();
		var positionDesc=$("#positionDesc").val();
		var data;
		if(id!=null){
			data={
					"id":id,
					"positionName":positionName,
					"positionDesc":positionDesc
			};
		}else{
			var treeObj = $.fn.zTree.getZTreeObj("companyTree");
			var nodes = treeObj.getSelectedNodes();
			var companyId=nodes[0].id;
			data={
					"companyId":companyId,
					"positionName":positionName,
					"positionDesc":positionDesc
			};
		}
		return data;
}

deletePosition=function(id){
	var url = "/admin/position/delete.json";
	var ids=new Array();
	ids.push(id);
	layer.confirm('确定要删除该职位吗？删除后将无法恢复', {
		  /*time: 0, //不自动关闭
		  shade: 0.6,//遮罩透明度
  		  shadeClose:true,//点击遮罩关闭层
  		  btn: ['确定', '取消'],*/
        icon: 3, title: '提示','closeBtn':0,area: ['430px', '240px'],
        btn: ['确定', '取消'],
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
				var treeObj = $.fn.zTree.getZTreeObj("companyTree");
				var nodes = treeObj.getSelectedNodes();
				if(nodes!=null&&nodes.length>0){
					var selectId=nodes[0].id;
					companyInit(selectId,null);
				}else{
					companyInit(null,null);
				}
				layer.close(index);
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
}
updatePosition=function(id){
	$('#companyPositionForm')[0].reset();
	var url = "/admin/position/info.json";
	$.ajax({
		url : url,
		type : "post",
		data:{
			"id":id
		},
		traditional : true,
		dataType : "json",
		success : function(data) {
			var position=data.result;
			$("#positionName").val(position.positionName);
			$("#positionDesc").val(position.positionDesc);
			var id=position.id;
			layer.open({
				  type: 1,
				  title: "修改岗位",
				  btn: ['确定', '取消'],
				  closeBtn: 0,
				  btnAlign: 'r',
				  area: ['600px','auto'],
				  shadeClose: true,
				  content: $('#companyPositionForm'),
				  success:function (layero, index) {
	                  layero.addClass('layui-form');
	                  layero.find('.layui-layer-btn0').attr('lay-filter', 'companyOrgContent').attr('lay-submit', '')
	                  form.render();
	              },
				  yes: function(index){
					  form.on('submit(companyOrgContent)',function(){
					  var data=getPosition(id);
					  updateDetail(data,index)
					  })
					  }
				});
		},
		error:function(message){
			layer.alert(message,{icon: 5});
		}	
		});
}
updateDetail=function(data,index){
	var url = "/admin/position/update.json";
	$.ajax({
			url : url,
			type : "post",
			data:data,
			traditional : true,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				if(data.result==true){
					var treeObj = $.fn.zTree.getZTreeObj("companyTree");
					var nodes = treeObj.getSelectedNodes();
					var parentId=nodes[0].id;
					companyInit(parentId,null);
					layer.close(index);
				}else{
					layer.alert(data.message,{icon: 5});
				}
				},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
			});
}
savePosition=function(selectId,index){
	var url = "/admin/position/save.json";
	var data=getPosition();
	$.ajax({
			url : url,
			type : "post",
			data:data,
			traditional : true,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				if(data.result==true){
					var treeObj = $.fn.zTree.getZTreeObj("companyTree");
					var nodes = treeObj.getSelectedNodes();
					zTreeOnClick(null,null,nodes[0],checkSiteId);
					layer.close(index);
				}else{
					layer.alert(data.message,{icon: 5});
				}
				},
			error:function(message){
				layer.alert(message,{icon: 5});
			}	
			});
}

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}    
