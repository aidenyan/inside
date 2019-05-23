var formAccountEdit,formPersonEdit,formAuthorityEdit;
var form,element,layer,laytpl,myAjax,laydate;
var platformList,positionList,roleList;
var wareAndRoleList;
var sellerAreaList;
var wid;
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
	form.on('checkbox(sellerFlag)', function(data){
		setSellerAreaList();
	});
	form.on('checkbox(platformFilter)', function(data){
		setWarehouseList();
	});
	form.on('checkbox(warehouseFilter)', function(data){
		setWarehouseBackgroundColor(data.value);
		selectWarehouseCheckbox(data);
	});
	form.on('checkbox(role)', function(data){
		pushToRoleList(data);
	});
	form.on('select(provinceFilter)', function(data){
		changeProvince(data.value);
		}); 
	form.on('select(cityFilter)', function(data){
		changeCity(data.value);
		}); 
	form.verify({
		  accountName: function(value){
			  var reg=new RegExp("[a-zA-Z0-9]{4,20}$");
			    if(!reg.test(value)){
			      return '账号格式不正确，只能为4到20位数字字母';
			    }
			},
		  password: [
			/^[a-zA-Z0-9]{4,20}$/,
			'密码格式不正确，只能为4到20位数字字母'		    
			],
			recheckpassword: function(value){
			    if(value!=$("#password").val()){
			      return '密码输入不一致';
			    }
			},
			/*positionList: function(value){
			    if(isNaN(value)){
			      return '请选择职位';
			    }
			},*/
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
			platformList: function(){
				if(wareAndRoleList==null||wareAndRoleList.keyList.length<1){
					return '请选择权限';
				}else{
					var mapObj=wareAndRoleList.mapObj;
					var count=0;
					for(var i=0;i<wareAndRoleList.keyList.length;i++){
						if(wareAndRoleList.get(wareAndRoleList.keyList[i]).length<1){
							count++;
						}
					}
					if(count==wareAndRoleList.keyList.length){
						return '请选择仓库或仓库对应的角色';
					}
				}
			},
		});      
	companyInit(null,null);
	htmlInit();
	callParent.isLoadEnd("account_page");
    callParent.register(function () {
    	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
    	var nodes = treeObj.getSelectedNodes();
    	var companyId;
    	if(nodes!=null&&nodes.length>0){
    		companyId=nodes[0].id;
    	}
    	var data={
    			'orgId':companyId,
    			'name':$("#searchParam").val()
    	}
    	dataAjaxPage(data);
       }, "search");
});

htmlInit=function(){
	formAccountEdit=$("#form_account").html();
	formAuthorityEdit=$("#form_authority").html();
	formPersonEdit=$("#form_person").html();
}
function beforezTreeOnClick(event, treeId, treeNode,siteId){
	checkSiteId=siteId;
	zTreeOnClick(event,treeId,treeNode);
}
function zTreeOnClick(event, treeId, treeNode) {
	if(checkSiteId!=null&&checkSiteId!=treeNode.siteId){
		$("#page_tbody").html("");
		$("#pageNum").html("");
		return layer.msg("权限不足");
	}
	var companyId=treeNode.id;
	var data={
			'orgId':companyId
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
			'orgId':companyId,
			'name':$("#searchParam").val()
	}
	myAjax.ajaxPage('/api/admin/account/page','pageNum','page_tbody','pageTpl',orderObj.setOption(data),'post');
},"m1.createTime");
dataAjaxPage=function(data){
    myAjax.ajaxPage('/api/admin/account/page','pageNum','page_tbody','pageTpl',orderObj.setOption(data),'post');
}

