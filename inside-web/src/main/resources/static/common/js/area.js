areaClear=function(vId){
	$("#city"+vId).html("<option value=''></option>");
	$("#cityList"+vId).hide();
	$("#sysarea"+vId).html("<option value=''></option>");
	$("#areaList"+vId).hide();
	return true;
}

getselectAreaId=function(vId){
	if (!Utils.isNotNull(vId)) {
		vId = '';
	}
	var areaId=null;
	if($("#sysarea"+vId).val() != '' && !isNaN($("#sysarea"+vId).val())){
		areaId=$("#sysarea"+vId).val();
	}else if($("#city"+vId).val() != '' && !isNaN($("#city"+vId).val())){
		areaId=$("#city"+vId).val();
	}else{
		areaId=$("#province"+vId).val();
	}
	if(isNaN(areaId)){
		areaId=null
	}
	return areaId;
}
//获得省列表
getProvinceList=function(vId,fnc){
	if (!Utils.isNotNull(vId)) {
		vId = '';
	}
	areaClear(vId);
	$.ajax({
		url : "/api/admin/common/listByParentId",
		type : "post",
		traditional : true,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var provinces=data.result;
			var option="<option value=''></option>";
			$.each(provinces, function (k, p) {
				option+="<option value='"+p.id+"'>"+p.name+"</option>";
			})
			$("#province"+vId).html(option);
			form.render("select");
		},
		error:function(message){
			layer.alert(message);
		}
	})
}

changeProvince=function(value, vId){
	if (!Utils.isNotNull(vId)) {
		vId = '';
	}
	areaClear(vId);
	if(isNaN(value)){
		return false;
	}
	var provinceId =value;
	$.ajax({
		url : "/admin/area/listByParentId.json",
		type : "post",
		traditional : true,
		data:{
			'parentId':provinceId
		},
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var citys=data.result;
			var option="<option value=''></option>";
			$.each(citys, function (k, p) {
				option+="<option value='"+p.id+"' name='cityName'>"+p.name+"</option>";
			})
			$("#city"+vId).html(option);
			$("#cityList"+vId).show();
			form.render("select");
		},
		error:function(message){
			layer.alert(message);
		}
	})
}

changeCity=function(value, vId){
	if (!Utils.isNotNull(vId)) {
		vId = '';
	}
	$("#sysarea"+vId).html("<option value=''></option>");
	$("#sysarea"+vId).attr('lay-verify',"");
	$("#areaList"+vId).hide();
	if(isNaN(value)){
		return false;
	}
	var provinceId = value;
	$.ajax({
		url : "/admin/area/listByParentId.json",
		type : "post",
		traditional : true,
		data:{
			'parentId':provinceId
		},
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var citys=data.result;
			if(citys!=null&&citys.length>0){
				option="<option value=''></option>";
				$.each(citys, function (k, p) {
					option+="<option value='"+p.id+"'>"+p.name+"</option>";
				})
				$("#sysarea"+vId).html(option);
				$("#sysarea"+vId).attr('lay-verify',"required");
				$("#areaList"+vId).show();
				form.render("select");
			}
		},
		error:function(message){
			layer.alert(message);
		}
	})
}

getAreaSelect=function(id, vId){
	if (!Utils.isNotNull(vId)) {
		vId = '';
	}
	if(id==null){
		getProvinceList(vId);
		return false;
	}
	$.ajax({
		url : "/admin/area/listSelectArea.json",
		type : "post",
		traditional : true,
		data:{
			'areaId':id
		},
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var areaList=data.result;
			areaSelect(id,areaList,vId);
		},
		error:function(message){
			layer.alert(message);
		}
	})
}
var areaVerifyHtml;
areaSelect=function(id,areaList,vId){
	var provinces="<option value=''></option>";
	var citys="<option value=''></option>";
	var areas="<option value=''></option>";
	var parentTree="";
	$.each(areaList, function (k, p) {
		if(id==p.id){
			parentTree=p.parentTree;
		}
		if(p.parentId==null||p.parentId==""){
			provinces+="<option value='"+p.id+"'>"+p.name+"</option>";
		}else{
			if(p.parentTree!=null&&(p.parentTree.split(',')).length>3){
				areas+="<option value='"+p.id+"'>"+p.name+"</option>";
			}else{
				citys+="<option value='"+p.id+"' onchange='changeCity()'>"+p.name+"</option>";
			}
		}
	})
	$("#province"+vId).html(provinces);
	$("#city"+vId).html(citys);
	if(areas!="<option value=''></option>"){
		$("#sysarea"+vId).html(areas);
	}
	var ids=new Array();
	var reg=new RegExp("/^[0-9]*$/");
	if(parentTree!=""){
		var pIds=parentTree.split(',')
		var pl=pIds.length;
		for(var i=0;i<pl;i++){
			if(pIds[i]!=""){
				ids.push(pIds[i])
			}
		}
	}
	if(ids.length>1){
		$("#province"+vId).val(ids[0]);
		$("#city"+vId).val(ids[1]);
		$("#sysarea"+vId).val(id);
		if($("#sysarea"+vId).attr("lay-verify")&&$("#sysarea"+vId).attr("lay-verify").length>0){
			areaVerifyHtml=$("#sysarea"+vId).attr("lay-verify");
		}
		$("#cityList"+vId).show();
		$("#areaList"+vId).show();
		$("#sysarea"+vId).attr("lay-verify",areaVerifyHtml)
	}else{
		if($("#sysarea"+vId).attr("lay-verify")&&$("#sysarea"+vId).attr("lay-verify").length>0){
			areaVerifyHtml=$("#sysarea"+vId).attr("lay-verify");
		}
		if(ids.length>0){
			$("#province"+vId).val(ids[0]);
			$("#city"+vId).val(id);
			$("#cityList"+vId).show();
			$("#sysarea"+vId).attr("lay-verify","")
		}else{
			$("#province"+vId).val(id);
			$("#cityList"+vId).hide();
		}
	}
	form.render("select");
}
