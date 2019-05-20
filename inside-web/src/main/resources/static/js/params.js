(function ($, window) {
    var params = {};
    params.get = function getParam(name) {
        /*
         * 功能:取得变量name的值
         * 参数:name,字符串.
         */
        var url = location.search;
        var Request = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1)//去掉?号
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
            if (name == undefined || name == null) {
                name = 'id';
            }
            return Request[name];
        }
    };
    window.params = params;
})(jQuery, window);