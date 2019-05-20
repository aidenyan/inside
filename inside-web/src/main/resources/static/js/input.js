//config的设置是全局的
layui.config({
    base: '../js/' //js所在的目录
}).extend({ //设定模块别名
    dialog: 'dialog' //给js指定别名，方便后面调用
    //test: 'admin/test' //或者相对于上述base目录的子目录
});

