(function ($, window) {
    var callChild = {};
    var parentUtils = {};
    var iframeLoadList = new Array();
    var sendInfoList = new Array();
    callChild.useRegister = function (id, name, dataJson) {
        if (parentUtils.checkHasChild(id)) {
            if (sendHandler(id)) {
                return  $("#"+id)[0].contentWindow.callParent.use(name, dataJson);
            }
        }
    };
    callChild.useRegisterSync = function (id, name, dataJson, back) {
        if (parentUtils.checkHasChild(id)) {
            if (sendHandler(id)) {
                var result =  $("#"+id)[0].contentWindow.callParent.use(name, dataJson);
                back.call(this, result);
                return;
            }
        }
        sendInfoList.push({id: id, name: name, back: back, dataJson: dataJson})
    }
    parentUtils.checkHasChild = function (id) {
         return Utils.isNotNull(window.frames[id]);
    }
    function sendHandler(id) {
        if (hasIframeId(id)) {
            if (parentUtils.checkHasChild(id)) {
                try {
                    $("#"+id)[0].contentWindow.callParent.isLoad()
                    return true;
                } catch (e) {
                    removeIframeId(id);
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    function hasIframeId(id) {
        var bool = false;
        for (var i in iframeLoadList) {
            var iframeId = iframeLoadList[i];
            if (iframeId == id) {
                bool = true;
            }
        }
        return bool;
    }

    function addIframeId(id) {
        var bool = false;
        for (var i in iframeLoadList) {
            var iframeId = iframeLoadList[i];
            if (iframeId == id) {
                bool = true;
            }
        }
        if (!bool) {
            iframeLoadList.push(id)
        }
    }

    function removeIframeId(id) {
        var bool = false;
        var key;
        for (var i = 0; i < iframeLoadList.length; i++) {
            var iframeId = iframeLoadList[i];
            if (iframeId == id) {
                bool = true;
                key = i;
            }
        }
        if (!bool) {
            iframeLoadList.splice(key);
        }
    }

    window.acceptLoad = function (id) {
        addIframeId(id);
        if (sendHandler(id)) {
            if (Utils.isNotNull(sendInfoList) && sendInfoList.length > 0) {
                var tempSendInfoList = new Array();
                for (var i = 0; i < sendInfoList.length; i++) {
                    var sendInfo = sendInfoList[i];
                    if (sendInfo.id == id) {
                        callChild.useRegisterSync(sendInfo.id, sendInfo.name, sendInfo.dataJson, sendInfo.back);
                    } else {
                        tempSendInfoList.push(sendInfo);
                    }
                }
                sendInfoList = tempSendInfoList;
            }
        }
    }
    window.callChild = callChild;
    window.parentUtils = parentUtils;
})(jQuery, window)