function printJs() {
    document.write('<script language="javascript" src="../../js/print/print.js"></script>');
}
printJs();

//打印
var LODOP; //声明为全局变量
//拣货单
function print(varHtml, varSn) {
    LODOP = getLodop();
    LODOP.ADD_PRINT_BARCODE(55, 600, 160, 47, '128A', varSn);
    LODOP.SET_PRINT_PAGESIZE(1, "240mm", "140mm", "");
    LODOP.ADD_PRINT_HTM(5, 20, "100%", "100%", "<!DOCTYPE html>" + varHtml);
    LODOP.PREVIEW();
}

function printQuDao(varHtml) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINT_PAGESIZE(1, "230mm", "140mm", "");
    LODOP.ADD_PRINT_HTM(5, 20, "90%", '100%', "<!DOCTYPE html>" + varHtml);
    LODOP.PREVIEW();
}

//格式化日期
function FormatDate(strTime) {
    var date = new Date(strTime);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}
/*设置cookie*/
function setCookie(name, value, days){
	if(days == null || days == ''){
		days = 300;
	}
	var exp  = new Date();
	exp.setTime(exp.getTime() + days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();
}

/*获取cookie*/
function getCookie(name) {
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
		return unescape(arr[2]); 
	else 
		return null; 
}
/*通过打印任务id获取对应的打印机序号*/
function GetPrinterIDfromJOBID(strJOBID){
	var intPos=strJOBID.indexOf("_");
	if (intPos<0) {return strJOBID;} else {return strJOBID.substr(0,intPos);}
}

function lodopPrint(name){
	var checkPrint=$("#checkPrint").is(":checked");
	var printConfig=JSON.parse(getCookie("printConfig"));
	if(!printConfig || !printConfig[name] || checkPrint){
		LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
    	if (LODOP.CVERSION) {
			LODOP.On_Return=function(TaskID,Value){
				if(!this.printConfig){
					this.printConfig={};
				}
				this.printConfig[name]=GetPrinterIDfromJOBID(Value);
				if(this.printConfig[name].length > 0){
					setCookie("printConfig",JSON.stringify(this.printConfig),30);
				}
			};
			LODOP.PREVIEW();
			return;
		}else{
			LODOP.PREVIEW()
		}
	}else{
		if (LODOP.SET_PRINTER_INDEX(printConfig[name])) 
			LODOP.PRINT();	
	}
}

//快递单批量
function createPrintBat(resList) {
    if (resList != undefined && resList.length != 0) {
        var code = resList[0];
        if (code.deliveryCorpCode == 'BirdEX') {
            createBenNiaoBat(resList);
        } else if (code.deliveryCorpCode == 'YTO' && !code.e) {
            createYuanTongBat(resList);
        } else if (code.deliveryCorpCode == 'HTKY' && !code.e) {
        	createBaiShiBat(resList);
    	} else if (code.deliveryCorpCode == 'EMS' && !code.e) {
        	createCommonEMSBat(resList);
    	} else if (code.deliveryCorpCode == 'STO') {
            createShenTongBat(resList);
        } else if (code.deliveryCorpCode == 'SF') {
            createShunFengBat(resList);
        } else if (code.deliveryCorpCode == 'Deppon') {
            createDeBangBat(resList);
        } else if (code.deliveryCorpCode == 'Ztky') {
            createZhongTieBat(resList);
        } else if (code.deliveryCorpCode == 'YTO' && code.e) {
            createYTOBat(resList);
        } else if (code.deliveryCorpCode == 'HTKY' && code.e) {
            createHTKYBat(resList);
        } else if (code.deliveryCorpCode == 'EMS' && code.e) {
            createEMSBat(resList);
        } else {
            if (code.deliveryCorpCode == null) {
            	layer.msg('没有物流信息');
            } else {
            	layer.msg('暂不支持' + code.deliveryCorpCode+(code.e?"电子面单":"普通面单"));
            }
        }
    }
}

//单一快递单
function createPrint(res) {
    if (res.deliveryCorpCode == 'BirdEX') {
        createBenNiao(res);
    } else if (res.deliveryCorpCode == 'YTO' && !res.e) {
        createYuanTong(res);
    } else if (res.deliveryCorpCode == 'HTKY' && !res.e) {
    	createBaiShi(res);
	} else if (res.deliveryCorpCode == 'EMS' && !res.e) {
		createCommonEMS(res);
	} else if (res.deliveryCorpCode == 'STO') {
        createShenTong(res);
    } else if (res.deliveryCorpCode == 'SF') {
        createShunFeng(res);
    } else if (res.deliveryCorpCode == 'Deppon') {
        createDeBang(res);
    } else if (res.deliveryCorpCode == 'Ztky') {
        createZhongTie(res);
    } else if (res.deliveryCorpCode == 'YTO' && res.e) {
        createYTO(res);
    } else if (res.deliveryCorpCode == 'HTKY' && res.e) {
        createHTKY(res);
    } else if (res.deliveryCorpCode == 'EMS' && res.e) {
        createEMS(res);
    } else {
        if (res.deliveryCorpCode == null) {
        	layer.msg('没有物流信息');
        } else {
        	layer.msg('暂不支持' + res.deliveryCorpCode+(res.e?"电子面单":"普通面单"));
        }
    }
}

//笨鸟快递单
function benNiao(res) {
    // 寄件人信息
    LODOP.ADD_PRINT_TEXT(122, 64, 290, 20, "杭州中策车空间汽车服务有限公司"); //公司名称
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(153, 78, 312, 20, ""); //寄件地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(218, 174, 176, 20, "0571-85095657");           //寄件电话
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(121, 298, 74, 20, "");                   //寄件联系人
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    // 收件人信息
    LODOP.ADD_PRINT_TEXT(119, 446, 245, 20, "");                //收货公司名称
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(122, 675, 79, 20, res.receiverName);                  //收件联系人
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(150, 436, 306, 40, res.receiverAddress);                   //收件地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(218, 550, 156, 20, res.receiverMobile);                  //收件电话
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    //打印时间
    LODOP.ADD_PRINT_TEXT(458, 61, 181, 20, FormatDate(new Date()));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(316, 265, 80, 20, res.weight);//重量
}
function createBenNiaoBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.SET_PRINT_PAGESIZE(1, 2230, 1400, "");
        LODOP.NewPage();
        benNiao(res);
    }
    LODOP.PREVIEW();
}
function createBenNiao(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINT_PAGESIZE(1, 2230, 1400, "");
    benNiao(res);
    LODOP.PREVIEW();
}


