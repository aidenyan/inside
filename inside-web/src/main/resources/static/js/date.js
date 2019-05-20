/**
 * 调用示例：date.bindDate();
 * 可用方法：bindDate
 * 参数说明：
 *           startDateId    开始日期标签id
 *           endDateId      结束日期标签id
 */
layui.define(function (exports) {
    var laydate = layui.laydate
        , $ = layui.jquery;

    var start = {
        min: '2015-01-01 00:00:00'
        , max: '2099-12-31 23:59:59'
        , istoday: false
        , choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
        }
    };

    var end = {
        min: '2015-01-01 00:00:00'
        , max: '2099-12-31 23:59:59'
        , istoday: false
        , choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };

    var obj = {
        bindDate: function (startDateId, endDateId) {
            $('#' + startDateId).click(function () {
                start.elem = this;
                laydate(start);
            });
            $('#' + endDateId).click(function () {
                end.elem = this;
                laydate(end);
            });
        }
    };

    //输出接口
    exports('date', obj);
});
