var form,element,layer,laytpl,myAjax,laydate;
var supervisorList;
var storeTypeMap;
$().ready(function () {
	layui.use(['form','laypage','layer','laytpl','element','myAjax','laydate'], function () {
		var laypage = layui.laypage
		form = layui.form();element = layui.element();layer=layui.layer;laytpl = layui.laytpl;myAjax = layui.myAjax;laydate = layui.laydate;
		 myAjax.ajaxTpl("/admin/supervisor/listStoreType.json",'storeTypeList', 'storeTypeTpl',false,function(dataJson){
			 if(storeTypeMap==null){
				 storeTypeMap=new Map();
			 }
			 $.each(dataJson,function(k,p){
				 storeTypeMap.push(p.code,p.name);
			 })
		 });
		 var searchParam;
	     searchOrders=function(){
	    	 var searchInput=$("#searchParam").val();
	    	 var storeType=$("#storeTypeList").val();
	    	 if(storeType<0){
	    		 storeType=null;
	    	 }
	    	 searchParam={
	    			 "storeName":searchInput,
	    			 "storeType":storeType
	    	 } 
	    	 myAjax.ajaxPage('/admin/supervisor/pageSupervisorStore.json','pageNum','page_tbody','pageTpl',orderObj.setOption(searchParam),'post',undefined,function(data){
				 checkAuthority(data.authorityCodeList, ["supervisor_store_remove_info"]);
			 });
	     }
	     var orderObj = new Order(function (obj) {
    		 myAjax.ajaxPage('/admin/supervisor/pageSupervisorStore.json','pageNum','page_tbody','pageTpl',orderObj.setOption(searchParam),'post',undefined,function(data){
				 checkAuthority(data.authorityCodeList, ["supervisor_store_remove_info"]);
			 });
    	 },"org.id");
	     searchOrders();
	     
	     $("#btnSearch").click(function(){
			 searchOrders();
		 })
		 
		 selectSupervisor=function(storeId,channelType,memberId){
	    	 if(storeId==null){
	    		 return layer.msg("门店id为空");
	    	 }
	    	 if(supervisorList!=null){
	    		 var superVisorInfo={
	    				 "result":supervisorList
	    		 }
	    		 myAjax.getTpl("supervisorListSelect", "supervisorListTpl", superVisorInfo, false, function(){
	    			 openSelectSupervisorHtml(storeId,channelType,memberId);
	    		 })
	    	 }else{
	    		 myAjax.ajaxTpl("/admin/common/supervisor/list.json", 'supervisorListSelect', 'supervisorListTpl',false,function(dataJson){
	    			 supervisorList=dataJson;
	    			 openSelectSupervisorHtml(storeId,channelType,memberId);
	    		 });
	    	 }
	     }
	     openSelectSupervisorHtml=function(storeId,channelType,memberId){
	    	 layer.open({
                 title: "添加督导"
                 , type: 1
                 , content: $("#supervisorListHtml")            //弹窗内容
                 , area: ["400px", "300px"]         //设置窗体高度 和宽度
                 , btn: ["确定", "取消"]
                 , closeBtn: 0                      //取消右上角关闭按钮
                 , btnAlign: 'r'
                 , success: function (layero, index) {
                     layero.addClass('layui-form');
                     layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '');
                     form.render();
                 }
                 , yes: function (index, item) {
                	 bindingSupervisorInfo(storeId,index,channelType,memberId);
                 }
             });
	     }
	     
	     bindingSupervisorInfo=function(storeId,index,channelType,memberId){
	    	 var supervisorId=$("#supervisorListSelect").val();
	    	 if(supervisorId!=null&&supervisorId<0){
	    		 supervisorId=null;
	    	 }
	    	 if(supervisorId==null){
	    		 return layer.msg("请选择督导信息");
	    	 }else{
	    		 myAjax.ajaxSend("/admin/supervisor/bindingSupervisorInfo.json",function(dataJson){
	    			 if(dataJson!=null&&dataJson.result==true){
						 searchOrders();
	    				 layer.close(index);
	    				 return layer.msg("绑定成功");
	    			 }else{
	    				 return layer.msg("绑定失败");
	    			 }
            	 },{"storeId":storeId,"supervisorId":supervisorId,"channelType":channelType,"memberId":memberId})
	    	 }
	     }
	     
	     changeStoreType=function(storeType){
	    	 if(storeType==null){
	    		 return "";
	    	 }else{
	    		 if(storeTypeMap!=null){
	    			 return storeTypeMap.get(storeType);
	    		 }else{
	    			 myAjax.ajaxSend("/admin/supervisor/listStoreType.json",function(dataJson){
	    				 if(storeTypeMap==null){
	    					 storeTypeMap=new Map();
	    				 }
	    				 $.each(dataJson.result,function(k,p){
	    					 storeTypeMap.push(p.code,p.name);
	    				 })
	    				 return storeTypeMap.get(storeType);
	    			 });
	    		 }
	    	 }
	    	 
	     }
		removeSupervisor=function(storeId){
			myAjax.ajaxSend("/admin/supervisor/removeStore.json",function(dataJson){
				if(dataJson!=null&&dataJson.result==true){
					searchOrders();
					return layer.msg("解除成功");
				}else{
					return layer.msg("解除失败");
				}
			},{"storeId":storeId})
		}
		addStoreCode = function (storeId, storeCode) {
			if (storeId == null) {
				return layer.msg("门店id为空");
			}

			$("#add_store_code_id").val(storeCode);

			layer.open({
				title: "添加车空间加盟编号"
				, type: 1
				, content: $("#addStoreCodeHtml")            //弹窗内容
				, area: ["400px", "300px"]         //设置窗体高度 和宽度
				, btn: ["确定", "取消"]
				, closeBtn: 0                      //取消右上角关闭按钮
				, btnAlign: 'r'
				, success: function (layero, index) {
					layero.addClass('layui-form');
					layero.find('.layui-layer-btn0').attr('lay-filter', 'fromContent').attr('lay-submit', '');
					form.render();
				}
				, yes: function (index, item) {
					var storeCode = $("#add_store_code_id").val();
					if ($.trim(storeCode) == "") {
						storeCode = null;
					}
					if (storeCode == null) {
						return layer.msg("请填写车空间加盟编号");
					} else {
						myAjax.ajaxSend("/admin/supervisor/addStoreCode.json", function (dataJson) {
							if (dataJson != null && dataJson.result == true) {
								searchOrders();
								layer.close(index);
								return layer.msg("添加成功");
							} else {
								return layer.msg("添加失败");
							}
						}, {"storeId": storeId, "storeCode": storeCode})
					}
				}
			});
		}
		searchCoupon=function (memberId,pageNo) {
			var isOpen=false;
			if (!Utils.isNotNull(pageNo)) {
				isOpen=true;
				pageNo = 1;
			}
			currPageNo = pageNo;
			var pageSize = 30;
			var option = {pageNo: pageNo, pageSize: pageSize};
			if (Utils.isBlank(memberId)) {
				layer.alert("该门店没有优惠券信息");
				return;
			} else {
				option.memberId = memberId;
				ajaxsend(option, "/admin/supervisor/coupon/list.json", function (dataJson) {
					if(Utils.isNotNull(dataJson.result)&&Utils.isNotNull(dataJson.result.result)){
						for(var i=0;i<dataJson.result.result.length;i++){
							var couponObj=dataJson.result.result[i]
							couponObj.grantDateFormat=Utils.formatTime(Utils.createTimeByLong(couponObj.grantDate),"YYYY-MM-DD HH:MS:SS");
							couponObj.effectiveEndDateFormat=Utils.formatTime(Utils.createTimeByLong(couponObj.effectiveEndDate),"YYYY-MM-DD HH:MS:SS");
						}

					}

					var jsRenderTpl = $.templates('#j-coupon-list-tr'),
					/*绑定数据*/
						finalTpl = jsRenderTpl(dataJson.result);

					$("#coupon_list").html(finalTpl);
					if(isOpen){
						layer.open({
							title: "优惠券列表",
							type: 1
							, content: $("#coupon_list")
							, btn: ["确定"]
							, area: ["600px", "390px"]
							, closeBtn: 0
							, btnAlign: 'r',
							success: function () {
								form.render();
							}
							, yes: function (index, item) {
								layer.close(index);
								$("#coupon_list").html("");
							}
						})}
					laypage({
						cont: "coupon_page",
						curr: dataJson.result.pageNo
						, pages: dataJson.result.totalPage
						, skip: true
						, jump: function (jumpObj, first) {
							if (!first) {
								searchCoupon(memberId,jumpObj.curr);
							}
						}
					})
				})
			}
		}

	 })
	});

