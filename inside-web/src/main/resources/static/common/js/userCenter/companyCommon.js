$().ready(function () {
	getSearch();
})

//页面初始化
var companyInit= function (id,pId) {
		$.ajax({
		url : "/api/admin/account/department/tree",
		type : "post",
		traditional : true,
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			var orgList=data.result;
			var siteId=data.siteId;
			$.fn.zTree.init($("#companyTree"),setting,orgList);
			selectNodeChange(id,pId,siteId);
		},
		error:function(message){
			layer.alert(message);
		}	
	})
}

//通过id选中左边树
var selectNodeChange=function(id,pId,siteId){
	if(id!=null){
		var treeObj = $.fn.zTree.getZTreeObj("companyTree");
		var node = treeObj.getNodeByParam("id", id, null) ;
		if(node==null){
			return pId==null?selectNodeChange(null):selectNodeChange(pId);//展开最上级父类，写死的
		}
		treeObj.selectNode(node);
		treeObj.expandNode(node, true, false, true);
		beforezTreeOnClick(null,null,node,siteId);
	}else{
		var treeObj = $.fn.zTree.getZTreeObj("companyTree");
		var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true);  
		treeObj.selectNode(node);
		treeObj.expandNode(node, true, false, true);
		beforezTreeOnClick(null,null,node,siteId);
	}
}

function getSearch() {
        var oInp=document.getElementById('treeSearch');
        var oUl=document.getElementById('searchList');
        oInp.onkeyup=oInp.onfocus=function(){
            //把input中开头和结尾的空格去掉；
            var val=this.value.replace(/(^ +)|( +$)/g,'');
            if(val!=""){
            	$("#searchList").html("");
            	var treeObj = $.fn.zTree.getZTreeObj("companyTree");
            	var nodes = treeObj.getNodesByParamFuzzy("name",val, null);
            	for(var i=0;i<nodes.length;i++){
            		var li="<li><a href='javascript:void(0);' id='"+nodes[i].id+"'>"+nodes[i].name+"</a></li>";
            		$("#searchList").append(li);
            	}
            }
            oUl.style.display=val.length>0?'block':'none';
        };
        document.body.onclick=function(e){
            e=e||window.event;
            var tar= e.target|| e.srcElement;
            if(tar.tagName.toLowerCase()==='a' && (tar.parentNode!=null&&tar.parentNode.parentNode!=null&&tar.parentNode.parentNode.id==='searchList')){
                oInp.value=tar.innerHTML;
                companyInit(tar.id,null);
            }
            oUl.style.display='none';
        };
        //input处理2：取消冒泡
        oInp.onclick=function(e){
            e=e||window.event;
            e.stopPropagation? e.stopPropagation(): e.cancelBubble=true;
        }
    }
function beforeDrag(treeId, treeNodes){
	return false;
}

var setting = {
		view: {
			selectedMulti: false
		},
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			keep: {
				parent:true,
				leaf:true
			},
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: zTreeOnClick,
			beforeDrag:beforeDrag,
		},
	}
