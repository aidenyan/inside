var form,element,layer,laytpl,myAjax,laydate;
var checkSiteId;
var supervisorList;
layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
	form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
	form.on('checkbox(selectAllCheckBox)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
	form.on('checkbox(warehouse)', function(data){
		warehouseClick();
		});
	form.on('select(provinceFilter)', function(data){
		changeProvince(data.value);
		});
	form.on('select(cityFilter)', function(data){
		changeCity(data.value);
		});
	form.verify({
		companyName: [
		 			/^[\u4e00-\u9fa5]{4,20}/,
		 			'组织全称格式不正确，只能为4到20位中文'
		 			],
		companyShortName: [
			 			/^[\u4e00-\u9fa5]{2,20}/,
			 			'组织简称格式不正确，只能为2到20位中文'
			 			],
		companyTypeCheck: function(){
			if($("input[name='agentType']:checked").length<1){
				return "请选择组织类型";
			}
			},
		num: function (value, item) {
			if (Utils.isNotBlack(value)) {
				if (!/^(([0-9])|([1-9][0-9]+))$/.test(value)) {
					return  '必须为正整数';
				}
			}
		},
		sysarea: function(){
			    if(!isNaN($("#province").val())){
			    	if(isNaN($("#city").val())){
			    		return '所在地区请选完整';
			    	}else{
			    		if($("#sysarea option").length>1&&isNaN($("#sysarea").val())){
			    			return '所在地区请选完整';
			    		}
			    	}
			    }
			},
		});
	companyInit(null,null);
	callParent.isLoadEnd("companyOrg_page");
    callParent.register(function () {
    	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
    	var nodes = treeObj.getSelectedNodes();
    	var parentId;
    	if(nodes!=null&&nodes.length>0){
    		parentId=nodes[0].id;
    	}
       var data={
    		   'parentTree':","+parentId+",",
    		   'companyName':$("#searchParam").val()
       }
    	dataAjaxPage(data);
       }, "search");
});
function beforezTreeOnClick(event, treeId, treeNode,siteId){
	checkSiteId=siteId;
	zTreeOnClick(event,treeId,treeNode);
}
function zTreeOnClick(event, treeId, treeNode) {
	var id=treeNode.id;
	if(checkSiteId!=null&&checkSiteId!=treeNode.siteId){
		$("#page_tbody").html("");
		$("#pageNum").html("");
		return layer.msg("权限不足");
	}
	var data={
			'parentId':id
	}
	dataAjaxPage(data);
}

var orderObj = new Order(function (obj) {
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var parentId;
	if(nodes!=null&&nodes.length>0){
		parentId=nodes[0].id;
	}
   var data={
		   'parentId':parentId,
		   'department':$("#searchParam").val()
   }
	myAjax.ajaxPage('/api/admin/account/department/page','pageNum','page_tbody','pageTpl',orderObj.setOption(data),'post');
},"c.create_time");
dataAjaxPage=function(data){
    myAjax.ajaxPage('/api/admin/account/department/page','pageNum','page_tbody','pageTpl',orderObj.setOption(data),'post');
}
//组织类型
companyOrgTypeRechange=function(value,defaultWarehouse){
	if(value==null||value==""){
		return "";
	}
	var binary=value.toString(2);
	var msg='';
	var l=binary.length;
	for(var i=0;i<l;i++){
		var v=binary.charAt(i);
		if(v==1){
			switch(l-1-i)
			{
			case 0:
				msg=msg+'/公司';
			  break;
			case 1:
				msg=msg+'/供应商';//目前暂时去掉
			  break;
			case 2:
				msg=msg+'/经销商';
			  break;
			case 3:
				if(defaultWarehouse!=null&&defaultWarehouse==true){
					msg=msg+'/仓库(默认)';
				}else{
					msg=msg+'/仓库';
				}
				break;
			case 4:
				msg=msg+'/门店';
				break;
			case 5:
				msg=msg+'/合作方';
				break;
			default:
			}
		}
	}
	return msg.substring(1,msg.length);
}

