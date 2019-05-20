var form,element,layer,laytpl,myAjax,laydate;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		form.on('radio(statusFilter)', function(data){
			 searchOrders();
		});
		 $("#btnSearch").click(function(){
			 searchOrders();
		 })
		 var mapObjParam;
		 searchOrders=function(){
				var map=new Map();
				var notSend="";
				$("#statusList input[type='radio']:checked").each(function(){
					notSend=$(this).val();
				})
				if(notSend){
					map.push("notSend",notSend);
				}
				
				mapObjParam=map.mapObj;
				myAjax.ajaxPage('/admin/order/pageBcOrderList.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			}
		 var orderObj = new Order(function (obj) {
				myAjax.ajaxPage('/admin/order/pageBcOrderList.json','pageNum','page_tbody','pageTpl',orderObj.setOption(mapObjParam),'post');
			},"bc.create_time");
		 searchOrders();
		 /*callParent.isLoadEnd("bc_choice");
	     callParent.register(function () {
	    	 searchOrders();
	        }, "search");*/
		 bcDetail=function(bcCode){
			 //callParent.openTab("bc_check", 0, "波次拣货", "PDA/pages/bc_check.html?bcCode="+bcCode, true);
			 window.location.href="bc_check.html?bcCode="+bcCode;
		 }
	    changeStatus=function(item){
	    	if(item==null){
	    		return "";
	    	}else{
	    		var countOrder=item.countOrder;
	    		var countSend=item.countSend;
	    		var countUnSend=item.countUnSend;
	    		var countUnScan=item.countUnScan;
	    		var countUnScaning=item.countUnScaning;
	    		var countUnScaned=item.countUnScaned;
	    		if(countSend==0){
		    		return "未发货";
		    	}else if(countUnSend==0){
		    		return "已发货";
		    	}else{
		    		return "部分发货";
		    	}
	    	}
	    }
	    
	});
   });

	