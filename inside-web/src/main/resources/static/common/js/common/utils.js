(function ($, window) {
    var Utils = {};
    Utils.isNotNull = function (obj) {
        if (obj == undefined || obj == null) {
            return false;
        }
        if (typeof(obj) == undefined || typeof(obj) == "undefined") {
            return false;
        }
        return true;
    }
    Utils.isBlank = function (obj) {
        return !Utils.isNotBlack(obj);
    }
    Utils.isNotBlack = function (obj) {
        if (obj == undefined || obj == null) {
            return false;
        }
        if (typeof(obj) == undefined || typeof(obj) == "undefined") {
            return false;
        }
        if ($.trim(obj) == "") {
            return false;
        }
        return true;
    }
    Utils.isContain = function (isArray, target) {
        for (var i in isArray) {
            if (isArray[i] == target) {
                return true;
            }
        }
        return false;
    }
    Utils.scale =function (target,scaleLength){
        var eLenth=10;
        for(var i=0;i<scaleLength;i++){
            eLenth=eLenth*10;
        }
        target=(target-0)*eLenth;
        target=target+"";
        if(target.indexOf(".")>0){
            target=target.substr(0,target.indexOf("."));
        }else if(target.indexOf(".")==0) {
            target=0;
        }
        target=target-0;
        if(target%10>=5){
            target=target-target%10+10;
        }else{
            target=target-target%10
        }
       return target/eLenth;
    }
    Utils.createTimeByDate=function(timeStr){
        var timeArray=timeStr.split("-");
        if(timeArray.length!=3||timeArray[0].length!=4){
            return;
        }else{
           if(timeArray[1].length==1){
               timeArray[1]="0"+timeArray[1];
           }
            if(timeArray[2].length==1){
                timeArray[2]="0"+timeArray[2];
            }
            time=  Utils.createTime(timeArray[0]+"-"+timeArray[1]+"-"+timeArray[2],"YYYY-MM-DD");
            if(Utils.isNotNull(time)){

                return time;
            }
        }
    }
    Utils.createTimeByMonth=function(timeStr){
        var timeArray=timeStr.split("-");
        if(timeArray.length!=2||timeArray[0].length!=4){
            return;
        }else{
            return  Utils.createTimeByDate(timeStr+"-01")
        }
    }
    Utils.createTimeByYear=function(timeStr){
        if(timeStr.length!=4){
            return;
        }else{
            return  Utils.createTimeByDate(timeStr+"-01-01");
        }
    }
    Utils.nextMonth=function(date){
        if(date.getMonth()==11){
            date.setFullYear(date.getFullYear()+1);
            date.setMonth(0);
        }else{
            date.setMonth(date.getMonth()+1);
        }
        return date;
    }
    Utils.nextYear=function(date){
        date.setFullYear(date.getFullYear()+1);
        return date;
    }
    Utils.nextDay=function(date){
        date.setTime(date.getTime()+24*60*60*1000);
        return date;
    }
    Utils.createTime = function (timeStr, timeFormat) {
        if (Utils.isNotNull(timeStr)) {
            var time = new Date();
            timeFormat = timeFormat.toLocaleUpperCase();
            var start = timeFormat.indexOf("YYYY");
            if (start > 0) {
                time.setFullYear(timeStr.substring(start, start + 4));
            }
            start = timeFormat.indexOf("MM");
            if (start > 0) {
                time.setMonth((timeStr.substring(start, start + 2) - 1));
            }
            start = timeFormat.indexOf("DD");
            if (start > 0) {
                time.setDate((timeStr.substring(start, start + 2)));
            }
            start = timeFormat.indexOf("HH");
            if (start > 0) {
                time.setHours((timeStr.substring(start, start + 2)));
            }
            start = timeFormat.indexOf("MS");
            if (start > 0) {
                time.setMinutes((timeStr.substring(start, start + 2)));
            }
            start = timeFormat.indexOf("SS");
            if (start > 0) {
                time.setSeconds((timeStr.substring(start, start + 2)));
            }
            return time;
        }
    }
    Utils.createTimeByLong = function (timeLong) {
        if (Utils.isNotNull(timeLong)) {
            var time = new Date();
            time.setTime(timeLong);
            return time;
        } else {
            return;
        }
    }
    Utils.formatTime = function (time, timeFormat) {
        if (Utils.isNotNull(time)) {
            timeFormat = timeFormat.toLocaleUpperCase();
            timeFormat = timeFormat.replace("YYYY", time.getFullYear());
            timeFormat = timeFormat.replace("MM", (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1));
            timeFormat = timeFormat.replace("DD", time.getDate() > 9 ? time.getDate() : "0" + time.getDate());
            timeFormat = timeFormat.replace("HH", time.getHours() > 9 ? time.getHours() : "0" + time.getHours());
            timeFormat = timeFormat.replace("MS", time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes());
            timeFormat = timeFormat.replace("SS", time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds());
            return timeFormat;
        }
    }
    Utils.formatPrice = function (price) {
        if (Utils.isNotNull(price) && price != '') {
            var priceFormat;
            if (("" + price).indexOf(".") > 0) {
                priceFormat = ("" + price).substring(0, ("" + price).indexOf("."));
                var diont = ("" + price).substring(("" + price).indexOf(".") + 1);
                if (diont.length >= 3) {
                    var num = diont.substring(2, 3);
                    if (num - 0 >= 5) {
                        priceFormat = priceFormat + "." + (diont.substring(0, 2) - 0 + 1);
                    } else {
                        priceFormat = priceFormat + "." + (diont.substring(0, 2) - 0);
                    }
                } else if (diont.length == 0) {
                    priceFormat = priceFormat + ".00";
                } else if (diont.length == 1) {
                    priceFormat = priceFormat + "." + diont + "0";
                } else {
                    priceFormat = priceFormat + "." + diont;
                }
            } else {
                priceFormat = price + ".00";
            }
            return priceFormat;
        }
        return;
    }
    Utils.checkPrice = function (value) {
        return /^(([1-9][0-9]*)|([0-9]+\.[0-9]{1,2}))$/.test(value);
    }
    Utils.checkIsNumber = function (value) {
        return (/^(([1-9]+)|([0-9]+\.[0-9]+))$/.test(value))
    }
    Utils.checkIsInteger = function (value) {
        return (/^(([1-9][0-9]*)|[0-9])$/.test(value))
    }
    Utils.checkBox = function ($box, checkValue, notCheckValue) {
        if ($box.is(':checked')) {
            return checkValue;
        } else {
            return notCheckValue;
        }
    }
    Utils.selectBox = function ($box) {
        $box.attr("checked", "checked");
    }
    Utils.notSelectBox = function ($box) {
        $box.removeAttr("checked");
    }
    Utils.getBaseUrl=function(){
        var search = window.location.search;
        var urlBase=window.location.href;
        if (Utils.isNotNull(search)) {
            urlBase=urlBase.substring(0,urlBase.length-search.length);
        }
        return urlBase;
    }
    Utils.getHrefValue = function (name) {
        var result = new Array();
        var search = window.location.search;
        if (Utils.isNotNull(search)) {
            if (search.indexOf("?") == 0) {
                search = search.substring(1);
            }
            var keyValueList = search.split("&");
            if (keyValueList != null && keyValueList.length > 0) {
                for (var i in keyValueList) {
                    var keyValue = keyValueList[i];
                    var keyValueArray = keyValue.split("=");
                    if (keyValueArray != null && keyValueArray.length == 2) {
                        if ($.trim(keyValueArray[0]) == name) {
                            result.push(keyValueArray[1])
                        }
                    }
                }
            }
        }
        if (result.length == 1) {
            return result[0];
        } else if (result.length > 1) {
            return result;
        } else {
            return;
        }

    }
    Utils.getList = function (url, fun, list, data) {
        if (Utils.isNotNull(list) && list.length > 0) {
            fun.call(this, {result: list});
        } else {
            if (!Utils.isNotNull(data)) {
                data = {};
            }
            ajaxsend(data, url, function (dataJson) {
                fun.call(this, dataJson);
            })
        }
    };
    Utils.uuid = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }
    Utils.JsonFormat = JsonFormat;
    function JsonFormat(obj    //对象
        , level             //层次（基数为1）
        , isInArray) {       //此对象是否在一个集合内
        var n = "\n",
        //定义制表符
            t = "\t";
        if (obj == null) {
            return "";
        }
        //为普通类型，直接输出值
        if (obj.constructor == Number || obj.constructor == Date || obj.constructor == String || obj.constructor == Boolean) {
            var v = obj.toString();
            var tab = isInArray ? repeatStr(t, level - 1) : "";
            if (obj.constructor == String || obj.constructor == Date) {
                //时间格式化只是单纯输出字符串，而不是Date对象
                return tab + ("\"" + v + "\"");
            }
            else if (obj.constructor == Boolean) {
                return tab + v.toLowerCase();
            }
            else {
                return tab + (v);
            }
        }
        //写Json对象，缓存字符串
        var currentObjStrings = [];
        //遍历属性
        for (var name in obj) {
            var temp = [];
            //格式化Tab
            var paddingTab = repeatStr(t, level);
            temp.push(paddingTab);
            //写出属性名
            temp.push(name + " : ");

            var val = obj[name];
            if (val == null) {
                temp.push("null");
            }
            else {
                var c = val.constructor;

                if (c == Array) { //如果为集合，循环内部对象
                    temp.push(n + paddingTab + "[" + n);
                    var levelUp = level + 2;    //层级+2

                    var tempArrValue = [];      //集合元素相关字符串缓存片段
                    for (var i = 0; i < val.length; i++) {
                        //递归写对象
                        tempArrValue.push(JsonFormat(val[i], levelUp, true));
                    }

                    temp.push(tempArrValue.join("," + n));
                    temp.push(n + paddingTab + "]");
                }
                else if (c == Function) {
                    temp.push("[Function]");
                }
                else {
                    //递归写对象
                    temp.push(JsonFormat(val, level + 1));
                }
            }
            //加入当前对象“属性”字符串
            currentObjStrings.push(temp.join(""));
        }
        return (level > 1 && !isInArray ? n : "")                       //如果Json对象是内部，就要换行格式化
            + repeatStr(t, level - 1) + "{" + n     //加层次Tab格式化
            + currentObjStrings.join("," + n)                       //串联所有属性值
            + n + repeatStr(t, level - 1) + "}";   //封闭对象
    }

    function repeatStr(str, times) {
        var newStr = [];
        if (times > 0) {
            for (var i = 0; i < times; i++) {
                newStr.push(str);
            }
        }
        return newStr.join("");
    }

    window.Utils = Utils;
})
(jQuery, window)