//申通快递单
function shenTong(res) {
    /*发货方*/
    LODOP.ADD_PRINT_TEXT("3.25438cm", "3.125cm", "3.075cm", "0.661458cm", "");//发件人姓名
    LODOP.ADD_PRINT_TEXT("6.11188cm", "3.75cm", "3.28083cm", "0.6cm", "");//发件人手机
    LODOP.ADD_PRINT_TEXT("6.11188cm", "7.1cm", "3.625cm", "0.625cm", "0571-85095657");//发件人座机
    LODOP.ADD_PRINT_TEXT("4.60375cm", "2.9cm", "7.85813cm", "1.40229cm", "");//发件人详细地址
    LODOP.ADD_PRINT_TEXT("3.91583cm", "3.20146cm", "7.01146cm", "0.582083cm", "杭州中策车空间汽车服务有限公司");//发货公司
    LODOP.ADD_PRINT_TEXT("3.25438cm", "7.59354cm", "2.80458cm", "0.661458cm", "");//始发站

    /*收货方*/
    LODOP.ADD_PRINT_TEXT("3.25438cm", "12.95cm", "2.98979cm", "0.687917cm", res.receiverName);//收件人姓名
    LODOP.ADD_PRINT_TEXT("6.11188cm", "13.4cm", "3.625cm", "0.675cm", res.receiverMobile);//收件人手机
    LODOP.ADD_PRINT_TEXT("6.11188cm", "17.1cm", "3.275cm", "0.7cm", "");//收件人座机
    LODOP.ADD_PRINT_TEXT("4.70958cm", "12.625cm", "7.85cm", "1.40229cm", res.receiverAddress);//收件人详细地址
    LODOP.ADD_PRINT_TEXT("3.94229cm", "13.2027cm", "7.19667cm", "0.582083cm", "");//收件人公司
    LODOP.ADD_PRINT_TEXT("3.25438cm", "17.4096cm", "2.98979cm", "0.687917cm", "");//目的站

    /*物品详情*/
    LODOP.ADD_PRINT_TEXT("7.48771cm", "1.79917cm", "9.15cm", "2.77813cm", "");//订单物品

    /*时间*/
    /*LODOP.ADD_PRINT_TEXT("11.404cm","1.191cm","3.81cm","0.5cm","时间");*/
}
function createShenTongBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.NewPage();
        //LODOP.ADD_PRINT_TEXT(top left width height)
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
        shenTong(res);
    }
    LODOP.PREVIEW();
}
function createShenTong(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    //LODOP.ADD_PRINT_TEXT(top left width height)
    LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
    shenTong(res);
    LODOP.PREVIEW();
}


//顺丰快递单
function shunFeng(res) {
    LODOP.ADD_PRINT_TEXT("2.805cm", "8.202cm", "2.593cm", "0.609cm", "");//发件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("4.419cm", "2.196cm", "3.016cm", "0.5cm", "");//发件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("4.419cm", "5.212cm", "4.18cm", "0.5cm", "0571-85095657");//发件人座机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("3.413cm", "2.196cm", "8.599cm", "0.979cm", "");//发件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("2.805cm", "3.201cm", "7.668cm", "0.609cm", "杭州中策车空间汽车服务有限公司");//发件人公司
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.027cm", "8.202cm", "2.593cm", "0.5cm", res.receiverName);//收件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("7.223cm", "2.593cm", "3.995cm", "0.5cm", res.receiverMobile);//收件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    LODOP.ADD_PRINT_TEXT("7.223cm", "6.8cm", "3.995cm", "0.5cm", "");//收件人座机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.609cm", "2.408cm", "8.387cm", "1.402cm", res.receiverAddress);//收件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.027cm", "3.201cm", "4.207cm", "0.5cm", "");//收件人公司
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("8.305cm", "1.799cm", "8.811cm", "2.408cm", "");//订单物品
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("10.821cm", "2.593cm", "3.413cm", "0.5cm", "");//收件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("1.402cm", "15.796cm", "3.016cm", "1.191cm", "");//目的站
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("11.404cm", "2.593cm", "3.81cm", "0.5cm", FormatDate(new Date()));//时间
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
}
function createShunFengBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.NewPage();
        //LODOP.ADD_PRINT_TEXT(top left width height)
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
        shunFeng(res);
    }
    LODOP.PREVIEW();
}
function createShunFeng(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    //LODOP.ADD_PRINT_TEXT(top left width height)
    LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
    shunFeng(res);
    LODOP.PREVIEW();
}