//根据组织类型找出哪几种组织
companyOrgTypeArray=function(value){
	if(value==null||value==""){
		return null;
	}
	var binary=value.toString(2);
	var num=new Array();
	var l=binary.length;
	for(var i=0;i<l;i++){
		var v=binary.charAt(i);
		if(v==1){
			num.push(Math.pow(2,l-1-i));
		}
	}
	return num;
}
companyOrgTypeSelect=function(value,platformList,platformInfoList,defaultWarehouse,checkInventory,supervisorId,orderNum){
	var types=companyOrgTypeArray(value);
	if(types!=null&&types.length>0){
	for(var i=0;i<types.length;i++){
		$("input[type='checkBox'][name='companyType'][value='" + types[i] + "']").prop("checked", true);
		if(types[i]==parseInt($("#warehouse").val())){
			$("#warehouse").prop("disabled",true);
			platformListShow(platformInfoList);
			if(platformList!=null&&platformList.length>0){
				for(var j=0;j<platformList.length;j++){
					$("input[type='checkBox'][name='platform'][value='" + platformList[j] + "']").prop("checked", true);
				}
			}
			$("#password_tips").remove();
			if(defaultWarehouse!=null&&defaultWarehouse==true){
				$("#warehouse").prop("disabled",true);
				$("#defaultWarehouse").prop("checked",true);
				$("#defaultWarehouse").prop("disabled",true);
				$("#defaultWarehouseHtml").append("<div style='display: inline-block;height: 30px;line-height: 30px'id='password_tips'>" +
						"<i class='layui-icon' onclick='layer.tips(\""+"默认仓库不能修改,只能替换"+"\", \"#password_tips\")'  style='vertical-align: middle;color: #009cff;cursor: pointer'>&#xe60b;</i></div>");
			}
			if(checkInventory!=null&&checkInventory==true){
				$("#checkInventory").prop("checked",true);
			}
			$("#order_num").val(orderNum);
			$("#showDefaultWarehouse").show();
			$("#showCheckInventory").show();
			$("#warehouse_orders").show();
		}else if(types[i]==parseInt($("#storeInfo").val())){
			$("#storeInfo").prop("disabled",true)
		}
	}
	}
	form.render("checkbox");
}

$("#searchCompany").click(function(){
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var parentId;
	if(nodes!=null&&nodes.length>0){
		parentId=nodes[0].id;
	}
   var data={
		   'parentTree':","+parentId+",",
		   'companyName':$("#searchParam").val()
   }
   dataAjaxPage(data);
})

$("#add_org").click(function () {
		$("#showSupervisor").hide();
		$("#checkSupervisor").html("<option value='-1'></option>");
		$("#platformInnerHtml").html("");
		$("#showPlatForm").hide();
		$("#showDefaultWarehouse").hide();
		$("#showCheckInventory").hide();
	    $("#warehouse_orders").hide();
		$("#warehouse").prop("disabled",false);
		$("#defaultWarehouse").prop("disabled",false);
		$("#consumer").prop("disabled",false);
		var treeObj = $.fn.zTree.getZTreeObj("companyTree");
		var nodes = treeObj.getSelectedNodes();
		if(nodes==null||nodes.length<1){
			return layer.msg("请选中左侧组织树添加");
		}
		if(checkSiteId!=nodes[0].siteId){
			return layer.msg("权限不足");
		}
		var selectId=nodes[0].id;
		var agentType=nodes[0].agentType;
        $("#agent_type_div").find("input").removeAttr("disabled")
		if(agentType==2||agentType==3){
            $("#agent_type_div").find("input").eq(0).attr("disabled","disabled")
		}
		if(agentType==3){
			$("#agent_type_div").find("input").eq(1).attr("disabled","disabled")
		}

		var parentTree=nodes[0].parentTree;
		$('#companyOrgForm')[0].reset();
		getProvinceList();
			layer.open({
				  type: 1,
				  title: "添加组织",
				  btn: ['确定', '取消'],
				  closeBtn: 0,
				  btnAlign: 'r',
				  area: ['600px', 'auto'],
				  shadeClose: false,
				  content: $('#companyOrgForm'),
				  success:function (layero, index) {
	                  layero.addClass('layui-form');
	                  layero.find('.layui-layer-btn0').attr('lay-filter', 'companyOrgContent').attr('lay-submit', '')
	                  $("#storeInfo").prop("disabled",true);
	                  form.render();
	              },
				  yes: function(index){
					  var newIndex=index;
					  form.on('submit(companyOrgContent)',function(){
							  saveCompanyOrg(selectId,newIndex);
	                  })
					 }
				});
    })

