$().ready(function () {
    companyInit(null, null);
    //getSearch();
});

//页面初始化
var companyInit = function (id, pId) {
    $.ajax({
        url: "/inventory/locationRootTree.json",
        type: "post",
        traditional: true,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            var orgList = data.result;
            $.fn.zTree.init($("#companyTree"), setting, orgList);
            /*if (id != null) {
             selectNodeChange(id, pId);
             } else {
             selectNodeChange(1, null);//展开最上级父类，写死的
             }*/
        },
        error: function (message) {
            layer.alert(message);
        }
    })
};


function showBtn(treeId, treeNode) {
    return !(treeNode.isOrg || treeNode.isParent);
}
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        if (treeNode.name != "请填写编号" && treeNode.name != "-") {
            console.log(JSON.stringify(treeNode));
            var zTree = $.fn.zTree.getZTreeObj("companyTree");
            $.ajax({
                url: "/inventory/save.json",
                data: {
                    'pId': treeNode.id,
                    'level': treeNode.level - 0 + 1,
                    'isOrg': treeNode.isOrg,
                    'name': treeNode.name
                },
                dataType: "json",
                success: function (data) {
                    if(data.code == 0) {
                        var dataJson = data.result;
                        if (dataJson != null) {
                            zTree.addNodes(treeNode, {
                                id: dataJson.id,
                                pId: dataJson.parentId,
                                name: "请填写编号"
                            });
                        }
                    }else{
                        alert(data.message);
                    }
                },
                error: function (message) {
                    alert(message);
                }
            });
        } else {
            alert("请维护编号后再添加");
        }
        return false;
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};
function beforeEditName(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("companyTree");
    zTree.selectNode(treeNode);
    zTree.editName(treeNode);
    return false;
}
function beforeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("companyTree");
    zTree.selectNode(treeNode);
    if (confirm("确认删除 节点 " + treeNode.name + " 吗？")) {
        var res = true;
        $.ajax({
            url: "/inventory/deleteCheck.json",
            data: {'id': treeNode.id},
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code != '0') {
                    alert(data.message);
                    res = false;
                }
            },
            error: function (message) {
                alert(message);
                res = false;
            }
        });
        return res;
    }else {
        return false;
    }
}
function onRemove(e, treeId, treeNode) {
    $.ajax({
        url: "/inventory/delete.json",
        data: {'id': treeNode.id},
        dataType: "json",
        success: function () {

        },
        error: function (message) {
            alert(message);
        }
    });
}
function beforeRename(treeId, treeNode, newName, isCancel) {
    //var zTree = $.fn.zTree.getZTreeObj("companyTree");
    if (newName.length == 0) {
        setTimeout(function() {
            //zTree.cancelEditName();
            alert("编号不能为空.");
        }, 0);
        return false;
    } else if (newName.length > 2 || !/^[0-9a-zA-Z]*$/.test(newName)) {
        setTimeout(function() {
            //zTree.cancelEditName();
            alert("编号只能是2位数字或字母.");
        }, 0);
        return false;
    } else if (newName == treeNode.name) {
        return true;
    } else {
        var res = true;
        $.ajax({
            url: "/inventory/updateCheck.json",
            data: {
                'id': treeNode.id,
                'pId': treeNode.pId,
                'level': treeNode.level,
                'name': newName
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code != '0') {
                    setTimeout(function() {
                        //zTree.cancelEditName();
                        alert(data.message);
                    }, 0);
                    res = false;
                }
            },
            error: function (message) {
                setTimeout(function() {
                    //zTree.cancelEditName();
                    alert(message);
                }, 0);
                res = false;
            }
        });
        return res;
    }
}
function onRename(e, treeId, treeNode, isCancel) {
    $.ajax({
        url: "/inventory/update.json",
        data: {
            'id': treeNode.id,
            'pId': treeNode.pId,
            'level': treeNode.level,
            'name': treeNode.name
        },
        dataType: "json",
        success: function (data) {
            if (data.code != '0') {
                alert(data.message);
            }
        },
        error: function (message) {
            alert(message);
        }
    });
}

var setting = {
    async: {
        enable: true,
        url: "/inventory/locationTree.json",
        autoParam: ["id", "isOrg", "level"],
        dataFilter: function (treeId, parentNode, responseData) {
            return responseData.result;
        }
    },
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: showBtn,
        showRenameBtn: showBtn
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: onRename
    },
}