//德邦快递单
function deBang(res) {
    /*LODOP.ADD_PRINT_TEXT("2.70146cm","6.69667cm","2.80458cm","0.5cm","");//发件人姓名
     LODOP.SET_PRINT_STYLEA(0,"FontSize",12);*/
    LODOP.ADD_PRINT_TEXT("4.19cm", "3.20146cm", "4.80458cm", "0.5cm", "0571-85095657");//发件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("4.89208cm", "2.98979cm", "7.01146cm", "1.40229cm", "");//发件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("2.70146cm", "2.70146cm", "9cm", "0.5cm", "杭州中策车空间汽车服务有限公司");//发件人公司
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    LODOP.ADD_PRINT_TEXT("5.90292cm", "6.69667cm", "2.80458cm", "0.5cm", res.receiverName);//收件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("6.81146cm", "3.20146cm", "2.80458cm", "0.5cm", res.receiverMobile);//收件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    LODOP.ADD_PRINT_TEXT("7.59354cm", "2.98979cm", "7.01146cm", "1.40229cm", res.receiverAddress);//收件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    /*LODOP.ADD_PRINT_TEXT("5.90292cm","2.90146cm","2.80458cm","0.5cm","");//收件人公司
     LODOP.SET_PRINT_STYLEA(0,"FontSize",12);*/
    LODOP.ADD_PRINT_TEXT("9.39271cm", "1.5875cm", "8.41375cm", "2.40771cm", "");//订单物品

    LODOP.ADD_PRINT_TEXT("7.59042cm", "16.5894cm", "2.51354cm", "0.5cm", "");//发件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    LODOP.ADD_PRINT_TEXT("8.59896cm", "16.5894cm", "3.59833cm", "0.5cm", FormatDate(new Date()));//时间
}
function createDeBangBat(resList) {
    var LODOP = getLodop();
    LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.NewPage();
        //LODOP.ADD_PRINT_TEXT(top left width height)
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
        deBang(res);
    }
    LODOP.PREVIEW();
}
function createDeBang(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    //LODOP.ADD_PRINT_TEXT(top left width height)
    LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
    deBang(res);
    LODOP.PREVIEW();
}


//圆通快递单
function yuanTong(res) {
    LODOP.ADD_PRINT_TEXT(106, 131, 290, 20, "杭州中策车空间汽车服务有限公司");//发货公司
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(92, 497, 100, 20, res.receiverName);//收件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(162, 99, 330, 40, "");//发货地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(366, 240, 112, 20, FormatDate(new Date()));//日期
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(200, 188, 136, 20, "0571-85095657");//发货电话
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(112, 485, 106, 20, "");//单位名称编码
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(201, 530, 132, 20, res.receiverMobile);//收货电话
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT(272, 97, 100, 20, "");//货物名称
    LODOP.ADD_PRINT_TEXT(158, 454, 287, 40, res.receiverAddress);//收件地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(258, 269, 56, 20, res.weight);//货物重量
}

function baiShi(res) {
    LODOP.ADD_PRINT_TEXT("2.40771cm", "12.991cm", "2.51354cm", "0.525cm", res.receiverName);//收件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("4.39208cm", "11.4035cm", "8.99583cm", "1.40229cm", res.receiverAddress);//收件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("2.40771cm", "3.59833cm", "7.51354cm", "0.5cm", "杭州中策车空间汽车服务有限公司");//发件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("4.39208cm", "1.79917cm", "9.2075cm", "1.40229cm", "");//发件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("6.79979cm", "1.79917cm", "9.2075cm", "2.19604cm", "");//订单物品
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("6.00604cm", "3.41313cm", "3.175cm", "0.525cm", "0571-85095657");//发件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("6.00604cm", "12.8058cm", "3.20146cm", "0.575cm", res.receiverMobile);//收件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("2.40771cm", "17.4096cm", "2.51354cm", "0.5cm", "");//目的站
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("10.3981cm", "2.19604cm", "2.51354cm", "0.525cm", FormatDate(new Date()));//时间
}

function ems(res) {
    LODOP.ADD_PRINT_TEXT("5.60917cm","2.875cm","2.625cm","0.525cm",res.receiverName); //收件人姓名
    LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
    LODOP.ADD_PRINT_TEXT("6.40292cm","2.875cm","8.625cm","0.5cm",res.receiverAddress);//收件人详细地址
    LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
    LODOP.ADD_PRINT_TEXT("2.475cm","2.875cm","3.525cm","0.5cm","杭州中策车空间汽车服务有限公司");//发件人姓名
    LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
    LODOP.ADD_PRINT_TEXT("3.20146cm","3.2cm","8.59896cm","1.875cm","");//发件人详细地址
    LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
    LODOP.ADD_PRINT_TEXT("9.2075cm","1.79917cm","10cm","1.4cm","");//订单物品

    LODOP.ADD_PRINT_TEXT("2.45cm","7.3cm","3.1cm","0.525cm","0571-85095657");//发件人手机
    LODOP.SET_PRINT_STYLEA(0,"FontSize",12);

    LODOP.ADD_PRINT_TEXT("5.60917cm","6.95cm","4.28625cm","0.575cm",res.receiverMobile);//收件人手机
    LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
    LODOP.ADD_PRINT_TEXT("8.38729cm","3.275cm","2.5cm","0.5cm","");//收件人城市


    LODOP.ADD_PRINT_TEXT("5.225cm","17.875cm","2.5cm","0.5cm","");
    LODOP.ADD_PRINT_TEXT("3.81cm","13.8113cm","2.51354cm","0.5cm","");


    LODOP.ADD_PRINT_TEXT("5.925cm","17.075cm","3.81cm","0.525cm",FormatDate(new Date()));
}

function createYuanTongBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.SET_PRINT_PAGESIZE(1, 2230, 1270, "");
        LODOP.NewPage();
        yuanTong(res);
    }
    lodopPrint("yto");
}

function createYuanTong(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINT_PAGESIZE(1, 2230, 1270, "");
    yuanTong(res);
    lodopPrint("yto");
}

function createBaiShiBat(resList) {
	LODOP = getLodop();
	LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
        LODOP.NewPage();
        baiShi(res);
    }
    lodopPrint("htky");
}

function createCommonEMSBat(resList) {
	LODOP = getLodop();
	LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
        LODOP.NewPage();
        ems(res);
    }
    lodopPrint("ems");
}

function createBaiShi(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
    baiShi(res);
    lodopPrint("htky");
}

function createCommonEMS(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
    ems(res)
    lodopPrint("ems");
}

function createYTOBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    var preview=false;
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        if(res.success){
        	preview=true;
            LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', ""); //设置纸张大小
            LODOP.NewPage();
            LODOP.ADD_PRINT_HTM(0, 10, 380, 750, YTO_Html(res));
            LODOP.ADD_PRINT_BARCODE(112, 170, '54mm', '8mm', "128A", res.packageCode); //"123456" 传递条码内容
            LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
            LODOP.ADD_PRINT_BARCODE("73mm", "9mm", "94.01mm", "15mm", "128A", res.logisticCode); //"123456" 传递条码内容
            LODOP.ADD_PRINT_BARCODE("111mm", "30mm", "81.23mm", "12mm", "128A", res.logisticCode); //"123456" 传递条码内容

            //二维码
            LODOP.ADD_PRINT_BARCODE("90mm","75mm","18mm","18mm","QRCode",res.shortAddress+"-"+res.logisticCode);
            LODOP.ADD_PRINT_BARCODE("130mm","75mm","18mm","18mm","QRCode","http://weixin.qq.com/r/yUS3r0jENBVLrQzM9xHb");
        }else{
            alert("订单:"+res.orderCode+res.reason);
        }
    }
    if(preview){
    	lodopPrint("yto_e");
    }
}

function createHTKYBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    var preview=false;
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        if(res.success){
        	preview=true;
            LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', ""); //设置纸张大小
            LODOP.NewPage();
            LODOP.ADD_PRINT_HTM(0, 3, 380, 750, HTKY_Html(res));
            LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
            LODOP.ADD_PRINT_BARCODE("72mm", "24.5mm", "65mm", "18mm", "128C", res.logisticCode);
            LODOP.ADD_PRINT_BARCODE("93mm","82mm","20mm","20mm","QRCode",res.logisticCode);
            LODOP.ADD_PRINT_BARCODE("112mm", "55mm", "42mm", "12mm", "128C", res.logisticCode);
            LODOP.ADD_PRINT_BARCODE("130mm","80mm","21mm","21mm","QRCode","http://weixin.qq.com/r/yUS3r0jENBVLrQzM9xHb");//商户二维码:中策橡胶微信号http://weixin.qq.com/q/02HdSQZeWJbk-1905CNp97
        }else{
            alert("订单:"+res.orderCode+res.reason);
        }
    }
    if(preview){
    	lodopPrint("htky_e");
    }
}

function createEMSBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    var preview=false;
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        if(res.success){
        	preview=true;
            LODOP.SET_PRINT_PAGESIZE(1, '100mm', '150mm', ""); //设置纸张大小
            LODOP.NewPage();
            LODOP.ADD_PRINT_HTM(10, 3, "100mm","150mm", EMS_Html(res));
            LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
            LODOP.ADD_PRINT_BARCODE("5mm", "50mm", "56mm", "15mm", "128A", res.logisticCode);
            LODOP.ADD_PRINT_BARCODE("95mm","3mm","53mm","12mm","128A",res.logisticCode);
            LODOP.ADD_PRINT_BARCODE("127mm","78mm","27mm","24mm","QRCode","http://weixin.qq.com/r/yUS3r0jENBVLrQzM9xHb");//商户二维码:中策橡胶微信号http://weixin.qq.com/q/02HdSQZeWJbk-1905CNp97
        }else{
            alert("订单:"+res.orderCode+res.reason);
        }
    }
    if(preview){
    	lodopPrint("ems_e");
    }
}