platformListShow=function(result){
	if(result==null){
		return;
	}
	var checkBox="";
	$.each(result,function(k,v){
		if(v.effective==false){
			checkBox+="<input type='checkbox' name='platform' lay-skin='primary'  value='"+v.id+"' title='"+v.name+"(已禁用)"+"' disabled='disabled'>";
		}else{
			checkBox+="<input type='checkbox' name='platform' lay-skin='primary'   value='"+v.id+"' title='"+v.name+"'>";
		}
		$("#platformInnerHtml").html(checkBox);
	})
	form.render("checkbox");
	$("#showPlatForm").show();
}

warehouseClick=function(){
	if($("#warehouse").is(":checked")){
		$("#showDefaultWarehouse").show();
		$("#showCheckInventory").show();
		$("#warehouse_orders").show();
		var url="/admin/platform/listAll.json";
		$.ajax({
			url : url,
			type : "post",
			traditional : true,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				platformListShow(data.result);
			},
			error:function(message){
				layer.alert(message,{icon: 5});
			}
		});
	}else{
		$("#platformInnerHtml").html("");
		$("input[name='platform'][type='checkbox']:checked").each(function(){
			$(this).attr("checked",false);
		})
		$("#showPlatForm").hide();
		$("#showDefaultWarehouse").hide();
		$("#defaultWarehouse").attr("checked",false);
		$("#showCheckInventory").hide();
		$("#checkInventory").attr("checked",false);
		$("#warehouse_orders").hide();
	}
}
$('#searchParam').bind('keypress', function(event) {
    var theEvent = event || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
    	event.preventDefault();
       //回车执行查询
      $("#searchCompany").click();
    }
});

