(function ($, window) {
    var dialog = {}
    dialog.open = function (otp) {
        if (!Utils.isNotNull(otp.id)) {
            return;
        }
        $("#"+otp.removeId).remove();
        if (Utils.isNotNull(otp.url)) {
            ajaxsend(otp.paramter, otp.url, function (dataJson) {
                var dealData=dataJson;
                if (Utils.isNotNull(otp.dataDeal)) {
                    dealData = otp.dataDeal.call(this, dataJson);
                }
                var jsRenderTpl = $.templates('#'+otp.id);
                /*绑定数据*/
                finalTpl = jsRenderTpl(dealData);
                $('body').append(finalTpl);
                if(Utils.isNotNull(otp.bind)){
                    otp.bind();
                }
                otp.openDilog.call(this,dataJson);
            });
        }else{
            var dataJson={};
            var jsRenderTpl = $.templates('#'+otp.id);
            /*绑定数据*/
            finalTpl = jsRenderTpl(dataJson);
            $('body').append(finalTpl)
            if(Utils.isNotNull(otp.bind)){
                otp.bind();
            }
            otp.openDilog.call(this,dataJson);
        }
    }
    window.dialog=dialog;
})(jQuery, window)