$("#searchAccount").click(function(){
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var companyId;
	if(nodes!=null&&nodes.length>0){
		companyId=nodes[0].id;
	}
	var data={
			'orgId':companyId,
			'name':$("#searchParam").val()
	}
	dataAjaxPage(data);
})
setSellerAreaList=function(value){
	if($("#sellerFlag").is(":checked")){
		if(sellerAreaList!=null){
			var dateResult={
					"result":sellerAreaList
			}
			myAjax.getTpl("sellerAreaList","sellerAreaListTpl",dateResult,false,function(){
				if(value!=null){
					$("#sellerAreaList").val(value);
				}
			})
		}else{
			myAjax.ajaxTpl("/admin/account/listSellerArea.json","sellerAreaList","sellerAreaListTpl",false,function(dataJson){
				sellerAreaList=dataJson;
				if(value!=null){
					$("#sellerAreaList").val(value);
				}
			})
		}
		$("#sellerAreaHtml").show();
		form.render("select");
	}else{
		$("#sellerAreaHtml").hide();
	}
}
jumpToAddHtml=function(companyId){
	var url="/api/admin/account/role_list";
	$.ajax({
		url : url,
		type : "post",
		traditional : true,
		dataType : "json",
		success : function(data) {
			var roleList=data.result;
            roleListInit(roleList)
			getProvinceList();
		},
		error:function(message){
			layer.alert(message,{icon: 5});
		}	
		});
}
//暂时不验证，后端验证重复问题
checkAccountName=function(id,backfun){
	var url="/admin/account/checkName.json";
	var data={};
	if(id){
		data={
				"id":id,
				"name":$("#accountName").val()	
		}
	}else{
		data={
				"name":$("#accountName").val()
		}
	}
	$.ajax({
		url : url,
		type : "post",
		data:data,
		traditional : true,
		dataType : "json",
		success : function(data) {
			var flag=data.result;
			if(!flag){
				return layer.alert("账号重复，请重新输入",{icon: 5});
			}
			backfun.call(this,flag);
		},
		error:function(message){
			return layer.alert(message,{icon: 5});
		}	
		});
}
pushToRoleList=function(data){
	if(wareAndRoleList==null){
		wareAndRoleList=new Map();
	}
	var id=wid;
	var rList=new Array();
	if($("input[name='role']:checked").length>0){
		$("input[name='warehouse'][value='"+id+"']").prop("checked",true);
		form.render("checkbox");
	}else{
		$("input[name='warehouse'][value='"+id+"']").prop("checked",false);
		form.render("checkbox");
	}
	$("input[name='role']:checked").each(function(){
		rList.push($(this).val())
	})
	wareAndRoleList.push(id,rList);
}
setPlatformList=function(platformList,accountPlatformList){
	var options="";
	$.each(platformList,function(k,p){
		if(accountPlatformList!=null&&accountPlatformList.length>0){
			var count=0;
			for(var i=0;i<accountPlatformList.length;i++){
				if(p.id==accountPlatformList[i].platformId){
					if(p.effective==false){
						options+="<input type='checkbox' lay-filter='platformFilter' name='platform' checked='' lay-skin='primary' title='"+p.name+"(已禁用)' disabled='disabled' value='"+p.id+"'>";
					}else{
						options+="<input type='checkbox' lay-filter='platformFilter' name='platform' checked='' lay-skin='primary' title='"+p.name+"' value='"+p.id+"'>";
					}
				}else{
					count++;
				}
			}
			if(count==accountPlatformList.length){
				if(p.effective==false){
					options+="<input type='checkbox' lay-filter='platformFilter' name='platform' lay-skin='primary' title='"+p.name+"(已禁用)' disabled='disabled' value='"+p.id+"'>";
				}else{
					options+="<input type='checkbox' lay-filter='platformFilter' name='platform' lay-skin='primary' title='"+p.name+"' value='"+p.id+"'>";
				}
			}
		}else{
			if(p.effective==false){
				options+="<input type='checkbox' lay-filter='platformFilter' name='platform' lay-skin='primary' title='"+p.name+"(已禁用)' disabled='disabled' value='"+p.id+"'>";
			}else{
				options+="<input type='checkbox' lay-filter='platformFilter' name='platform' lay-skin='primary' title='"+p.name+"' value='"+p.id+"'>";
			}
		}
	})
	$("#platformList").html(options);
	form.render("checkbox");
}
setPositionList=function(positionList){
	var options="<option>请选择</option>";
	$.each(positionList,function(k,p){
		options+="<option value='"+p.id+"'>"+p.positionName+"</option>";
	})
	$("#positionList").html(options);
	form.render("select");
}