getCompanyOrg=function(id,parentId){
		var agentType=0;

		$("input[name='agentType'][type='radio']:checked").each(function(){
            agentType=$(this).val();
		})

		var departmentName=$("#companyName").val();
		var departmentShortName=$("#companyShortName").val();
		var agentCode=$("#agentCode").val();
		var legalPerson=$("#legalPerson").val();
		var contactTel=$("#contactTel").val();
		var contactPhone=$("#contactPhone").val();
		var areaId=getselectAreaId();
		var fullAddress=$("#fullAddress").val();
		var remark=$("#remark").val();
		var province=""+$("#province").find("option:selected").text();
		var city=""+$("#city").find("option:selected").text();
		var area=""+$("#sysarea").find("option:selected").text();
		var address="";
		if($("#sysarea").val()!=""&&$("#sysarea").val()!=null){
			address+=province+city+area;
		}else{
			address+=province+city;
		}
		var data;
		if(id!=null){
			var areaCheck=null;
			if(areaId==null){
				areaCheck="deleteArea";
			}
			data={
					"id":id,
					"agentType":agentType,
					"parentId":parentId,
					"departmentShortName":departmentShortName,
					"departmentName":departmentName,
					"agentCode":agentCode,
					"legalPerson":legalPerson,
					"contactTel":contactTel,
					"contactPhone":contactPhone,
					"areaId":areaId,
					"areaCheck":areaCheck,
					"address":fullAddress,
					"fullAddress":address+fullAddress,
					"remark":remark

			};
		}else{
			var treeObj = $.fn.zTree.getZTreeObj("companyTree");
			var nodes = treeObj.getSelectedNodes();
			var parentId=nodes[0].id;
			var parentTree=nodes[0].parentTree;
			var level=parseInt(nodes[0].level)+1;
			data={
					"parentId":parentId,
					"level":level,
					"parentTree":parentTree,
					"agentType":agentType,
					"departmentName":departmentName,
					"departmentShortName":departmentShortName,
					"agentCode":agentCode,
					"legalPerson":legalPerson,
					"contactTel":contactTel,
					"contactPhone":contactPhone,
					"areaId":areaId,
					"address":fullAddress,
					"fullAddress":address+fullAddress,
					"remark":remark
			};
		}
		return data;
}
updateCompanyOrg=function(id){
	areaClear();
	$("#showPlatForm").hide();
	$("#showDefaultWarehouse").hide();
	$("#showCheckInventory").hide();
	$("#warehouse_orders").hide();
	$('#companyOrgForm')[0].reset();
	$("#warehouse").prop("disabled",false);
	$("#defaultWarehouse").prop("disabled",false);
	var url = "/api/admin/account/department/info";
	$.ajax({
		url : url,
		type : "post",
		data:{
			"id":id
		},
		traditional : true,
		dataType : "json",
		success : function(data) {
			var companyOrg=data.result;
			var parentId=companyOrg.parentId;
			companyOrgTypeSelect(companyOrg.agentType,companyOrg.platformList,companyOrg.platformInfoList,companyOrg.defaultWarehouse,companyOrg.checkInventory,companyOrg.supervisorId,companyOrg.orderNum);
			if(companyOrg.checkHasConsumer!=null&&companyOrg.checkHasConsumer==true){
				$("#companyOrgForm .consumer").prop("disabled",true);
			}
			$("#companyName").val(companyOrg.departmentName);
			$("#companyShortName").val(companyOrg.departmentShortName);
			$("#agentCode").val(companyOrg.agentCode);
			$("#legalPerson").val(companyOrg.legalPerson);
			$("#contactTel").val(companyOrg.contactTel);
			$("#contactPhone").val(companyOrg.contactPhone);
			getAreaSelect(companyOrg.areaId);
			$("#fullAddress").val(companyOrg.address);
			$("#remark").val(companyOrg.remark);
			var id=companyOrg.id;
			layer.open({
				  type: 1,
				  title: "修改组织",
				  btn: ['确定', '取消'],
				  closeBtn: 0,
				  btnAlign: 'r',
				  area: ['600px', '480px'],
				  shadeClose: true,
				  content: $('#companyOrgForm'),
				  success:function (layero, index) {
	                  layero.addClass('layui-form');
	                  layero.find('.layui-layer-btn0').attr('lay-filter', 'companyOrgContent').attr('lay-submit', '')
	                  form.render();
	              },
				  yes: function(index){
					  var pindex=index;
					  form.on('submit(companyOrgContent)',function(){
						 if($("#consumer").is(':checked')){
								if($("#companyCode").val()==''||$("#companyCode").val()==null){
									return layer.msg("经销商组织编码不能为空");
								}else{
									if($("#defaultWarehouse").is(":checked")){
										layer.msg('每个经销商下默认仓库只有一个<br>当前选中的默认仓库会成为新的默认仓库<br>之前经销商下的默认仓库取消', {
											time: 0, //不自动关闭
											shade: 0.6,//遮罩透明度
											shadeClose:true,//点击遮罩关闭层
											btn: ['确定', '取消'],
											yes: function(index){
												layer.close(index);
												var data=getCompanyOrg(id,parentId);
												updateDetail(data,pindex)
											}
										})
									}else{
										var data=getCompanyOrg(id,parentId);
										updateDetail(data,pindex)						  
									}
								}
								}
						 else{
							 var data=getCompanyOrg(id,parentId);
							 updateDetail(data,pindex)	
						 }
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
	var url = "/api/admin/account/department/update";
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
					companyInit(parentId,nodes[0].pId);
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

deleteCompanyOrg=function(id,orgType){
	var url = "/api/admin/account/department/delete";
	var data={
			"id":id
	}
	if(orgType!=null&&((orgType&8)==8)){//仓库不允许删除，只能修改其它类型
		return layer.msg("仓库不能删除,只能修改");
	}else{
		layer.confirm('确定要删除该组织吗？删除后将无法恢复', {
			 /* time: 0, //不自动关闭
			  shade: 0.6,//遮罩透明度
	  		  shadeClose:true,//点击遮罩关闭层*/
	          icon: 3, title: '提示','closeBtn':0,area: ['430px', '240px'],
	  		  btn: ['确定', '取消'],
			  yes: function(index){
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
					if(nodes!=null&&nodes.length>0){
						var selectId=nodes[0].id;
						companyInit(selectId,nodes[0].pId);
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
}
saveCompanyOrg=function(selectId,index){
	var url = "/api/admin/account/department/save";
	var data=getCompanyOrg();
	if($("#consumer").is(':checked')){
		if($("#companyCode").val()==''||$("#companyCode").val()==null){
			return layer.msg("经销商组织编码不能为空");
		}else{
			$.ajax({
				url : url,
				type : "post",
				data:data,
				traditional : true,
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					if(data.result==true){
						companyInit(selectId,null);
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
	}else{
		$.ajax({
			url : url,
			type : "post",
			data:data,
			traditional : true,
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				if(data.result==true){
					companyInit(selectId,null);
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
}
