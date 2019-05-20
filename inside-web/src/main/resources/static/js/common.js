function writeJs() {
    document.write('<script type="text/javascript" src="../../layui/layui.js"></script>');
    document.write('<script type="text/javascript" src="../../common/lib/jquery-1.9.0.min.js"></script>');
    document.write('<script type="text/javascript" src="../../common/js/common/map.js"></script>');
    document.write('<script type="text/javascript" src="../../common/js/common/utils.js"></script>');
    document.write('<script type="text/javascript" src="../../common/js/common/order.js"></script>');
    document.write('<script type="text/javascript" src="../../common/js/common/ajaxsend.js"></script>');
    document.write('<script type="text/javascript" src="../../common/js/parent.js"></script>');
    document.write('<script type="text/javascript" src="../../common/js/child.js"></script>');
    document.write('<script type="text/javascript" src="../../js/params.js"></script>');
    document.write('<script type="text/javascript" src="../../js/list.js"></script>');
}
writeJs();

function refresh(btnName, pageNumName) {
    if (!Utils.isNotNull(btnName)) {
        btnName = 'btnSearch';
    }
    if (!Utils.isNotNull(pageNumName)) {
        pageNumName = 'pageNum';
    }
    var refBtn = $("#" + pageNumName).find(".layui-laypage-btn");
    if (refBtn.length > 0) {
        refBtn.click();
    } else {
        $('#' + btnName).click();
    };
    layer.msg('已刷新为最新数据！！',{
        time:300
    })
}

var doSave = true;
function checkSave(){
    if(doSave){
        doSave = false;
        setTimeout("doSave = true", 3000);
        return true;
    }else {
        return false;
    }
}

function showBody(){
    $("#divBody").show();
}