function createYTO(res) {
    if(res.success){
        LODOP = getLodop();
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', ""); //设置纸张大小
        LODOP.NewPage();
        LODOP.ADD_PRINT_HTM(0, 10, 380, 750, YTO_Html(res));
        LODOP.ADD_PRINT_BARCODE(112, 170, '54mm', '8mm', "128A", res.packageCode); //"123456" 传递条码内容
        LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
        LODOP.ADD_PRINT_BARCODE("73mm", "9mm", "94.01mm", "15mm", "128A", res.logisticCode); //"123456" 传递条码内容
        LODOP.ADD_PRINT_BARCODE("111mm", "30mm", "81.23mm", "12mm", "128A", res.logisticCode); //"123456" 传递条码内容

        //二维码
        LODOP.ADD_PRINT_BARCODE("90mm","75mm","18mm","18mm","QRCode",res.shortAddress+"-"+res.logisticCode);
        LODOP.SET_PRINT_STYLEA(0,"QRCodeVersion",3);
        LODOP.ADD_PRINT_BARCODE("130mm","75mm","18mm","18mm","QRCode","http://weixin.qq.com/r/yUS3r0jENBVLrQzM9xHb");
        lodopPrint("yto_e");
    }else{
        alert("订单:"+res.orderCode+res.reason);
    }
}

function createEMS(res) {
    if(res.success){
        LODOP = getLodop();
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_PAGESIZE(1, '100mm', '150mm', ""); //设置纸张大小
        LODOP.NewPage();
        LODOP.ADD_PRINT_HTM(10, 3, "100mm","150mm", EMS_Html(res));
        LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
        LODOP.ADD_PRINT_BARCODE("5mm", "50mm", "56mm", "15mm", "128A", res.logisticCode);
        LODOP.ADD_PRINT_BARCODE("95mm","3mm","53mm","12mm","128A",res.logisticCode);
        LODOP.ADD_PRINT_BARCODE("127mm","78mm","27mm","24mm","QRCode","http://weixin.qq.com/r/yUS3r0jENBVLrQzM9xHb");//商户二维码:中策橡胶微信号http://weixin.qq.com/q/02HdSQZeWJbk-1905CNp97
        lodopPrint("ems_e");
    }else{
        alert("订单:"+res.orderCode+res.reason);
    }
}

