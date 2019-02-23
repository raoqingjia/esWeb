
//这个页面的作用是控制使用插件的路径，避免每个页面的插入路径过多

//IE9及以下浏览器
document.write('<!--[if lt IE 9]>');
document.write('<script src="../plugins/html5shiv/js/html5shiv.min.js"></script>');
document.write('<script src="../plugins/bootstrap/js/respond.min.js"></script>');
//document.write('<script src="../plugins/json2/js/json2.js"></script>');
document.write('<![endif]-->');


//IE10及以下浏览器   不支持pushState的浏览器的HTML5历史API扩展
document.write('<!--[if lt IE 10]>');
//document.write('<script src="../plugins/history/js/history.js"></script>');
document.write('<![endif]-->');


//IE10及以下浏览器  避免IE9/8跨域
document.write('<!--[if lt IE 10]>');
document.write('<script src="../plugins/xhrXdrAdapter/js/xhr-xdr-adapter.js"></script>');
document.write('<![endif]-->');


//title图标显示
document.write('<link rel="shortcut icon" href="../images/title.ico">');

//angular-1.2.9.min
document.write('<script src="../plugins/angular/js/angular-1.2.9.min.js"></script>');
//angular-ui-route路由配置
document.write('<script src="../plugins/angular/js/angular-ui.router.js"></script>');

//jquery-1.9.1.min.js
document.write('<script src="../plugins/jquery/js/jquery-1.9.1.min.js"></script>');

//bootstrap
document.write('<link rel="stylesheet" href="../plugins/bootstrap/css/bootstrap.min.css">');

//日历控件datepicker
document.write('<link rel="stylesheet" href="../plugins/bootstrapDatepicker/css/bootstrap-datepicker.min.css">');
document.write('<script src="../plugins/bootstrapDatepicker/js/bootstrap-datepicker.min.js"></script>');
document.write('<script src="../plugins/bootstrapDatepicker/js/bootstrap-datepicker.zh-CN.min.js"></script>');

////滚轮美化样式的插件jquery.nicescroll.js
document.write('<script src="../plugins/nicescroll/js/jquery.nicescroll.min.js"></script>');

////表格排序的插件dataTables
document.write('<link rel="stylesheet" href="../plugins/dataTables/css/dataTables.bootstrap.css">');
document.write('<script src="../plugins/dataTables/js/jquery.dataTables.js"></script>');
document.write('<script src="../plugins/dataTables/js/dataTables.bootstrap.js"></script>');

//echarts图标插件
document.write('<script src="../plugins/echarts/js/echarts.min.js"></script>');

//页面样式
document.write('<link rel="stylesheet"  href="../css/common.css" >');
document.write('<link rel="stylesheet"  href="../css/compositive.css">');
//文件字体
document.write('<link rel="stylesheet" href="../css/font-awesome.min.css">');


//公共交互效果
document.write('<script src="../js/pages/common.js"></script>');













/*
//这是绝对路径

//这个页面的作用是控制使用插件的路径，避免每个页面的插入路径过多

//title图标显示
document.write('<link rel="shortcut icon" href="/ecWeb/src/images/title.ico">');

//angular-1.2.9.min
document.write('<script src="/ecWeb/src/plugins/angular/angular-1.2.9.min.js"></script>');
//angular-ui-route路由配置
document.write('<script src="/ecWeb/src/plugins/angular/angular-ui.router.js"></script>');

//jquery-1.9.1.min.js
document.write('<script src="/ecWeb/src/plugins/jquery/jquery-1.9.1.min.js"></script>');

//bootstrap
document.write('<link rel="stylesheet" href="/ecWeb/src/plugins/bootstrap/css/bootstrap.min.css">');
document.write('<link rel="stylesheet" href="/ecWeb/src/plugins/bootstrap/css/font-awesome.min.css">');


//日历控件datepicker
document.write('<link rel="stylesheet" href="/ecWeb/src/plugins/bootstrapDatepicker/css/bootstrap-datepicker.min.css">');
document.write('<script src="/ecWeb/src/plugins/bootstrapDatepicker/js/bootstrap-datepicker.min.js"></script>');
document.write('<script src="/ecWeb/src/plugins/bootstrapDatepicker/js/bootstrap-datepicker.zh-CN.min.js"></script>');


//页面样式
document.write('<link rel="stylesheet"  href="/ecWeb/src/css/common.css" >');
document.write('<link rel="stylesheet"  href="/ecWeb/src/css/compositive.css">');

//滚轮美化样式的插件jquery.nicescroll.js
document.write('<script src="/ecWeb/src/plugins/nicescroll/jquery.nicescroll.min.js"></script>');


//表格排序的插件dataTables
document.write('<link rel="stylesheet" href="/ecWeb/src/plugins/dataTables/css/dataTables.bootstrap.css">');
document.write('<script src="/ecWeb/src/plugins/dataTables/js/jquery.dataTables.js"></script>');
document.write('<script src="/ecWeb/src/plugins/dataTables/js/dataTables.bootstrap.js"></script>');


//echarts图标插件
document.write('<script src="/ecWeb/src/plugins/echarts/echarts.min.js"></script>');

//公共交互效果
document.write('<script src="/ecWeb/src/js/pages/common.js"></script>');

//IE9兼容
document.write('<!--[if lt IE 9]>');
document.write('<script src="/ecWeb/src/plugins/html5shiv/html5shiv.min.js"></script>');
document.write('<script src="/ecWeb/src/plugins/bootstrap/js/respond.min.js"></script>');
document.write('<![endif]-->');

    */