setWarehouseBackgroundColor=function(wareId){
	$('#showFormAuthority span').css('background-color','');
	$('#form_authorityEditHtml span').css('background-color','');
	if($("input[name='warehouse'][value='"+wareId+"']").parent().find('span')[0]){
		$("input[name='warehouse'][value='"+wareId+"']").parent().find('span')[0].style.backgroundColor="#FFB951";
	}
}
setRoleList=function(warehouseId){
	setWarehouseBackgroundColor(warehouseId);
	wid=warehouseId;
	if(!$("input[name='warehouse'][value='"+warehouseId+"']").is(':checked')){
		roleListInit();
	}else{
		var map=wareAndRoleList;
		if(map!=null&&map.keyList.length>0){
			var thisRoleList=map.get(warehouseId);
			roleListInit();
			if(thisRoleList!=null){
				for(var i=0;i<thisRoleList.length;i++){
					$("input[name='role'][value='"+thisRoleList[i]+"']").prop("checked",true)
				}
				form.render("checkbox");
			}
		}else{
			roleListInit();
		}
	}
}

roleListInit=function(roleList){
	var options="";
	$.each(roleList,function(k,p){
		options+="<div class='mizon-dialog-add_use-chooseRol'><input type='checkbox' name='role' lay-filter='role' lay-skin='primary' title='"+p.name+"' value='"+p.id+"'></div>";
	})
	$("#roleList").html(options);
	form.render("checkbox");
	return options;
}
setWarehouseList=function(warehouseList){
	var platformIds=new Array();
	var warehouses=new Array();
	var warehousesSelect=new Array();
	if(warehouseList!=null){
		warehousesSelect=warehouseList;
	}else{
	$('input[name="warehouse"]:checked').each(function(){ 
		warehousesSelect.push($(this).val())
	})
	}
	$('input[name="platform"]:checked').each(function(){ 
		platformIds.push($(this).val());
		if(platformList!=null&&platformList.length>0){
			for(var i=0;i<platformList.length;i++){
				if($(this).val()==platformList[i].id){
					warehouses=pushIntoWarehouses(warehouses,platformList[i].warehouseList);
				}
			}
		}
		});
	var options="";
	$.each(warehouses,function(k,p){
		if(p!=null&&p.id!=null&&p.id!=""){
			options+="<div class='mizon-checkbox'><input type='checkbox' lay-filter='warehouseFilter'  name='warehouse' lay-skin='primary' value='"+p.id+"'><a href='javascript:void(0)' onclick='setRoleList("+p.id+")'><span name='"+p.id+"'>"+p.companyShortName+"</span></a>";
		}
	})
	$("#warehouseList").html(options);
	for(var z=0;z<warehousesSelect.length;z++){
		$("input[name='warehouse'][value='"+warehousesSelect[z]+"']").prop('checked',true)
	}
	if(warehouseList!=null&&warehouseList.length>0){
		var wareId=warehouseList[0];
		setRoleList(wareId);
	}
	if(platformIds==null||platformIds.length<1){
		$("#roleList").html("");
		wid=null;
		wareAndRoleList=null;	
	}
	var flag=0;
	$.each(warehouses,function(k,p){
	if(wid!=null&&wid==p.id){
		$("span[name='"+wid+"']")[0].style.backgroundColor="#FFB951";
	}else{
		flag++;
	}
	if(flag==warehouses.length){
		wid=null;
		$("#roleList").html("");
	}
	})
	form.render("checkbox");
}
selectWarehouseCheckbox=function(data){
	wid=data.value;
	if(wareAndRoleList!=null&&wareAndRoleList.keyList.length>0){
		wareAndRoleList.remove(data.value);
	}
	if(data.elem.checked){
		if(wareAndRoleList!=null&&wareAndRoleList.keyList.length>0){
			wareAndRoleList.push(wid, new Array())
		}else{
			wareAndRoleList=new Map();
			wareAndRoleList.push(wid, new Array())
		}
	}
	roleListInit();
}
pushIntoWarehouses=function(warehouses,warehouseListInPlat){
	if(warehouseListInPlat==null||warehouseListInPlat.length<1){
		return warehouses;
	}
	else if(warehouses==null||warehouses.length<1){
		$.each(warehouseListInPlat,function(k,p){
			if(p!=null&&p.companyShortName!=null&&p.companyShortName!=""){
				warehouses.push(p);
			}
		})
	}else{
		for(var j=0;j<warehouseListInPlat.length;j++){
			var count=0;
			for(var k=0;k<warehouses.length;k++){
				if(warehouseListInPlat[j].id!=warehouses[k].id){
					count++;
				}else{
					break;
				}
				if(count==warehouses.length&&warehouseListInPlat[j]!=null){
					warehouses.push(warehouseListInPlat[j]);
				}
			}
		} 
	}
	return warehouses;
}

