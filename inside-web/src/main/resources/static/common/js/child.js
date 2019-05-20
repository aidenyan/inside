(function ($, window) {
    var callParent = {};
    var registerMap = new Map();
    var defaulName = "default"
    callParent.openTab = function (code, index, title, url,reflush) {
        window.parent.addIframe(code, index, title, url,reflush);
    }
    callParent.register = function (fun, name) {
        if (!Utils.isNotNull(name)) {
            registerMap.push(defaulName, {funName: name, fun: fun});
        } else {
            registerMap.push(name, {funName: name, fun: fun});
        }
    };
    callParent.use = function (name, dataJson) {
        var registerObj;
        if (Utils.isNotNull(name)) {
             registerObj = registerMap.get(name)

        } else {
             registerObj = registerMap.get(defaulName)
        }
        if(Utils.isNotNull(registerObj)){
            registerObj.fun.call(this, dataJson);
        }

    }
    callParent.parentUse=function(id,name,dataJson){
        window.parent.callChild.useRegister(id,name,dataJson)
    }
    callParent.closeTab = function (id) {
        window.parent.closeTab(id);
    }
    callParent.checkHasChild = function (id) {
        return window.parent.parentUtils.checkHasChild(id);
    }
    callParent.isLoad=function(){
        return true;
    }
    callParent.isLoadEnd=function(id){
        window.parent.acceptLoad(id);
    }
    window.callParent = callParent;
})(jQuery, window);