function createHTKY(res) {
    if(res.success){
        LODOP = getLodop();
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', ""); //设置纸张大小
        LODOP.NewPage();
        LODOP.ADD_PRINT_HTM(0, 3, 380, 750, HTKY_Html(res));
        LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
        LODOP.ADD_PRINT_BARCODE("72mm", "24.5mm", "65mm", "18mm", "128C", res.logisticCode);
        LODOP.ADD_PRINT_BARCODE("93mm","82mm","20mm","20mm","QRCode",res.logisticCode);
        LODOP.ADD_PRINT_BARCODE("112mm", "55mm", "42mm", "12mm", "128C", res.logisticCode);
        LODOP.ADD_PRINT_BARCODE("130mm","80mm","21mm","21mm","QRCode","http://weixin.qq.com/r/yUS3r0jENBVLrQzM9xHb");//商户二维码:中策橡胶微信号http://weixin.qq.com/q/02HdSQZeWJbk-1905CNp97
        lodopPrint("htky_e");
    }else{
        alert("订单:"+res.orderCode+res.reason);
    }
}
//ems的模版页面
function EMS_Html(res){
    var html =[];
    html.push('<!DOCTYPE html><html lang="zh-CN"><head><title>EMS电子面单模板</title><meta charset="utf-8" /><style>*{margin:0;padding:0;font-family:"simsun"}.print_paper{font-size:14px;border:0;border-collapse:collapse;width:375px;margin-top:-1px;table-layout:fixed}.print_paper td{border:dashed #000 1px;padding:0 5px;overflow:hidden}.table_first{margin-top:0}.print_paper .x1{font-size:20px;font-weight:bold;text-align:center;letter-spacing:5px;line-height:.95;font-family:"Microsoft YaHei"}.print_paper .x4{font-size:20px;font-weight:bold;font-family:"Microsoft YaHei"}.print_paper .xx8{font-size:8px;line-height:.8}.print_paper .xx10{font-size:10px}.print_paper .xx12{font-size:12px;font-weight:bold}.print_paper .xx14{font-size:14px;font-weight:bold;font-family:"SimHei"}.print_paper .xx16{font-size:16px;font-weight:bold;font-family:"Microsoft YaHei"}.print_paper .xx48{font-size:40px;font-weight:bold;text-align:center;font-family:"Microsoft YaHei"}.no_border{width:100%;height:100%;font-size:14px}.no_border td{border:0;vertical-align:top}.fwb{font-weight:bold}</style></head><body>');
    
    html.push('<table class="print_paper table_first">');
    html.push('<tr height="75">');
    html.push('<td width="130">');
    html.push('<table class="no_border">');
    html.push('<tr><td></td></tr>');
    html.push('<tr><td class="x4" align="center" style="padding-top:30px;">标准快递</td></tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('<td rowspan="2" align="center">');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper">');
    html.push('<tr height="56">');
    html.push('<td width="173">寄方: 杭州中策车空间汽车服务有限公司 <br/>0571-85095657</td>');
    html.push('<td class="x1">'+res.sortingCode+'</td>');
    html.push('</tr>');
    html.push('</table>');

    html.push('<table class="print_paper">');
    html.push('<tr height="64">');
    html.push('<td colspan="2">收方: '+res.receiverName+' '+res.receiverMobile+'<br/>'+res.receiverAddress+'</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper">');
    html.push('<tr height="53">');
    html.push('<td width="151">付款方式：<br/>计费重量(KG)：<br/>保价金额(元)：<div style="display: none">代收金额：￥</div> </td>');
    html.push('<td>收件人\代收人：<br/>签收时间：&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日&nbsp;&nbsp;时</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper">');
    html.push('<tr height="75" align="top">');
    html.push('<td colspan="2">');
    html.push('<table class="no_border">');
    html.push('<tr><td nowrap>订单编号：'+res.orderCode+'</td><td>件数：'+res.number+'&nbsp;重量(KG)：</td></tr>');
    html.push('</table>');
    html.push('<table class="no_border">');
    html.push('<tr height="50">');
    html.push('<td width="70">配货信息：</td>');
    html.push('<td>无</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('</tr>');
    html.push('<tr height="15">');
    html.push('<td colspan="2"></td>');
    html.push('</tr>');
    html.push('<tr height="56">');
    html.push('<td colspan="2">');
    html.push('<table class="no_border">');
    html.push('<tr>');
    html.push('<td align="center"><img width="190" height="28"></img></td>');
    html.push('<td style="vertical-align:middle;">');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper">');
    html.push('<tr height="64">');
    html.push('<td width="151" align="top">寄方: 杭州中策车空间汽车服务有限公司 <br/> 0571-85095657</td>');
    html.push('<td align="top">');
    html.push('收方: '+res.receiverName+' '+res.receiverMobile+'<br/>'+res.receiverAddress);
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper">');
    html.push('<tr height="64">');
    html.push('<td width="257">备注：收货前请确认包装是否完好，有无破损。如有问题，请拒绝签收</td>');
    html.push('<td rowspan="2" align="center">');
    //html.push('<img class="logo" height="80" src="data:image/png;base64,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" alt=""/>');
    html.push('</td>');
    html.push('</tr>');
    html.push('<tr height="26">');
    html.push('<td width="120">网址：www.ems.com.cn&nbsp;客服电话：11183</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('</body>');
    html.push('</html>');
    return html.join("");
}

//百世的模版页面
function HTKY_Html(res){
    var html =[];
    html.push('<!DOCTYPE html><html lang="zh-CN"><head><style>*{margin:0;padding:0}.print_paper{font-size:14px;font-family:"微软雅黑";border:0;border-collapse:collapse;width:375px;margin-top:-1px;table-layout:fixed}.print_paper td{border:solid #000 1px;padding:0 5px;overflow:hidden}.table_first{margin-top:0}.print_paper .x1{font-size:32px;font-weight:bold;text-align:center;letter-spacing:5px;line-height:.95}.print_paper .x4{font-size:20px;font-weight:bold}.print_paper .xx8{font-size:8px;line-height:.8}.print_paper .xx10{font-size:10px}.print_paper .xx12{font-size:12px;font-weight:bold}.print_paper .xx14{font-size:14px;font-weight:bold}.print_paper .xx16{font-size:16px;font-weight:bold;font-family:"微软雅黑"}.print_paper .xx48{font-size:40px;font-weight:bold;text-align:center}.no_border{width:100%;height:100%;font-size:14px}.no_border td{border:0;vertical-align:top}.fwb{font-weight:bold}.print_paper .h14{font-family:"黑体";font-size:14px}.print_paper .h10{font-family:"黑体";font-size:10px}.print_paper .h8{font-family:"黑体";font-size:8px}.print_paper .h26{font-family:"黑体";font-size:26px}.print_paper .h{font-family:"黑体"}.print_paper .h24{font-family:"黑体";font-size:24px}.print_paper .h22{font-family:"黑体";font-size:22px}.print_paper .h20{font-family:"黑体";font-size:20px}.print_paper .s10 td{font-family:"宋体";font-size:10pt;padding:0;-webkit-transform-origin-x:0;-webkit-transform:scale(0.83)}.print_paper .s9 td{font-family:"宋体";font-size:9pt;padding:0;-webkit-transform-origin-x:0;-webkit-transform:scale(0.75)}.print_paper .s8{font-family:"宋体";font-size:8px;-webkit-transform-origin-x:0;-webkit-transform:scale(0.67)}.print_paper .textcenter{text-align:center}.print_paper .no_border_left{border-left:none}.print_paper .no_border_top{border-top:0}.print_paper .no_border_bottom{border-bottom:0}.print_paper .no_border_right{border-right:0}.print_paper .bold{font-weight:bold}.print_paper .nopadding td{padding:0;font-size:12px}.print_paper .f12 td{font-size:12px}.print_paper .f10 td{font-size:10px}.print_paper .boldtd td{font-weight:bold}.print_paper .padding0{padding:0}</style></head><body>');
    
    html.push('<table class="print_paper table_first">');
    html.push('<tr height="37">');
    html.push('<td colspan="2" class="no_border_right">');
    html.push('</td>');
    html.push('<td class="textcenter no_border_left" width="90px"><div style="font-weight:bold;letter-spacing:3px" class="h14 bold">标准快件</div><div class="h8">精彩生活·快递欢乐</div></td>');
    html.push('</tr>');
    html.push('<tr height="56">');
    html.push('<td colspan="2" class="h26 no_border_right bold">'+res.shortAddress+'</td>');
    html.push('<td class="no_border_left"><div style="float:right;margin-right:10px;white-space:nowrap;" class="h26">'+res.sortingCode+'</div></td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper" height="38">');
    html.push('<tr>');
    html.push('<td class="h22 bold">'+res.packageCode+'</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper" height="120" style="margin-top:-2px">');
    html.push('<tr>');
    html.push('<td width="18" style="text-align:center; padding:0;height:75px">收<br />件</td>');
    html.push('<td class="xx12" style="padding:0">');
    html.push('<table style="height:75px" class="no_border s10">');
    html.push('<tr><td style="width:45px;"></td><td style="padding-top:3px;">'+res.receiverName+'</td></tr>');
    html.push('<tr><td>电话：</td><td>'+res.receiverMobile+'</td></tr>');
    html.push('<tr><td> 地址：</td><td>'+res.receiverAddress+'</td></tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('<td width="90" rowspan="2" class="xx12" style="vertical-align:top; padding:0;">');
    html.push('<div style="border-bottom:1px solid #000; text-align:center; ">服&nbsp;&nbsp;&nbsp;&nbsp;务</div>');
    html.push('</td>');
    html.push('</tr>');
    html.push('<tr>');
    html.push('<td style="text-align:center; padding:0;">寄<br />件</td>');
    html.push('<td class="xx10 padding0">');
    html.push('<table style="height:45px" class="no_border s9">');
    html.push('<tr><td>杭州中策车空间汽车服务有限公司</td></tr>');
    html.push('<tr><td>电话：0571-85095657</td></tr>');
    html.push('<tr><td>地址：浙江省杭州市江干区下沙12号大街八方物流</td></tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper" height="83">');
    html.push('<tr>');
    html.push('<td class="xx14" style="text-align:center; font-size:16px;letter-spacing:5px;">');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper" height="76">');
    html.push('<tr>');
    html.push('<td style="font-size:8pt;">您对此单的签收，代表您已验收，确认商品信息无误，包装完好，没有划痕、破损等表面质量问题</td>');
    html.push('<td>签收人：<br /><br />时间：</td>');
    html.push('<td width="61">&nbsp;</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper" height="56">');
    html.push('<tr>');
    html.push('<td width="180" class="no_border_right">');
    html.push('</td>');
    html.push('<td class="no_border_left" style="text-align:center;">');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('<table class="print_paper">');
    html.push('<tr height="56">');
    html.push('<td width="18" class="xx14" style="text-align:center; padding:0;font-weight:normal">收<br />件</td>');
    html.push('<td style="padding:0">');
    html.push('<table style="height:56px" class="no_border s10 boldtd">');
    html.push('<tr><td style="width:45px;"></td><td style="padding-top:3px;">'+res.receiverName+'</td></tr>');
    html.push('<tr><td>电话：</td><td>'+res.receiverMobile+'</td></tr>');
    html.push('<tr><td> 地址：</td><td>'+res.receiverAddress+'</td></tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('<td width="61" rowspan="2"></td>');
    html.push('</tr>');
    html.push('<tr height="56">');
    html.push('<td style="text-align:center; padding:0;">寄<br />件</td>');
    html.push('<td class="xx10" style="padding:0">');
    html.push('<table class="no_border s9" style="height:56px">');
    html.push('<tr><td>杭州中策车空间汽车服务有限公司</td></tr>');
    html.push('<tr><td>电话：0571-85095657</td></tr>');
    html.push('<tr><td>地址：浙江省杭州市江干区下沙12号大街八方物流</td></tr>');
    html.push('</table>');
    html.push('</td>');
    html.push('</tr>');
    html.push('<tr height="30">');
    html.push('<td colspan="3" style="vertical-align:bottom;text-align:right">');
    html.push('<span style="font-size:12px;">已验视</span>');
    html.push('</td>');
    html.push('</tr>');
    html.push('</table>');
    html.push('</body>');
    html.push('</html>');
    return html.join("");
}
//圆通的模版页面
function YTO_Html(res){
    var html =[];
    html.push('<!DOCTYPE html><style>*{margin:0;padding:0}body{font-family:SimHei,Microsoft YaHei,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:11pt}#content{position:relative;width:377px}table{table-layout:fixed;border-collapse:collapse}table td{width:37px;height:20px}table tr{border-bottom:1px solid #ebebeb}tbody tr.first{border-bottom:0}tbody tr.first td{height:0}.shoukuang{width:64px;font-size:14pt;overflow:hidden;margin-left:10px}.shoukuang span{text-align:center;display:inline-block;color:#fff;background-color:#000;padding:5px}</style><body>');
    html.push('<table>');
    html.push(' <tbody>');
    html.push('<tr class="first"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    html.push('<tr style="height: 54px"><td colspan="10"></td></tr>');
    html.push('<tr>');
    html.push('<td colspan="10" style="height: 56px;font-size: 36pt;font-family:Arial;line-height: 56px;text-align: center">'+res.shortAddress+'</td>');
    html.push('</tr>');
    html.push('<tr style="height: 37px;font-family: SimHei;font-size: 11pt;">');
    html.push('<td style="line-height: 37px"></td><td colspan="5" style="font-size: 16pt;text-align: left"></td><td colspan="4"></td>');
    html.push('</tr>');
    html.push('<tr style="height: 56px;font-family: SimHei;font-size: 10pt">');
    html.push('<td style="font-size: 11pt;line-height: 56px">收</td>');
    html.push('<td colspan="9" style="font-weight: bold">');
    html.push('<span>'+res.receiverName+'</span>');
    html.push('<span>'+res.receiverMobile+'</span>');
    html.push('<p>'+res.receiverAddress+'</p>');
    html.push('</td>');
    html.push('</tr>');
    html.push('<tr style="height: 56px;font-family: SimHei;font-size: 8pt">');
    html.push('<td style="font-size: 11pt;line-height: 56px">寄</td>');
    html.push('<td colspan="9">');
    html.push('<span>杭州中策车空间汽车服务有限公司</span>');
    html.push('<span>0571-85095657</span>');
    html.push('<p>浙江省杭州市江干区下沙12号大街八方物流</p>');
    html.push('</td>');
    html.push('</tr>');
    html.push('<tr style="height: 76px"><td colspan="10"></td></tr>');
    html.push('<tr style="height: 75px;">');
    html.push('<td colspan="2" style="font-size: 8pt">');
    html.push('<p>'+FormatDate(res.modifyDate)+'</p><p>打印时间</p><p>数量 :'+res.number+'</p><p>重量 :'+res.weight+'kg</p>');
    html.push('</td>');
    html.push('<td colspan="5">');
    html.push('<p style="font-size: 6pt">快件送达收件人地址,经收件人或者收件人（寄件人）允许的代人签字,视为送达。您的签字代表您已验收此包裹,并已确认商品信息无误,包装完好,没有划痕,破损等表面质量问题</p>');
    html.push('<p style="font-size: 7pt;text-align: right;padding:6px 5px 0 0">签收栏</p>');
    html.push('</td>');
    html.push('<td colspan="2" style="border-left: 1px solid #ebebeb"></td>');
    html.push('</tr>');
    html.push('</tbody>');
    html.push('<tbody>');
    html.push('<tr class="first"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    html.push('<tr style="height: 58px;"><td colspan="30"></td><td colspan="70"></td></tr>');
    html.push('<tr style="height: 37px">');
    html.push('<td style="line-height: 37px;font-size: 11pt">收</td>');
    html.push('<td colspan="7" style="font-size: 7pt">');
    html.push('<span>'+res.receiverName+'</span>');
    html.push('<span>'+res.receiverMobile+'</span>');
    html.push('<p>'+res.receiverAddress+'</p>');
    html.push('</td>');
    html.push('<td colspan="2" style="border-left: 1px solid #ebebeb"></td>');
    html.push('</tr>');
    html.push('<tr style="height: 37px">');
    html.push('<td style="line-height: 37px;font-size: 11pt">寄</td>');
    html.push('<td colspan="7" style="font-size: 7pt">');
    html.push('<span>杭州中策车空间汽车服务有限公司</span>');
    html.push('<span>0571-85095657</span>');
    html.push('<p>浙江省杭州市江干区下沙12号大街八方物流</p>');
    html.push('</td>');
    html.push('<td colspan="2" style="border-left: 1px solid #ebebeb"></td>');
    html.push('</tr>');
    html.push('<tr style="height: 80px"><td colspan="10">有太阳升起的地方就有朝阳轮胎</td></tr>');
    html.push('<tr style="height: 37px"><td colspan="10">订单号：'+res.orderCode+'</td></tr>');
    html.push('</tbody>');
    html.push('</table>');
    html.push('</body>');
    return html.join("");
}
//中铁物流
function zhongTie(res) {
    LODOP.ADD_PRINT_TEXT("2.59292cm", "2.40771cm", "3.59833cm", "0.5cm", "");  //发件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.60917cm", "2.40771cm", "3.78354cm", "0.5cm", "");  //发件人手机号码
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.60917cm", "7.19667cm", "3.99521cm", "0.5cm", "0571-85095657");     //发件人座机号码
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("3.99521cm", "2.40771cm", "8.78417cm", "1.40229cm", "");  //发件地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("3.41313cm", "2.40771cm", "8.78417cm", "0.5cm", "杭州中策车空间汽车服务有限公司");  //发件公司
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("2.59292cm", "12.409cm", "4.39208cm", "0.5cm", res.receiverName);    //收件人姓名
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.60917cm", "12.409cm", "3.78354cm", "0.5cm", res.receiverMobile);  //收件人手机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("5.60917cm", "17.1979cm", "3.59833cm", "0.5cm", ""); //收件人座机
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("3.99521cm", "12.409cm", "8.38729cm", "1.21708cm", res.receiverAddress);  //收件人详细地址
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("3.41313cm", "12.409cm", "8.38729cm", "0.5cm", "");     //收件人公司
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("9.2075cm", "1.40229cm", "9.78958cm", "3.59833cm", "");  //物品备注
}
function createZhongTieBat(resList) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    for (var i = 0; i < resList.length; i++) {
        var res = resList[i];
        LODOP.NewPage();
        //LODOP.ADD_PRINT_TEXT(top left width height)
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
        zhongTie(res);
    }
    LODOP.PREVIEW();
}
function createZhongTie(res) {
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINT_PAGESIZE(1, 2300, 1270, "");
    zhongTie(res);
    LODOP.PREVIEW();
}