updateDetail=function(data,index){
	var url = "/admin/companyOrg/update.json";
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

addUseHtmlInit=function(){
	wareAndRoleList=null;
	wid=null;
	$("#showFormAccount").html(formAccountEdit);
	$("#showFormAuthority").html(formAuthorityEdit);
	$("#showFormPerson").html(formPersonEdit);
	$("#form_account").html("");
	$("#form_authority").html("");
	$("#form_person").html("");
	$("#form_accountEditHtml").html("");
	$("#form_personEditHtml").html("");
	$("#form_authorityEditHtml").html("");
}

$("#add_use").click(function () {
		addUseHtmlInit();
		var treeObj = $.fn.zTree.getZTreeObj("companyTree");
		var nodes = treeObj.getSelectedNodes();
		if(nodes==null||nodes.length<1){
			return layer.alert("请选中左侧组织树添加");
		}
		if(checkSiteId!=nodes[0].siteId){
			return layer.msg("权限不足");
		}
		var companyId=nodes[0].id;
		jumpToAddHtml(companyId);
		form.render("select");
		layer.open({
			  type: 1,
			  title: "添加用户",
			  btn: ['确定', '取消'],
			  closeBtn: 0,
			  btnAlign: 'r',
			  area:['800px', 'auto'],
			  shadeClose: true,
			  content: $('#form_addUse'),
			  success:function (layero, index) {
                  layero.addClass('layui-form');
                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
                  form.render();
              },
			  yes: function(index){
				  form.on('submit(fromContent)',function(){
					  saveAccountInfo(index);
                  })
				 }
			});
    });

checkSaveStatus=function(){
	var accountName=$("#accountName").val();
	var password=$("#password").val();
	var recheckpassword=$("#recheckpassword").val();
	if(accountName==null||accountName==""){
		return layer.alert("账号不能为空",{icon: 5});
	}
	if(password==null||password==""){
		return layer.alert("密码不能为空",{icon: 5});
	}
	if(password!=recheckpassword){
		return layer.alert("密码输入不一致",{icon: 5});
	}
	return true
}
getAccountInfo=function(){
	var data={};
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var orgId=nodes[0].id;
	var accountName=$("#accountName").val();
	var password=$("#password").val();
	var status=$("#status:checked").val();
	if(status!=0){
		status=1;
	}
	var platformList=new Array();
	$('input[name="platform"]:checked').each(function(){
		platformList.push($(this).val())
	})
	var personName=$("#personName").val();
	var email=$("#email").val();
	var contactTel=$("#contactTel").val();
	var contactPhone=$("#contactPhone").val();
	var positionId=$("#positionList").val();
	var reg=new RegExp("^[0-9]+$");
	if(!reg.test(positionId)){
		positionId=null;
	}
	var areaId;
	if(!isNaN($("#sysarea").val())){
		areaId=$("#sysarea").val();
	}else if(!isNaN($("#city").val())){
		areaId=$("#city").val();
	}else{
		areaId=$("#province").val();
	}
	var province=""+$("#province").find("option:selected").text();
	var city=""+$("#city").find("option:selected").text();
	var area=""+$("#sysarea").find("option:selected").text();
	var address=$("#address").val();
	var fullAddress="";
	if($("#sysarea").val()!=""&&$("#sysarea").val()!=null){
		fullAddress+=province+city+area+address;
	}else{
		fullAddress+=province+city+address;
	}
	var sellerFlag;
	var categoryId;
	if($("#sellerFlag").is(":checked")){
		sellerFlag=1;
		categoryId=$("#sellerAreaList").val();
		if(categoryId<0){
			categoryId=null;
		}
	}else{
		sellerFlag=0;
	}
	data={
			'name':accountName,
			'password':password,
			'status':status,
			'type':0,//TODO 目前写死默认系统账号
			'platformList':platformList,
			'warehouseAndRoleMap':wareAndRoleList.mapObj,
			'personName':personName,
			'email':email,
			'contactTel':contactTel,
			'contactPhone':contactPhone,
			'positionId':positionId,
			'areaId':areaId,
			'orgId':orgId,
			'address':address,
			'fullAddress':fullAddress,
			'sellerFlag':sellerFlag,
			'categoryId':categoryId,
	}
	return data;
}
saveAccountInfo=function(index){
	var url = "/admin/account/save.json";
	if(checkSaveStatus()){
		var data=getAccountInfo();
		$.ajax({
			url : url,
			type : "post",
			data:JSON.stringify(data),
			traditional : true,
			dataType : "json",
			contentType : "application/json; charset=utf-8",
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
}
getStatusMsg=function(status){
	var msg="";
	if(status==null){
		return msg;
	}else{
		switch (status) {
		case 0:
			msg="正常";
			break;
		case 1:
			msg="禁用";
			break;
		case 2:
			msg="锁住";
			break;
		default:
			msg="其他";
			break;
		}
		return msg;
	}
}
updateAccount=function(id,obj,status,sellerFlag,categoryId){
	$("#showFormAccount").html("");
	$("#showFormAuthority").html("");
	$("#showFormPerson").html("");
	$("#form_account").html("");
	$("#form_accountEditHtml").html(formAccountEdit);
	$("#accountName").val(obj.value);
	$("#accountName").prop("readonly","readonly");
	$("#prompt_show").append("<div style='display: inline-block;height: 30px;line-height: 30px'>" +
			"<i class='layui-icon' onclick='layer.tips(\""+"不输入密码不会修改密码，输入密码则会修改为输入后的密码"+"\", \"#password_tips\")' id='password_tips' style='vertical-align: middle;color: #009cff;cursor: pointer'>&#xe60b;</i></div>");
	if(status==0){
		$("#status").prop("checked",true);
	}else{
		$("#status").prop("checked",false);
	}
	if(sellerFlag!=null&&sellerFlag==1){
		$("#sellerFlag").prop("checked",true);
		setSellerAreaList(categoryId);
	}else{
		$("#sellerFlag").prop("checked",false);
	}
	form.render("checkbox");
	layer.open({
		  type: 1,
		  title: "账户管理",
		  btn: ['确定', '取消'],
		  closeBtn: 0,
		  btnAlign: 'r',
		  area:['600px', 'auto'],
		  shadeClose: true,
		  content: $('#form_accountEdit'),
		  yes: function(index){
			editAccountInfo(index,id,status);
			 }
		});
}

editAccountInfo=function(index,id,restatus){
	var status=$("#status:checked").val();
	var url="/admin/account/accountEdit.json";
	if(status==0){
		status=0;
	}else{
		if(restatus==0){
			status=1;
		}else{
			status==null;
		}
	}
	var sellerFlag;
	var categoryId;
	var checkUpdateCategoryFlag;
	if($("#sellerFlag").is(":checked")){
		sellerFlag=1;
		categoryId=$("#sellerAreaList").val();
		if(categoryId<0){
			categoryId=null;
		}
	}else{
		sellerFlag=0;
		checkUpdateCategoryFlag=true;
	}
	var passwordEdit=$("#password").val();
	var recheckpasswordEdit=$("#recheckpassword").val();
	if(passwordEdit!=recheckpasswordEdit){
		return layer.msg('密码不一致，请重新输入密码', {icon: 5});
	}
	if(passwordEdit==""){
		passwordEdit=null;
	}else if(passwordEdit!=""&&passwordEdit!=null){
		var reg=new RegExp("[a-zA-Z0-9]{4,20}");
		if(!reg.test(passwordEdit)){
			return layer.msg('密码格式不正确，只能为4到20位数字字母', {icon: 5});
		}
	}
	var data={
			'id':id,
			'password':passwordEdit,
			'status':status,
			'sellerFlag':sellerFlag,
			'categoryId':categoryId,
			'checkUpdateCategoryFlag':checkUpdateCategoryFlag,
	}
	$.ajax({
		url : url,
		type : "post",
		data:JSON.stringify(data),
		traditional : true,
		dataType : "json",
		contentType : "application/json; charset=utf-8",
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

updatePerson=function(id){
	$("#showFormAccount").html("");
	$("#showFormAuthority").html("");
	$("#showFormPerson").html("");
	$("#form_person").html("");
	$("#form_personEditHtml").html(formPersonEdit);
	var url="/admin/account/personInfo.json";
	var data={
			'id':id
	}
	$.ajax({
		url : url,
		type : "post",
		data:data,
		traditional : true,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var person=data.result;
			$("#personName").val(person.name);
			$("#email").val(person.email);
			$("#contactTel").val(person.contactTel);
			$("#contactPhone").val(person.contactPhone);
			setPositionList(person.positionList);
			$("#positionList").val(person.positionId);
			var areaId=person.areaId;
			if(areaId!=null){
				getAreaSelect(person.areaId);
			}else{
				getProvinceList();
			}
			var address=$("#address").val(person.address);
			layer.open({
				  type: 1,
				  title: "用户编辑",
				  btn: ['确定', '取消'],
				  closeBtn: 0,
				  btnAlign: 'r',
				  area:['600px', 'auto'],
				  shadeClose: true,
				  success:function (layero, index) {
	                  layero.addClass('layui-form');
	                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
	                  form.render();
	              },
				  content: $('#form_personEdit'),
				  yes: function(index){
					  form.on('submit(fromContent)',function(){
						  editPersonInfo(index,id);
	                  })
					 }
				});
			},
		error:function(message){
			layer.alert(message,{icon: 5});
		}	
		});
}

editPersonInfo=function(index,id){
	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
	var nodes = treeObj.getSelectedNodes();
	var companyId=nodes[0].id;
	var data=getPersonInfo(id,companyId);
	var url="/admin/account/personInfoEdit.json"
	$.ajax({
		url : url,
		type : "post",
		data:JSON.stringify(data),
		traditional : true,
		dataType : "json",
		contentType : "application/json; charset=utf-8",
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
$('#searchParam').bind('keypress', function(event) {  
    var theEvent = event || window.event;      
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;      
    if (code == 13) {                    
    	event.preventDefault();      
       //回车执行查询  
      $("#searchAccount").click();   
    }   
});  
getPersonInfo=function(id,companyId){
	var personName=$("#personName").val();
	var email=$("#email").val();
	var contactTel=$("#contactTel").val();
	var contactPhone=$("#contactPhone").val();
	var positionId=$("#positionList").val();
	var reg=new RegExp("^[0-9]+$");
	if(!reg.test(positionId)){
		positionId=null;
	}
	var areaId=getselectAreaId();
	var address=$("#address").val();
	var province=""+$("#province").find("option:selected").text();
	var city=""+$("#city").find("option:selected").text();
	var area=""+$("#sysarea").find("option:selected").text();
	var fullAddress="";
	if($("#sysarea").val()!=""&&$("#sysarea").val()!=null){
		fullAddress+=province+city+area+address;
	}else{
		fullAddress+=province+city+address;
	}
	var areaCheck=null;
	if(areaId==null){
		areaCheck="deleteArea";
	}
	var data={
			'id':id,
			'name':personName,
			'email':email,
			'contactTel':contactTel,
			'contactPhone':contactPhone,
			'positionId':positionId,
			'areaId':areaId,
			'companyId':companyId,
			'areaCheck':areaCheck,
			'address':address,
			'fullAddress':fullAddress
	}
	return data;
}
updateAuthority=function(id){
	wareAndRoleList=null;
	$("#showFormAccount").html("");
	$("#showFormAuthority").html("");
	$("#showFormPerson").html("");
	$("#form_authority").html("");
	$("#form_authorityEditHtml").html(formAuthorityEdit);
	var url="/admin/account/authorityInfo.json";
	var data={
			'id':id
	}
	$.ajax({
		url : url,
		type : "post",
		data:data,
		traditional : true,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var accountVO=data.result;
			platformList=accountVO.platformList;
			roleList=accountVO.roleList;
			var newwareAndRoleList=accountVO.warehouseAndRoleMap;
			var accountPlatformList=accountVO.accountPlatformList;
			var map=new Map();
			var warehouseList=new Array();
			$.each(newwareAndRoleList,function(k,p){
				warehouseList.push(k);
				map.push(k,p);
			})
			wareAndRoleList=map;
			setPlatformList(platformList,accountVO.accountPlatformList);
			setWarehouseList(warehouseList);
			layer.open({
				  type: 1,
				  title: "权限修改",
				  btn: ['确定', '取消'],
				  closeBtn: 0,
				  btnAlign: 'r',
				  area:['800px', '500px'],
				  shadeClose: true,
				  content: $('#form_authorityEdit'),
				  success:function (layero, index) {
	                  layero.addClass('layui-form');
	                  layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '')
	                  form.render();
	              },
				  yes: function(index){
					  form.on('submit(fromContent)',function(){
						  editAuthorityInfo(index,id);
	                  })
					 }
				});
			},
		error:function(message){
			layer.alert(message,{icon: 5});
		}	
		});
}
getAuthorityInfo=function(id){
	var platformList=new Array();
	$('input[name="platform"]:checked').each(function(){
		platformList.push($(this).val())
	})
	if(platformList==null||platformList.length<1){
		return layer.alert("请先选则内容",{icon: 5});
	}
	var data={
			'id':id,
			'platformList':platformList,
			'warehouseAndRoleMap':wareAndRoleList.mapObj,
	}
	return data;
}
editAuthorityInfo=function(index,id){
	var data=getAuthorityInfo(id);
	var url="/admin/account/authorityEdit.json"
	$.ajax({
		url : url,
		type : "post",
		data:JSON.stringify(data),
		traditional : true,
		dataType : "json",
		contentType : "application/json; charset=utf-8",
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

deleteAccount=function(id){
	var url = "/admin/account/delete.json";
	var ids=new Array();
	ids.push(id);
	layer.confirm('确定要删除该用户吗？删除后将无法恢复', {
		 /* time: 0, //不自动关闭
		  shade: 0.6,//遮罩透明度
  		  shadeClose:true,//点击遮罩关闭层*/
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