/**
 * Created by Administrator on 2017/3/31.
 */


myapp.controller("userInfor",["$scope","$rootScope","$http","User","userActionOption","$state","$window","$location",
    function($scope,$rootScope,$http,User,userActionOption,$state,$window,$location){

        User.setObject("permissionList",permissionList);
        permissionList="";
        //整个body范围的函数
        $scope.bodyFun = function () {
            $scope.userActionStatus = false;
        };

        $scope.userName=User.getObject("permissionList").data.userInfo.authName;   //用户名
        $scope.border =User.getObject("permissionList").data.messageCount;          //用户消息条数
        if ($scope.border > 99) {
            $scope.border = "···";
        }


        //这是头部用户位置的操作选项    是分角色的
        if(User.getObject("permissionList").data.userInfo.authType=="M"){
            $scope.userActionOption=userActionOption.customerManager;
        }else{
            $scope.userActionOption=userActionOption.messageCenter;
        }


        //   用户操作选项     初始状态是隐藏效果
        $scope.userActionStatus = false;
        //用户选项显示隐藏的效果函数
        $scope.userActionFun = function ($event) {
            $scope.userActionStatus = !$scope.userActionStatus;
            $event.stopPropagation();
        };


        //头部NAv导航栏的数据
        $scope.navArray =User.getObject("permissionList").data.userNavMenu;

        //头部NAv导航栏交互的效果

        $rootScope.navActive = User.get("navActive",0);  //设置初始哪一个选项被选中  第一个参数是已有参数，第二个如果没有参数，单独设置
        //绑定样式切换函数，点击时获取当前的的下标
        $scope.navArrayFun = function (index) {
            $rootScope.navActive = index;
            User.set("navActive",index);  //第一个参数是下标，第二个参数是数值
        };

        $rootScope.echartsWindowArray=[
            {link:"#/statistics/order/monthStatistics",name:"按月统计"},
            {link:"#/statistics/order/provinceStatistics",name:"分省统计"},
            {link:"#/statistics/package/totalDay",name:"总量日统计"},
            {link:"#/statistics/package/totalMonth",name:"总量月统计"},
            {link:"#/statistics/package/provinceDay",name:"分省日统计"},
            {link:"#/statistics/package/provinceMonth",name:"分省月统计"}
        ];


        $scope.echartsWindowFun=function(target,link,name,$index,$event){
            var  link=link;
            var  num=0;

            $(".left-nav  .box ul>li>a").each(function(index,item){
                $(this).parents("li").removeClass("active")
                var strNum=0;
                var href=$(this).attr("data");
                strNum=href.indexOf("#");
                href=href.substring(strNum);
                if(href==link){
                    num=$(this).parents("ul").attr("data");
                    $(this).parents("li").addClass("active")
                }
            });

             $rootScope.leftNavTab=num;
             User.set("leftNavTab",num);

            link=link.substring(13);
            $state.go("statistics."+link,{argumentsId:"",argumentsName:""});
            //$location.path(link);
            User.set("statisticsUrl",link)
        };

        ////可兼容所有浏览器关闭当前页面函数
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
                 $scope.CloseWebPage=true
        });

        overTimeFun();   //计算用户是否登录超时
        function overTimeFun(){
            var myTime = setTimeout(function(){
                window.location.replace('../../src/EC_WEB/error.html?error=1');
            }, 300000);  //5分钟不操作，页面跳转
            function resetTime() {
                clearTimeout(myTime);
                myTime = setTimeout(function(){
                   window.location.replace('../../src/EC_WEB/error.html?error=1');
                },300000);  //5分钟  300000 不操作，页面跳转
            }
            document.documentElement.onkeydown=resetTime;
            document.documentElement.onclick=resetTime;
        }

    }]);


//       首页的控制器
myapp.controller("firstPage", ["$scope", "$http","$document","User",function($scope,$http,$document,User) {
    $document[0].title="首页";
    User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式
}]);

//      运营统计    的控制器
myapp.controller("statistics", ["$scope","$rootScope","$http","$window","$state","$document","$location","User", function($scope,$rootScope,$http,$window,$state,$document,$location,User) {

    $document[0].title="运营统计";

    //左侧NAv导航栏的数据
   var leftNavArray =User.getObject("permissionList").data.userLeftMenu;

    $scope.leftNavArray=leftNavArray;

    //if(isEmptyObject(User.getObject("leftNavArray"))){
    //    $scope.leftNavArray =leftNavArray
    //}else{
    //    $scope.leftNavArray = User.getObject("leftNavArray");
    //}


    $scope.selectCompanyArray=[
        {name:"自用业务专用集团(200210191200200000)",id:"125210"},
        {name:"广州酷狗计算机科技有限公司(200082584200200000)",id:"384660"},
        {name:"淘宝(中国)软件有限公司(200082600200200000)",id:"385599"},
        {name:"中国移动(200211052200200000)",id:"386219"},
        {name:"广东省定向流量统付业务测试企业一(200211121200200000)",id:"410170"},
        {name:"广东省定向流量统付业务测试企业二(200211122200200000)",id:"410180"},
        {name:"广州市交互式信息网络有限公司(200211137200200000)",id:"420686"},
        {name:"网宿科技股份有限公司(200220171200200000)",id:"432109"},
        {name:"北京易哥科技有限公司(200600096200200000)",id:"438415"},
        {name:"上海驰游信息技术有限公司(200211163200200000)",id:"444997"},
        {name:"深圳市无限融合科技有限公司(200321094200200000)",id:"453839"},
        {name:"北界无限（北京）软件有限公司(200082920200200000)",id:"493634"},
        {name:"上海帝联信息科技股份有限公司广州分公司(200600160200200000)",id:"497705"}
    ];

    $scope.selectCompanyShow=false;
    $scope.selectCompanyName="自用业务专用集团(200210191200200000)";   //初始默认选项内容
    $scope.selectCompanyID="125210";


    $scope.selectCompanyInputFun=function($event){
        $scope.selectCompanyShow=!$scope.selectCompanyShow;
        $(".echarts-window").css({"display":"none"});
        $event.stopPropagation();
    };

    $scope.selectCompanyOptionFun=function(name,id,$event){
        $scope.selectCompanyName=name;
        $scope.selectCompanyID=id;
        $scope.selectCompanyShow=false;

        var  userLeftMenu;
        if(id=="125210"){
            //左侧NAv导航栏的数据
            userLeftMenu=[
                {menuId:22,menuCode:"216",menuName:"订购",menuAddr:"#",parentMenuId:7,"resId":30,son:[
                    {menuId:25,menuCode:"219",menuName:"按月统计",menuAddr:"order/monthStatistics",parentMenuId:22,resId:33},
                    {menuId:26,menuCode:"220",menuName:"分省统计",menuAddr:"order/provinceStatistics",parentMenuId:22,resId:34}
                ]},
                {menuId:23,menuCode:"217",menuName:"流量包",menuAddr:"#",parentMenuId:7,resId:31,son:[
                    {menuId:27,menuCode:"223",menuName:"总量日统计",menuAddr:"package/totalDay",parentMenuId:23,resId:35},
                    {menuId:28,menuCode:"224",menuName:"总量月统计",menuAddr:"package/totalMonth",parentMenuId:23,resId:36},
                    {menuId:29,menuCode:"225",menuName:"分省日统计",menuAddr:"package/provinceDay",parentMenuId:23,resId:38},
                    {menuId:30,menuCode:"226",menuName:"分省月统计",menuAddr:"package/provinceMonth",parentMenuId:23,resId:39},
                    {menuId:43,menuCode:"239",menuName:"套餐档位日统计",menuAddr:"package/gearDay",parentMenuId:23,resId:51},
                    {menuId:44,menuCode:"240",menuName:"套餐档位月统计",menuAddr:"package/gearMonth",parentMenuId:23,resId:52}
                ]},
                {menuId:24,menuCode:"218",menuName:"流量池",menuAddr:"#",parentMenuId:7,resId:32,son:[
                    {menuId:33,menuCode:"229",menuName:"流量日统计",menuAddr:"pool/flowDay",parentMenuId:24,resId:42},
                    {menuId:34,menuCode:"230",menuName:"流量月统计",menuAddr:"pool/flowMonth",parentMenuId:24,resId:43},
                    {menuId:37,menuCode:"233",menuName:"超高用户日统计",menuAddr:"pool/superDay",parentMenuId:24,resId:46},
                    {menuId:38,menuCode:"234",menuName:"超高用户月统计",menuAddr:"pool/superMonth",parentMenuId:24,resId :47},
                    {menuId:39,menuCode:"235",menuName:"月使用量阶梯分布",menuAddr:"pool/ladderMonth",parentMenuId:24,resId:48}
                ]}

            ];

        }else if(id=="384660"){
            userLeftMenu=[
                {menuId:22,menuCode:"216",menuName:"订购",menuAddr:"#",parentMenuId:7,"resId":30,son:[
                    {menuId:26,menuCode:"220",menuName:"分省统计",menuAddr:"order/provinceStatistics",parentMenuId:22,resId:34},
                    {menuId:25,menuCode:"219",menuName:"按月统计",menuAddr:"order/monthStatistics",parentMenuId:22,resId:33}
                ]},
                {menuId:23,menuCode:"217",menuName:"流量包",menuAddr:"#",parentMenuId:7,resId:31,son:[
                    {menuId:43,menuCode:"239",menuName:"套餐档位日统计",menuAddr:"package/gearDay",parentMenuId:23,resId:51},
                    {menuId:44,menuCode:"240",menuName:"套餐档位月统计",menuAddr:"package/gearMonth",parentMenuId:23,resId:52}
                ]},
                {menuId:24,menuCode:"218",menuName:"流量池",menuAddr:"#",parentMenuId:7,resId:32,son:[
                    {menuId:38,menuCode:"234",menuName:"超高用户月统计",menuAddr:"pool/superMonth",parentMenuId:24,resId :47},
                    {menuId:39,menuCode:"235",menuName:"月使用量阶梯分布",menuAddr:"pool/ladderMonth",parentMenuId:24,resId:48}
                ]}

            ];
        }else if(id=="385599"){
            userLeftMenu=[
                {menuId:23,menuCode:"217",menuName:"流量包",menuAddr:"#",parentMenuId:7,resId:31,son:[
                    {menuId:43,menuCode:"239",menuName:"套餐档位日统计",menuAddr:"package/gearDay",parentMenuId:23,resId:51},
                    {menuId:44,menuCode:"240",menuName:"套餐档位月统计",menuAddr:"package/gearMonth",parentMenuId:23,resId:52}
                ]},
                {menuId:24,menuCode:"218",menuName:"流量池",menuAddr:"#",parentMenuId:7,resId:32,son:[
                    {menuId:38,menuCode:"234",menuName:"超高用户月统计",menuAddr:"pool/superMonth",parentMenuId:24,resId :47},
                    {menuId:39,menuCode:"235",menuName:"月使用量阶梯分布",menuAddr:"pool/ladderMonth",parentMenuId:24,resId:48}
                ]}

            ];
        }else if(id=="386219"){
            //左侧NAv导航栏的数据
            userLeftMenu=[
                {menuId:23,menuCode:"217",menuName:"流量包",menuAddr:"#",parentMenuId:7,resId:31,son:[
                    {menuId:27,menuCode:"223",menuName:"总量日统计",menuAddr:"package/totalDay",parentMenuId:23,resId:35},
                    {menuId:28,menuCode:"224",menuName:"总量月统计",menuAddr:"package/totalMonth",parentMenuId:23,resId:36},
                    {menuId:29,menuCode:"225",menuName:"分省日统计",menuAddr:"package/provinceDay",parentMenuId:23,resId:38},
                    {menuId:30,menuCode:"226",menuName:"分省月统计",menuAddr:"package/provinceMonth",parentMenuId:23,resId:39},
                    {menuId:43,menuCode:"239",menuName:"套餐档位日统计",menuAddr:"package/gearDay",parentMenuId:23,resId:51},
                    {menuId:44,menuCode:"240",menuName:"套餐档位月统计",menuAddr:"package/gearMonth",parentMenuId:23,resId:52}
                ]},
                {menuId:24,menuCode:"218",menuName:"流量池",menuAddr:"#",parentMenuId:7,resId:32,son:[
                    {menuId:33,menuCode:"229",menuName:"流量日统计",menuAddr:"pool/flowDay",parentMenuId:24,resId:42},
                    {menuId:34,menuCode:"230",menuName:"流量月统计",menuAddr:"pool/flowMonth",parentMenuId:24,resId:43},
                    {menuId:37,menuCode:"233",menuName:"超高用户日统计",menuAddr:"pool/superDay",parentMenuId:24,resId:46},
                    {menuId:38,menuCode:"234",menuName:"超高用户月统计",menuAddr:"pool/superMonth",parentMenuId:24,resId :47},
                    {menuId:39,menuCode:"235",menuName:"月使用量阶梯分布",menuAddr:"pool/ladderMonth",parentMenuId:24,resId:48}
                ]}

            ];

        }
        $scope.leftNavArray =userLeftMenu;
        var url=userLeftMenu[0].son[0].menuAddr;
        //$location.path("/statistics/"+url);
        $state.go("statistics."+url,{argumentsId:"",argumentsName:""});

        $rootScope.leftNavTab =0;
        User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectCompanyShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    //左侧NAv导航栏Tab二级切换的效果
    $rootScope.leftNavTab =0;
    $rootScope.leftNavTabFun = function (index) {
        $rootScope.leftNavTab = index;
        User.set("leftNavTab",index);  //第一个参数是下标，第二个参数是数值
    };
    //左侧NAv导航栏Tab二级切换时图标的变化
    $scope.leftNavClassFun = function (index) {
        if ($rootScope.leftNavTab == index) {
            return "upcaret"
        } else {
            return "downcaret"
        }
    };


    //$location.path(User.get("statisticsUrl","/statistics/order/monthStatistics"));
    //$location.path("/statistics/order/monthStatistics");
    $state.go("statistics.order/monthStatistics",{argumentsId:"",argumentsName:""});

    $scope.loadStatisticsFun=function(url,target,$event){
        //$location.path("/statistics/"+url);
        $state.go("statistics."+url,{argumentsId:"",argumentsName:""});
        //User.set("statisticsUrl","/statistics/"+url)
        $(target).parents(".left-nav").find(".box li").removeClass("active");
        $(target).parent().addClass("active")
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $(".left-nav .box ul li:first").addClass("active")
   })

}]);

//     订购   按月统计    的控制器
myapp.controller("monthStatisticsOrder", ["$scope","$rootScope","$http","citySelectArray",function($scope,$rootScope,$http,citySelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期

    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


 //    EC编码  的初始数据
    $scope.ECnumber="";

  //统计图   的参数配置
    $scope.echartsShow=true;      //柱状图显示
    $scope.echartsNoData=false;   //柱状图默认有数据
    $scope. echartsUnit="个";     //柱状图默Y轴的单位
    $scope.echartsxAxis= ['2016-10', '2016-11', '2016-12', '2017-01', '2016-02', '2016-03', '2016-04'];       //柱状图默X轴的单位
    $scope.echartsSeries=['100','350','567','678','654', '732','636'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=0;       // 柱状图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#monthStatisticstableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//     订购   分省统计    的控制器
myapp.controller("provinceStatisticsOrder", ["$scope","$rootScope","$http","citySelectArray", function($scope,$rootScope,$http,citySelectArray) {

    $rootScope.echartsWindowArray=[
        {link:"#/statistics/order/monthStatistics",name:"按月统计"},
        {link:"#/statistics/package/totalMonth",name:"总量月统计"},
        {link:"#/statistics/package/provinceDay",name:"分省日统计"}
    ];

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期

    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码  的初始数据
    $scope.ECnumber="";

    //统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['北京', '广东', '上海', '天津', '重庆', '辽宁', '江苏',"湖北","四川","陕西",
        "河北","山西","河南","吉林","黑龙江","内蒙古","山东","安徽","浙江","福建","湖南","广西","江西","贵州",
        "云南","西藏","海南","","","",""];       //柱状图默X轴的单位
    $scope.echartsSeries=['100','350','567','678','654', '532','100','350','567','678','654', '532','100'
        ,'350','567','678','654', '532','100','350','567','678','654','100','350','100','350'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=45;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离


    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#provinceStatisticsTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//     流量包     总量日统计   的控制器
myapp.controller("totalDayPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });

    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['2017-04-01', '2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06',
        '2017-04-07',"2017-04-08","2017-04-09","2017-04-10", "2017-04-11","2017-04-12","2017-04-13",
        "2017-04-14","2017-04-15","2017-04-16","2017-04-17"];       //统计图默X轴的单位
    $scope.echartsSeries=['4000000','3500000','5000670','6000078','6000054', '5000032','5000000','3000500',
        '5060007','6070008','6000054', '5000032','4000000','3000500','5000067','3000050'];                                                 //统计图默Y轴的单位
    $scope.echartsRotate=55;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="13%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#totalDayPackageTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//    流量包  总量月统计    的控制器
myapp.controller("totalMonthPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    //统计图   的参数配置
    $scope.echartsShow=true;      //柱状图显示
    $scope.echartsNoData=false;   //柱状图默认有数据
    $scope. echartsUnit="个";     //柱状图默Y轴的单位
    $scope.echartsxAxis= ['2016-10', '2016-11', '2016-12', '2017-01', '2016-02', '2016-03', '2016-04'];       //柱状图默X轴的单位
    $scope.echartsSeries=['10000000','35000000','567000','6780000','6540000', '7320000','6360000'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=0;       // 柱状图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#totalMonthPackageTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//   流量包 分省日统计     的控制器
myapp.controller("provinceDayPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['北京', '广东', '上海', '天津', '重庆', '辽宁', '江苏',"湖北","四川","陕西",
        "河北","山西","河南","吉林","黑龙江","内蒙古","山东","安徽","浙江","福建","湖南","广西","江西","贵州",
        "云南","西藏","海南","","","",""];       //柱状图默X轴的单位
    $scope.echartsSeries=['100000','350000','567000','600078','600054', '530002','100000','300050',
        '500067','600078','650004', '500032','100000','300050','500067','600078','600054',
        '500032','100000','300050','500067','600078','600054','100000', '350000','100000','300000'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=45;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#provinceDayPackageTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//  流量包  分省月统计     的控制器
myapp.controller("provinceMonthPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期

    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['北京', '广东', '上海', '天津', '重庆', '辽宁', '江苏',"湖北","四川","陕西",
        "河北","山西","河南","吉林","黑龙江","内蒙古","山东","安徽","浙江","福建","湖南","广西","江西","贵州",
        "云南","西藏","海南","","","",""];       //柱状图默X轴的单位
    $scope.echartsSeries=['100000','350000','567000','600078','600054', '530002','100000','300050',
        '500067','600078','650004', '500032','100000','300050','500067','600078','600054',
        '500032','100000','300050','500067','600078','600054','100000', '350000','100000','300000'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=45;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#provinceMonthPackageTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//   流量包 超高用户日统计    的控制器
myapp.controller("superDayPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }
    $scope.choseDateStart =startDate;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期
    //日历插件的日期的6+1个月的设置
    //$scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期



//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"}
    ];


    $scope.warningHeadText=[{header:"EC(编码)"},{header:"订购(ID)"},{header:"归属省"},{header:"赠送套餐档位"},{header:"赠送时间"},{header:"开始时间"},{header:"结束时间"}];
    $scope.warningBodyText=[
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
    ];

    $scope.detailWindowShow=false;

    $scope.detailWindowFun=function($event){
        $scope.detailWindowShow=true;
    };
    $scope.windowCloseFun=function($event){
        $scope.detailWindowShow=false;
    };
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
        $(".superDayStatistics .tableOne thead th").each(function(index){
            var owidth=0;
            if($(this).width()>160){
                owidth=160;
            }else if ($(this).width()<90){
                owidth=90;
            }else {
                owidth=Math.ceil($(this).width());
            }
            $(".superDayStatistics .tableTwo tbody tr td").eq(index).width(owidth);
            $(this).width(owidth)
        });
        $(".superDayStatistics .ascrail2000-hr").css({"display":"none"});
    });



}]);

//  流量包  超高用户月统计    的控制器
myapp.controller("superMonthPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期
    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",dangwei:"全部",bussiness:"24"}
    ];


    $scope.warningHeadText=[{header:"EC(编码)"},{header:"订购(ID)"},{header:"归属省"},{header:"赠送套餐档位"},{header:"赠送时间"},{header:"开始时间"},{header:"结束时间"}];
    $scope.warningBodyText=[
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
    ];

    $scope.detailWindowShow=false;

    $scope.detailWindowFun=function($event){
        $scope.detailWindowShow=true;
    };
    $scope.windowCloseFun=function($event){
        $scope.detailWindowShow=false;
    };
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
        $(".superMonthStatistics .tableOne thead th").each(function(index){
            var owidth=0;
            if($(this).width()>160){
                owidth=160;
            }else if ($(this).width()<90){
                owidth=90;
            }else {
                owidth=Math.ceil($(this).width());
            }
            $(".superMonthStatistics .tableTwo tbody tr td").eq(index).width(owidth);
            $(this).width(owidth)
        });
        $(".superMonthStatistics .ascrail2000-hr").css({"display":"none"});
    });


    $scope.btnFun=function($event){
    }

}]);

//   流量包  套餐档位日统计     的控制器
myapp.controller("gearDayPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.orderTypeArray=[      //订购下拉菜单的所有选项，这种id，name的结构不许变
        {"id":"000","name":"--请选择--"},
        {"id":"111","name":"套餐费2万元"},
        {"id":"222","name":"套餐费3万元"},
        {"id":"333","name":"套餐费4万元"},
        {"id":"444","name":"套餐费5万元"},
        {"id":"555","name":"套餐费6万元"},
        {"id":"666","name":"套餐费7万元"},
        {"id":"777","name":"套餐费8万元"},
        {"id":"888","name":"套餐费9万元"},
        {"id":"999","name":"套餐费10万元"},
        {"id":"1010","name":"套餐费11万元"},
        {"id":"11011","name":"套餐费12万元"}
    ];

        $scope.orderTypeShow=false;      //订购类型 下拉菜单的初始状态是隐藏
        $scope.orderTypeName="--请选择--";    //订购类型 初始默认选项内容
        $scope.orderTypeId="000";        //订购类型 初始默认选项id

    $scope.orderTypeSelectInputFun=function($event){
        $scope.orderTypeShow=!$scope.orderTypeShow;
        $event.stopPropagation();
    };

    $scope.orderTypeSelectOptionFun=function(name,id,$event){
        $scope.orderTypeName=name;
        $scope.orderTypeId=id;
        $scope.orderTypeShow=false;
        $event.stopPropagation();
    };





    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.orderTypeShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['全时段3元10M', '全时段5元30M', '全时段10元70M', '全时段20元150M', '全时段30元500M',
        '全时段50元1024M', '全时段70元2048M',"全时段100元3072M","全时段130元4096M","全时段180元6144M", "全时段10元100M"];//柱状图默X轴的单位
    $scope.echartsSeries=['100000','350000','567000','600078','600054', '530002','100000','300050',
        '500067','600078','650004'];  //柱状图默Y轴的单位
    $scope.echartsRotate=20;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="10%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-10-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"1578"},
        {time:"2016-01-25",city:"广东省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-11-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"158"},
        {time:"2016-01-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-11-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"57"},
        {time:"2016-12-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-03-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-06-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-04-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"15728"},
        {time:"2016-05-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"58"},
        {time:"2016-08-25",city:"广东省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-07-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-08-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"1578"},
        {time:"2016-01-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"718"},
        {time:"2016-10-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"1278"},
        {time:"2016-08-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"2578"},
        {time:"2016-01-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-08-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"512"},
        {time:"2016-12-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-01-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-08-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-02-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-01-25",city:"广西省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"78"},
        {time:"2016-02-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"57"},
        {time:"2016-08-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-07-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-10-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"5178"},
        {time:"2016-08-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"5478"},
        {time:"2016-09-25",city:"广西省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#gearDayPackageTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//  流量包   套餐档位月统计     的控制器
myapp.controller("gearMonthPackage", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.orderTypeArray=[      //订购下拉菜单的所有选项，这种id，name的结构不许变
        {"id":"000","name":"--请选择--"},
        {"id":"111","name":"套餐费2万元"},
        {"id":"222","name":"套餐费3万元"},
        {"id":"333","name":"套餐费4万元"},
        {"id":"444","name":"套餐费5万元"},
        {"id":"555","name":"套餐费6万元"},
        {"id":"666","name":"套餐费7万元"},
        {"id":"777","name":"套餐费8万元"},
        {"id":"888","name":"套餐费9万元"},
        {"id":"999","name":"套餐费10万元"},
        {"id":"1010","name":"套餐费11万元"},
        {"id":"11011","name":"套餐费12万元"}
    ];

    $scope.orderTypeShow=false;      //订购类型 下拉菜单的初始状态是隐藏
    $scope.orderTypeName="--请选择--";    //订购类型 初始默认选项内容
    $scope.orderTypeId="000";        //订购类型 初始默认选项id

    $scope.orderTypeSelectInputFun=function($event){
        $scope.orderTypeShow=!$scope.orderTypeShow;
        $event.stopPropagation();
    };

    $scope.orderTypeSelectOptionFun=function(name,id,$event){
        $scope.orderTypeName=name;
        $scope.orderTypeId=id;
        $scope.orderTypeShow=false;
        $event.stopPropagation();
    };





    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.orderTypeShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['全时段3元10M', '全时段5元30M', '全时段10元70M', '全时段20元150M', '全时段30元500M',
        '全时段50元1024M', '全时段70元2048M',"全时段100元3072M","全时段130元4096M","全时段180元6144M", "全时段10元100M"];//柱状图默X轴的单位
    $scope.echartsSeries=['100000','350000','567000','600078','600054', '530002','100000','300050',
        '500067','600078','650004'];  //柱状图默Y轴的单位
    $scope.echartsRotate=20;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="10%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-10-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"1578"},
        {time:"2016-01-25",city:"广东省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-11-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"158"},
        {time:"2016-01-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-11-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"57"},
        {time:"2016-12-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-03-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-06-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-04-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"15728"},
        {time:"2016-05-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"58"},
        {time:"2016-08-25",city:"广东省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-07-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-08-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"1578"},
        {time:"2016-01-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"718"},
        {time:"2016-10-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"1278"},
        {time:"2016-08-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"2578"},
        {time:"2016-01-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-08-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"512"},
        {time:"2016-12-25",city:"上海市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-01-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-08-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-02-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-01-25",city:"广西省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"78"},
        {time:"2016-02-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"57"},
        {time:"2016-08-25",city:"天津市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-07-25",city:"湖南省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"},
        {time:"2016-10-25",city:"北京市",dangwei:"全时段指定用户定额70元2048M",businessNumber:"5178"},
        {time:"2016-08-25",city:"河北省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"5478"},
        {time:"2016-09-25",city:"广西省",dangwei:"全时段指定用户定额70元2048M",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#gearMonthPackageTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//     流量池     流量日统计   的控制器
myapp.controller("flowDayPool", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期



    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;

    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });

    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="MB";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['2017-04-01', '2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06',
        '2017-04-07',"2017-04-08","2017-04-09","2017-04-10", "2017-04-11","2017-04-12","2017-04-13",
        "2017-04-14","2017-04-15","2017-04-16","2017-04-17"];       //统计图默X轴的单位
    $scope.echartsSeries=['4000000','3500000','5000670','6000078','6000054', '5000032','5000000','3000500',
        '5060007','6070008','6000054', '5000032','4000000','3000500','5000067','3000050'];                                                 //统计图默Y轴的单位
    $scope.echartsRotate=55;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="13%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#flowDayPoolTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//    流量池   流量月统计    的控制器
myapp.controller("flowMonthPool", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    //统计图   的参数配置
    $scope.echartsShow=true;      //柱状图显示
    $scope.echartsNoData=false;   //柱状图默认有数据
    $scope. echartsUnit="MB";     //柱状图默Y轴的单位
    $scope.echartsxAxis= ['2016-10', '2016-11', '2016-12', '2017-01', '2016-02', '2016-03', '2016-04'];       //柱状图默X轴的单位
    $scope.echartsSeries=['10000000','35000000','567000','6780000','6540000', '7320000','6360000'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=0;       // 柱状图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#flowMonthPoolTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//   流量池  分省日统计     的控制器
myapp.controller("provinceDayPool", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;

    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="MB";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['北京', '广东', '上海', '天津', '重庆', '辽宁', '江苏',"湖北","四川","陕西",
        "河北","山西","河南","吉林","黑龙江","内蒙古","山东","安徽","浙江","福建","湖南","广西","江西","贵州",
        "云南","西藏","海南","","","",""];       //柱状图默X轴的单位
    $scope.echartsSeries=['100000','350000','567000','600078','600054', '530002','100000','300050',
        '500067','600078','650004', '500032','100000','300050','500067','600078','600054',
        '500032','100000','300050','500067','600078','600054','100000', '350000','100000','300000'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=45;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#provinceDayPoolTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//   流量池  分省月统计     的控制器
myapp.controller("provinceMonthPool", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期
    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


//    订购类型  的初始数据，交互效果
    $scope.multipleOrderTypeArray = [
        {name: "5元30M", code: "100", status: false},
        {name: "10元70M", code: "200", status: false},
        {name: "20元300M", code: "300", status: false},
        {name: "30元500M", code: "400", status: false},
        {name: "50元700M", code: "500", status: false},
        {name: "70元1G", code: "600", status: false},
        {name: "100元2G", code: "700", status: false},
        {name: "150元3G", code: "800", status: false},
        {name: "200元5G", code: "900", status: false},
        {name: "300元7G", code: "110", status: false},
        {name: "400元10G", code: "120", status: false},
        {name: "500元20G", code: "130", status: false},
        {name: "600元30G", code: "140", status: false},
        {name: "700元50M", code: "150", status: false},
        {name: "800元70M", code: "160", status: false}
    ];

    $scope.multipleOrderTypeName = "全部";   //初始文本框的内容
    $scope.multipleOrderTypeId="100,200,300,400,500,600,700,800,900,110,120,130,140,150,160";
    $scope.multipleOrderTypeNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.multipleOrderTypeIdInit = "";
    $scope.multipleOrderTypeShow = false;
//       套餐档位选项栏隐藏的事件
//    $scope.multipleSelectInputFun = function ($event) {
//        $scope.multipleOrderTypeNameInit = $scope.multipleOrderTypeName;  //初始值的保存
//        $scope.multipleOrderTypeIdInit = $scope.multipleOrderTypeId;
//        if($scope.multipleOrderTypeName=="全部"){
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                items.status = true;
//            });
//        }else{
//            var newArray=$scope.multipleOrderTypeName;
//            newArray = newArray.split(",");
//            angular.forEach($scope.multipleOrderTypeArray, function (items) {
//                angular.forEach(newArray, function (it) {
//                    if (items.name == it) {
//                        items.status = true;
//                    }
//                });
//            });
//        }
//        $scope.multipleOrderTypeShow = !$scope.multipleOrderTypeShow;  //显示隐藏的效果
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//      套餐档位全选事件
//    $scope.multipleSelectAllFun = function () {
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = true;
//        });
//    };
//     套餐档位反选事件
    //$scope.multipleSelectReverseFun= function () {
    //    angular.forEach($scope.multipleOrderTypeArray, function (items) {
    //        items.status = !items.status;
    //    });
    //};
//        套餐档位确认事件
//    $scope.multipleSelectSureFun= function ($event) {
//        $scope.multipleOrderTypeName = "";
//        $scope.multipleOrderTypeId="";
//
//        var newNameArray = [];
//        var newIdArray=[];
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            if (items.status == true) {
//                newNameArray.push(items.name);
//                newIdArray.push(items.code)
//            }
//        });
//
//        if(newNameArray.length==$scope.multipleOrderTypeArray.length){
//            $scope.multipleOrderTypeName = "全选";
//            $scope.multipleOrderTypeId = newIdArray.join();
//        }else{
//            $scope.multipleOrderTypeName = newNameArray.join();
//            $scope.multipleOrderTypeId = newIdArray.join();
//            if ($scope.multipleOrderTypeName == "") {
//                $scope.multipleOrderTypeName = "请选择";
//                $scope.multipleOrderTypeId="";
//            }
//        }
//        $scope.multipleOrderTypeShow = false; //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };
//         套餐档位取消事件
//    $scope.multipleSelectCancelFun = function ($event) {
//        $scope.multipleOrderTypeName=$scope.multipleOrderTypeNameInit;  //初始值的保存
//        $scope.multipleOrderTypeId=$scope.multipleOrderTypeIdInit;
//
//        angular.forEach($scope.multipleOrderTypeArray, function (items) {
//            items.status = false;
//        });
//        $scope.multipleOrderTypeShow = false;   //选项栏隐藏
//        $event.stopPropagation(); //防止冒泡事件的存在
//    };


    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });



    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="MB";     //统计图默Y轴的单位
    $scope.echartsxAxis= ['北京', '广东', '上海', '天津', '重庆', '辽宁', '江苏',"湖北","四川","陕西",
        "河北","山西","河南","吉林","黑龙江","内蒙古","山东","安徽","浙江","福建","湖南","广西","江西","贵州",
        "云南","西藏","海南","","","",""];       //柱状图默X轴的单位
    $scope.echartsSeries=['100000','350000','567000','600078','600054', '530002','100000','300050',
        '500067','600078','650004', '500032','100000','300050','500067','600078','600054',
        '500032','100000','300050','500067','600078','600054','100000', '350000','100000','300000'];                                                 //柱状图默Y轴的单位
    $scope.echartsRotate=45;       // 统计图X轴字体的旋转角度
    $scope.echartsBottom="6%";    // 统计图X轴字体距离底部的距离

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-03-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河南省",businessNumber:"178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-05-25",city:"河北省",businessNumber:"78"},
        {time:"2016-07-25",city:"河北省",businessNumber:"58"},
        {time:"2016-02-25",city:"河南省",businessNumber:"578"},
        {time:"2016-09-25",city:"河北省",businessNumber:"78"},
        {time:"2016-03-25",city:"河南省",businessNumber:"5718"},
        {time:"2016-07-25",city:"河北省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"58"},
        {time:"2016-01-25",city:"河北省",businessNumber:"5178"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-01-25",city:"河北省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-09-25",city:"河南省",businessNumber:"578"},
        {time:"2016-12-25",city:"河北省",businessNumber:"5718"},
        {time:"2016-11-25",city:"河北省",businessNumber:"578"},
        {time:"2016-10-25",city:"河北省",businessNumber:"578"}
    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听table中数据是否ng-repeat遍历完毕
        $("#provinceMonthPoolTableFenPage").DataTable({
            // "dom": '<"top"i>rt<"bottom"flp><"clear">',//展示有多少条数据信息
            // "bInfo": false, //页脚信息  跟上面的dom配合使用
            paging: true ,  //是否分页显示表格数据
            "pagingType":   "full_numbers",  //分页展现的格式
            //scrollY: 500px,  //超出500px出现滚动条
            //"scrollCollapse": "true",
            searching : false, //去掉搜索框方法一
            //bFilter": false, ////去掉搜索框方法二
            // "bSort": false, //是否支持排序功能
            "lengthChange": true, //是否允许用户改变表格每页显示的记录数
            "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
            ordering: true ,//是否需要排序
            iDisplayLength: 10, //每页显示10条记录
            columnDefs:[{
                orderable:false,//禁用排序
                // "serchable":false,  //禁用搜索
                // targets:[0]   //指定的列
            }
            ],
            //"aoColumns": [
            //    null,
            //    null,
            //    //{ "sType": "number-fate" },//自定义排序方式
            //    null,
            //    null,
            //    null
            //],
            // "aaSorting": [[1, "desc" ]],  //默认以第二列为默认排序,倒序排列
            //"aaSorting": [[1, "asc"  ]],  //默认以第二列为默认排序，正序排列
            // "aaSorting": [ [0,'asc'], [1,'asc'] ],
            //多语言配置
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo":"显示第_START_至_END_项结果，共_TOTAL_项","sInfoEmpty":"显示第0至0项结果，共0项",
                "sInfoEmtpy": "找不到相关数据",
                "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "搜索",
                "sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": '<i class="icon  icon-caret-left"></i>',
                    "sNext":   '<i class="icon icon-caret-right"></i>',
                    "sLast": " 尾页 "
                }
            }
        });
    });

}]);

//   流量池   超高用户日统计    的控制器
myapp.controller("superDayPool", ["$scope","$rootScope","$http","$state","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,$state,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    var choseDateStart="";
    var choseDateEnd="";
    var startDate="";
    var endDate="";
    var today=getDayFun(0);    //获取当天的日期
    var filter=today.substr(8,2) ;   //判断

    if(filter=="01"){  //如果当天是1号
        choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
        choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
        startDate=getY_M(-7)+"-01";
        endDate=lastMonth_lastDay();
    }else{
        choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
        choseDateEnd=getDayFun(-1);       //结束日期是昨天
        startDate=getY_M(-6)+"-01";
        endDate=getDayFun(-1);
    }
    $scope.choseDateStart =startDate;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期
    //日历插件的日期的6+1个月的设置
    //$scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期



    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01-25",phone:"13712345678",city:"河北省",bussiness:"24"},
    ];


    $scope.warningHeadText=[{header:"EC(编码)"},{header:"订购(ID)"},{header:"归属省"},{header:"赠送套餐档位"},{header:"赠送时间"},{header:"开始时间"},{header:"结束时间"}];
    $scope.warningBodyText=[
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
    ];

    $scope.detailWindowShow=false;

    $scope.detailWindowFun=function($event){
        $scope.detailWindowShow=true;
    };
    $scope.windowCloseFun=function($event){
        $scope.detailWindowShow=false;
    };
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
        $(".superDayPool .tableOne thead th").each(function(index){
            var owidth=0;
            if($(this).width()>160){
                owidth=160;
            }else if ($(this).width()<90){
                owidth=90;
            }else {
                owidth=Math.ceil($(this).width());
            }
            $(".superDayPool .tableTwo tbody tr td").eq(index).width(owidth);
            $(this).width(owidth)
        });
        $(".superDayPool .ascrail2000-hr").css({"display":"none"});
    });


     $scope.filterBtnFun=function($event){
         //$stateProvider.state("newsCenter", {
         //    url:"/newsCenter",
         //    templateUrl: "../EC_WEB/error.html"
         //});
     }

}]);

//  流量池  超高用户月统计    的控制器
myapp.controller("superMonthPool", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期
    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期



    //    EC编码/订购ID  的初始数据
    $scope.selectImportArray=ecIdSelectArray;
    $scope.selectImportShow=false;
    $scope.selectImportname="EC编码";   //初始默认选项内容
    $scope.selectImportID="000";
    $scope.selectImportNumber="";


    $scope.selectImportInputFun=function($event){
        $scope.selectImportShow=!$scope.selectImportShow;
        $event.stopPropagation();
    };

    $scope.selectImportOptionFun=function(name,id,$event){
        $scope.selectImportname=name;
        $scope.selectImportID=id;
        $scope.selectImportShow=false;
        $event.stopPropagation();
    };

//这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.selectImportShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2016-01",phone:"13712345678",city:"河北省",bussiness:"134321411111"},
        {time:"2016-06",phone:"13712345678",city:"河北省",bussiness:"4132412324"},
        {time:"2016-02",phone:"13712345678",city:"河北省",bussiness:"2432143214"},
        {time:"2016-01",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-11",phone:"13712345678",city:"河北省",bussiness:"232144"},
        {time:"2016-01",phone:"13712345678",city:"河北省",bussiness:"2441324123"},
        {time:"2016-02",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-08",phone:"13712345678",city:"河北省",bussiness:"285674"},
        {time:"2016-12",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01",phone:"13712345678",city:"河北省",bussiness:"241234"},
        {time:"2016-01",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-01",phone:"13712345678",city:"河北省",bussiness:"213244"},
        {time:"2016-11",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-09",phone:"13712345678",city:"河北省",bussiness:"2441234231"},
        {time:"2016-05",phone:"13712345678",city:"河北省",bussiness:"24"},
        {time:"2016-02",phone:"13712345678",city:"河北省",bussiness:"2566454"},
        {time:"2016-03",phone:"13712345678",city:"河北省",bussiness:"27674"},
    ];


    $scope.warningHeadText=[{header:"EC(编码)"},{header:"订购(ID)"},{header:"归属省"},{header:"赠送套餐档位"},{header:"赠送时间"},{header:"开始时间"},{header:"结束时间"}];
    $scope.warningBodyText=[
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {ECnumber:"上海玉辰信息技术有限公司(571019999571005258)",id:"通用流量统付产品(9003592968)",city:"黑龙江",dangwei:"指定用户限量叠加包0元10M",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
    ];

    $scope.detailWindowShow=false;

    $scope.detailWindowFun=function($event){
        $scope.detailWindowShow=true;
    };
    $scope.windowCloseFun=function($event){
        $scope.detailWindowShow=false;
    };
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
        $(".superMonthPool .tableOne thead th").each(function(index){
            var owidth=0;
            if($(this).width()>160){
                owidth=160;
            }else if ($(this).width()<90){
                owidth=90;
            }else {
                owidth=Math.ceil($(this).width());
            }
            $(".superMonthPool .tableTwo tbody tr td").eq(index).width(owidth);
            $(this).width(owidth)
        });
        $(".superMonthPool .ascrail2000-hr").css({"display":"none"});
    });


    $scope.btnFun=function($event){
    }

}]);

//   流量池  月使用量阶梯分布     的控制器
myapp.controller("ladderMonthPool", ["$scope","$rootScope","$http","citySelectArray","ecIdSelectArray", function($scope,$rootScope,$http,citySelectArray,ecIdSelectArray) {

    //日历插件的日期的初始设定
    $scope.choseDateStart =getY_M(-6);     //筛选的初始日期
    $scope.choseDateEnd = getY_M(0);   //筛选的截止始日期
    //日历插件的日期的6+1个月的设置
    $scope.startDate = getY_M(-6);   //限定起始日期
    $scope.endDate = getY_M(0) ;  //限定截止日期


    // 统计图   的参数配置
    $scope.echartsShow=true;      //统计图显示
    $scope.echartsNoData=false;   //统计图默认有数据
    $scope. echartsUnit="个";     //统计图默Y轴的单位
    $scope.echartsLegend= ['0-10000KB', '10001-50000KB', '50001-100000KB', '100001-1000000KB', '1000001-500000000KB'];       //柱状图默X轴的单位
    $scope.echartsSeries= [   {value:3686343, name:'0-10000KB'},
        {value:872471, name:'10001-50000KB'},
        {value:470547, name:'50001-100000KB'},
        {value:1880865, name:'100001-1000000KB'},
        {value:260630, name:'1000001-500000000KB'}];                                                 //柱状图默Y轴的单位
    $scope.echartsName="月使用量阶梯分布";       // 统计图中鼠标移入的显示文字
    $scope.selectedMode=true;    // 统计图是否禁止图例的点击事件

    //table表格   的参数配置
    $scope.tableArray=[
        {time:"2017-04",dangwei:"0-10000",number:"3686343",percent:"51.41"},
        {time:"2017-04",dangwei:"10001-50000",number:"872471",percent:"12.17"},
        {time:"2017-04",dangwei:"50001-100000",number:"470547",percent:"6.56"},
        {time:"2017-04",dangwei:"100001-1000000",number:"1880865",percent:"26.23"},
        {time:"2017-04",dangwei:"1000001-500000000",number:"260630",percent:"3.63"}
    ];


}]);

//     详单查询的控制器
myapp.controller("businessDetail", ["$scope","$rootScope","$location","$http","$document","User","citySelectArray", function($scope,$rootScope,$location,$http,$document,User,citySelectArray) {
    //配置页面样式，存储信息，
    $document[0].title="详单查询";
    User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式
    User.set("statisticsUrl","/statistics/order/monthStatistics");

    //EC 搜索框交互效果
    //初始化数据
    $scope.ECsearchName = "请输入EC名称搜索";   //初始文本框的内容
    $scope.ECsearchID = "0";           //初始文本框的内容ID
    $scope.ECinitName= "";            //作为记录保存初始文本框的内容变量  中间变量
    $scope.ECinitID = "";            //作为记录保存初始文本框的ID变量   中间变量
    $scope.ECsearchShow = false;


//     EC  Search搜索功能隐藏的事件
    $scope.ECsearchShowFun = function ($event) {
        $scope.ECinitName = $scope.ECsearchName;  //初始值的保存
        $scope.ECinitID = $scope.ECsearchID;
        $scope.ECsearchShow =true;  //显示隐藏的效果
        $event.stopPropagation(); //防止冒泡事件的存在
    };
//         Search搜索功能确认事件
    $scope.ECsureSearchFun = function ($event) {
        $scope.ECsearchShow = false; //选项栏隐藏
        $event.stopPropagation(); //防止冒泡事件的存在
    };

//          Search搜索功能取消事件
    $scope.ECcancelSearchFun = function ($event) {
        $scope.ECsearchName = $scope.ECinitName;
        $scope.ECsearchID = $scope.ECinitID;
        $scope.ECsearchShow = false;   //选项栏隐藏
        $event.stopPropagation(); //防止冒泡事件的存在
    };


    //  订购  筛选下拉框交互效果
    $scope.orderArray=[
        {"id":"000","name":"无订购"},
        {"id":"111","name":"订购1111"},
        {"id":"222","name":"订购2222"},
        {"id":"333","name":"订购3333"},
        {"id":"444","name":"订购订购订购订购订购订购4444"},
        {"id":"555","name":"订购5555"},
        {"id":"666","name":"订购6666"}
    ];

    $scope.orderShow=false;   //订购下拉菜单的初始状态是隐藏
    $scope.orderName="无订购";   //初始默认选项内容
    $scope.orderId="000";        //初始默认选项id


    //这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.orderShow=false;
        $scope.$apply(function(){});
         $event.stopPropagation();
    });

    //日历插件的日期的初始设定
   var choseDateStart="";
   var choseDateEnd="";
    var startDate="";
    var endDate="";
      var today=getDayFun(0);    //获取当天的日期
      var filter=today.substr(8,2) ;   //判断

      if(filter=="01"){  //如果当天是1号
          choseDateStart=getY_M(-1)+"-01";   //起始日期是上个月的第一天
          choseDateEnd=lastMonth_lastDay();  //结束日期是上个月的月末
          startDate=getY_M(-7)+"-01";
          endDate=lastMonth_lastDay();
      }else{
          choseDateStart=getY_M(0)+"-01";   //起始日期是本月的第一天
          choseDateEnd=getDayFun(-1);       //结束日期是昨天
          startDate=getY_M(-6)+"-01";
          endDate=getDayFun(-1);
      }

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期


    //归属省的多选下拉框交互效果
    //初始化数据
    $scope.cityArray = citySelectArray;
    $scope.cityName= "全部";   //初始文本框的内容
    $scope.cityId="100,220,311,351,471,240,431,451,210,250,571,551,591,791,531,371,270,731,200,898,771,230,280,851,871,891,290,931,971,951,991";             //选中归属省的ID
    $scope.cityNameInit = "";            //作为记录保存初始文本框的内容变量
    $scope.cityIdInit = "";              //作为记录保存初始ID的内容变量
    $scope.cityFilterShow = false;


    //手机号  输入框初始数据
    $scope.phoneNumber="";


    $scope.filterBtnFun=function($event){

  }

}]);

//     运营团队预警
myapp.controller("warningGroup", ["$scope","$rootScope","$http","$window","$document","User","$state", function($scope,$rootScope,$http,$window,$document,User,$state) {

    //配置页面样式，存储信息，

    $document[0].title="预警设置";
    $rootScope.navActive=0;    //这是在设置头部nav的链接样式
    User.set("navActive",0);              //这是在设置头部nav的链接样式
    User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式
    $scope.switchDisabled=false;

    $scope.linkman=[
        {name:"李四",phone:"",email:"106664453@qq.com"},
        {name:"张三",phone:"13716005154",email:""},
        {name:"李琦",phone:"13716005154",email:"1011104453@qq.com"}
    ];

    angular.forEach($scope.linkman,function(item){
        if(item.phone==""){
            item.phone="未填写"
        }
        if(item.email==""){
            item.email="未填写"
        }
    });

    $scope.warningText=[
        {option:"套餐包订购总量预警",number:"100",unit:"个",checked:true,disabled:false},
        {option:"套餐订购波动预警",number:"10",unit:"%",checked:true,disabled:false},
        {option:"流量池使用余量预警",number:"50",unit:"%",checked:false,disabled:false},
        {option:"流量池使用波动预警",number:"20",unit:"%",checked:false,disabled:false},
        {option:"流量池使用余量预警",number:"60",unit:"%",checked:false,disabled:false}
    ];

    $(".userName").focus(function(){
        $(this).removeClass("wrong")
    });

    $(".userEmail").focus(function(){
        $(this).removeClass("wrong");
        $(this).parents("form").find('.userPhone').removeClass("wrong")
    });

    $('.userPhone').focus(function(){
        $(this).removeClass("wrong");
        $(this).parents("form").find('.userEmail').removeClass("wrong");
    });


    var oldName="";    //申明变量，为获取旧的联系人的value做准备，各个函数用完时，变量清空
    var oldPhone="";   //申明变量，为获取旧的手机号的value做准备，各个函数用完时，变量清空
    var oldEmail="";   //申明变量，为获取旧的邮箱号的value做准备，各个函数用完时，变量清空

    var oldValue="";   //为了储存数值

    //   添加   用户信息事件
    $scope.addFun=function(target,$event){
        var nameFlag=false;   //说明此时该行的联系人的状态是错误的
        var  userName =$.trim($(target).parent().find(".userName").val().NoSpace());
        var  userPhone =$.trim($(target).parent().find(".userPhone").val().NoSpace());
        var  userEmail =$.trim($(target).parent().find(".userEmail").val().NoSpace());

        if(userName==''){   //先要判断联系人是不是填写了，这是判断的首要关键
            $(target).parent().find('.userName').addClass("wrong");
        }else{
            nameFlag=true;  //说明此时的联系人的状态是正确的状态；
        }
        if(nameFlag){   //这里说明联系人已经填写了，判断手机号跟邮箱号
            if(userPhone!=""||userEmail!=""){    //手机或邮箱必须有一个是要填写的
                if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                    if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                        $(target).parent().find('.userPhone').addClass("wrong");

                    }
                }
                if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                    if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                        $(target).parent().find('.userEmail').addClass("wrong")
                    }
                }
                if($(target).parent().find('.wrong').length==0){   //如果此时没有感叹号的提示状态，这说明此时是正确的填写
                    //这时再判断一下，邮箱跟手机号中，如果有一个是value是空，就赋值为未填写
                    if(userPhone==""){  userPhone="未填写"    }
                    if(userEmail==""){ userEmail="未填写"    }

                    // alert("发送一次post，向后台传递参数");  //把username、userphone、useremail发送给后台就行

                    var newObject={};
                    newObject.name=userName;
                    newObject.phone=userPhone;
                    newObject.email=userEmail;
                    $scope.linkman.push(newObject);

                    console.log($scope.linkman)

                    $(target).parent().find(".userName").val("");
                   $(target).parent().find(".userPhone").val("");
                   $(target).parent().find(".userEmail").val("");

                }
            }else{
                $(target).parent().find(".userPhone").addClass("wrong");
                $(target).parent().find(".userEmail").addClass("wrong");
                return false;
            }
        } else{   //如果联系人为空，但是手机号或邮箱号不为空就要进行表单验证了
            if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                    $(target).parent().find(".userPhone").addClass("wrong");
                }
            }
            if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(target).parent().find(".userEmail").addClass("wrong");
                }
            }
            return false;
        }

        $event.preventDefault();  //阻止默认事件

    };

    //   编辑   用户信息事件
    $scope.editFun=function(target,$event){

         //预警开关处于禁用状态
        $(target).parents(".waring-group").find(".switch").css({"opacity":"0.5"});
        $(target).parents(".waring-group").find(".switch").css({"filter":"alpha(opacity=50)"});
        $scope.switchDisabled=true;

        //为点击确认键，数据是否向后台发送post的判断做比较的准备
        //先获取当前行   旧的用户名，手机号，邮箱号
        oldName=$.trim($(target).parent().find(".userName").val().NoSpace());
        oldPhone=$.trim($(target).parent().find(".userPhone").val().NoSpace());
        oldEmail= $.trim($(target).parent().find(".userEmail").val().NoSpace());

        //判断手机号吗或邮箱号码哪一个是未填写，如果是未填写，清空当前的value
        if(oldPhone=="未填写"){$(target).parent().find('.userPhone').val("")}
        if(oldEmail=="未填写"){$(target).parent().find('.userEmail').val("")}

        $(target).parent().find(".editBtn").css("display","none");   //编辑按钮隐藏
        $(target).parent().find(".removeBtn").css("display","none");   //删除按钮隐藏
        $(target).parent().find(".sureBtn").css("display","inline-block");   //确认按钮显示
        $(target).parent().find(".cancelBtn").css("display","inline-block");  //取消按钮显示

        //这时，当前的input输入框显示，span隐藏   类型是text类型的是可以编辑的
        $(target).parent().find('.infor-span').hide();
        $(target).parent().find('input[type="text"]').show();

        $("input[src='../images/add.png']").prop("disabled",true);     //添加按钮都设置禁用；
        $("input[src='../images/mod.png']").prop("disabled",true);     //编辑按钮都设置禁用；
        $("input[src='../images/rem.png']").prop("disabled",true);     //删除按钮都设置禁用；

        $event.preventDefault();  //阻止默认事件
    };

//    删除   用户信息事件
    $scope.removeFun=function(target,$event){
        var  userName =$(target).parents("form").find(".userName").val();
        var  userPhone =$(target).parents("form").find(".userPhone").val();
        var  userEmail =$(target).parents("form").find(".userEmail").val();

        // alert("发送一次post，向后台传递参数");  //把username、userphone、useremail发送给后台就行


      //如果正剩下一个联系人时，要先确定预警都已经关闭了，才能删除
        if($scope.linkman.length<=1){
             if($(target).parents(".waring-group").find("input[type='checkbox']:checked").length>=1){
                   alert("请关闭预警开关")
             }else{
                 for(var i=0;i<$scope.linkman.length;i++){
                     if($scope.linkman[i].name==userName && $scope.linkman[i].phone==userPhone && $scope.linkman[i].email==userEmail){
                         $scope.linkman.splice(i, 1);
                         break;
                     }
                 }
            }
        }else{
            for(var i=0;i<$scope.linkman.length;i++){
                if($scope.linkman[i].name==userName && $scope.linkman[i].phone==userPhone && $scope.linkman[i].email==userEmail){
                    $scope.linkman.splice(i, 1);
                    break;
                }
            }
        }
    };

    //    确认   用户信息事件
    $scope.sureFun=function(target,index,$event){

        //预警开关处于启用状态
        $(target).parents(".waring-group").find(".switch").css({"opacity":"1"});
        //$(target).parents(".waring-group").find(".switch").css({"filter":"alpha(opacity=1)"});   IE9以下样式会出问题
        $scope.switchDisabled=false;

        var nameFlag=false;   //说明此时该行的联系人的状态是错误的

        var  userName =$.trim($(target).parent().find(".userName").val().NoSpace());
        var  userPhone =$.trim($(target).parent().find(".userPhone").val().NoSpace());
        var  userEmail =$.trim($(target).parent().find(".userEmail").val().NoSpace());

        var Othis= $(target);
        $(target).parent().find('.userName').focus(function(){
            Othis.parent().find('.userName').removeClass("wrong");
        });

        $(target).parent().find('.userPhone').focus(function(){
            Othis.parent().find('.userPhone').removeClass("wrong");
            Othis.parent().find('.userEmail').removeClass("wrong");
        });

        $(target).parent().find('.userEmail').focus(function(){
            Othis.parent().find('.userEmail').removeClass("wrong");
            Othis.parent().find('.userPhone').removeClass("wrong");
        });


        if(userName==''){   //先要判断联系人是不是填写了，这是判断的首要关键
            $(target).parent().find('.userName').addClass("wrong");
        }else{
            nameFlag=true;  //说明此时的联系人的状态是正确的状态；
        }


        if(nameFlag){   //这里说明联系人已经填写了，判断手机号跟邮箱号
            if(userPhone!=""||userEmail!=""){    //手机或邮箱必须有一个是要填写的
                if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                    if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                        $(target).parent().find('.userPhone').addClass("wrong");
                    }
                }
                if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                    if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                        $(target).parent().find('.userEmail').addClass("wrong")
                    }
                }

                if($(target).parent().find('.wrong').length==0){   //如果此时没有感叹号的提示状态，这说明此时是正确的填写
                    //这时再判断一下，邮箱跟手机号中，如果有一个是value是空，就赋值为未填写
                    if(userPhone==""){    userPhone="未填写"    }
                    if(userEmail==""){    userEmail="未填写"    }

                    //修改用户信息
                    var newObject={};
                    newObject.name=userName;
                    newObject.phone=userPhone;
                    newObject.email=userEmail;

                    $scope.linkman.splice(index,1);
                    $scope.linkman.splice(index,0, newObject);


                    $(target).parent().find(".sureBtn ").css("display","none");  //确认按钮隐藏
                    $(target).parent().find(".cancelBtn").css("display","none");  //取消按钮隐藏
                    $(target).parent().find(".editBtn").css("display","inline-block");   //编辑按钮显示
                    $(target).parent().find(".removeBtn").css("display","inline-block");  //删除按钮显示


                    //这时，当前的input类型是text类型的是不可以编辑的
                    $(target).parent().find('input[type="text"]').addClass("unread");
                    $(target).parent().find('input[type="text"]').attr("disabled","disabled");

                    //这时，当前的input输入框隐藏，span显示   是不可以编辑的
                    $(target).parent().find('.infor-span').show();
                    $(target).parent().find('input[type="text"]').hide();


                    //这时，当前的input类型是text类型是只读
                    $("input[src='../images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                    $("input[src='../images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                    $("input[src='../images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

                    //这里对比一下新旧数据，是否发生了变化，如果有变动，就发动一次post请求
                    if(userName!=oldName||userPhone!=oldPhone||userEmail!=oldEmail){
                      //  alert("发送一次post，告诉后台我编辑了哪些数据，哪些数据是要被替换掉的");
                        //这里发送的请求要告诉后台，我哪些旧的数据被替换了，旧的数据就是oldName、oldPhone、oldEmail
                    }

                    oldName="";    //变量清空，为下一次获取旧的联系人的value做准备
                    oldPhone="";   //变量清空，为下一次获取旧的手机号的value做准备
                    oldEmail="";   //变量清空，为下一次获取旧的邮箱号的value做准备
                }

            }else{
                $(target).parent().find('.userPhone').addClass("wrong");
                $(target).parent().find('.userEmail').addClass("wrong");
                return false;
            }

        } else{   //如果联系人为空，但是手机号或邮箱号不为空就要进行表单验证了

            if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                    $(target).parent().find('.userPhone').addClass("wrong");
                }
            }

            if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(target).parent().find('.userEmail').addClass("wrong");
                }
            }
            return false;
        }
    };

    //    取消   用户信息事件
    $scope.cancelFun=function(target,index,$event){

        //预警开关处于启用状态
        $(target).parents(".waring-group").find(".switch").css({"opacity":"1"});
        //$(target).parents(".waring-group").find(".switch").css({"filter":"alpha(opacity=1)"});    IE9以下样式会出问题
        $scope.switchDisabled=false;

        //点击取消，说明用户不想进行修改了，联系人，手机号，邮箱号还应该是之前的value；
        $(target).parent().find(".sureBtn ").css("display","none");  //确认按钮隐藏
        $(target).parent().find(".cancelBtn").css("display","none");  //取消按钮隐藏
        $(target).parent().find(".editBtn").css("display","inline-block");   //编辑按钮显示
        $(target).parent().find(".removeBtn").css("display","inline-block");  //删除按钮显示

        //这时，当前的input输入框隐藏，span显示   是不可以编辑的
        $(target).parent().find('.infor-span').show();
        $(target).parent().find('input[type="text"]').hide();

        $("input[src='../images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
        $("input[src='../images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
        $("input[src='../images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

        //防止有感叹号警告的出现，如果出现清除这个感叹号编辑,是清除当前的
        $(target).parent().find('.userName').removeClass("wrong");
        $(target).parent().find('.userPhone').removeClass("wrong");
        $(target).parent().find('.userEmail').removeClass("wrong");

        var newObject={};
        newObject.name=oldName;
        newObject.phone=oldPhone;
        newObject.email=oldEmail;

        $scope.linkman.splice(index,1);
        $scope.linkman.splice(index,0, newObject);
    };


    $scope.editTextFun=function(target,index,$event){
        //通过当前行中checkbox的checked的值，去判断开关状态，true是开启，false是关闭

        var state= $(target).parents("form").find("input[type='checkbox']").prop("checked");

        if(state){   //说明处于开启状态

            $(target).hide();  //编辑图标隐藏
            $(target).parent().find(".onEdit").show();  //确认图标显示;

            oldValue=$.trim($(target).parent().find("input[type='text']").val());
            //获取当前行文本框的值，进行变量储存，如果更改的新值不等于旧值，向后台发送数据

            $(target).parent().find(".waring-number").hide();
            $(target).parent().find("input[type='text']").show();
            //当前文本框可以进行修改；

            //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是禁用的；
            $("input[src='../images/add.png']").prop("disabled",true);     //添加按钮都设置禁用；
            $("input[src='../images/mod.png']").prop("disabled",true);     //编辑按钮都设置禁用；
            $("input[src='../images/rem.png']").prop("disabled",true);     //删除按钮都设置禁用；

        }else{
            return false;
        }

        $event.preventDefault();//阻止默认事件；
    };

    $scope.correctTextFun=function(target,index,$event){

        var newValue=$.trim($(target).parent().find("input[type='text']").val().NoSpace());
        //获取当前行文本框的值，进行验证是不是一个数字，进行变量储存，与oldValue进行比较，不等于旧值，向后台发送数据

        if( newValue!=""){      //如果此时的值不为空

            if((/^(\+)?\d+$/.test(newValue))){   //输入的是个大于0的正整数,说明输入成功了
                newValue=parseInt(newValue);   //以防数字前有0的出现;这才是当前输入正确的value
                $scope.warningText[index].number=newValue;  //判别new的值正确时，赋给当warningText
                //此时的确认(对勾)变为图标编辑图标
                $(target).hide();
                $(target).parent().find(".offEdit").show();

                //当前文本框可以不可进行修改；
                $(target).parent().find(".waring-number").show();
                $(target).parent().find("input[type='text']").hide();

                //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是禁用的；
                $("input[src='../images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                $("input[src='../images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                $("input[src='../images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；


                //如果新编辑的值newValue不等于旧值oldValue，向后台发送post请求
                if(newValue!=oldValue){
                    //alert("想后台发送newValue="+newValue)
                }
                oldValue="";  //变量清空，为下一次获取旧的value做准备
                console.log($scope.warningText);
            }else{
                return false
            }
        }else{  //说明此时为空

            $scope.warningText[index].number="0";  //将0赋给当前的文本框
            //此时的确认(对勾)变为图标编辑图标
            $(target).hide();
            $(target).parent().find(".offEdit").show();

            //当前文本框可以不可进行修改；
            $(target).parent().find(".waring-number").show();
            $(target).parent().find("input[type='text']").hide();

            //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是禁用的；
            $("input[src='../images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
            $("input[src='../images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
            $("input[src='../images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

            oldValue="";  //变量清空，为下一次获取旧的value做准备
            console.log($scope.warningText);
        }

        $event.preventDefault();//阻止默认事件；

    };

    $scope.switchFun=function(target,index,$event){

        if(!$(target).parent().find("input[type='checkbox']").prop("disabled")){   //如果不是禁用状态，就进行开关的样式修改
                    if($(target).parent().find("input[type='checkbox']").is(":checked")){
                        $(target).animate({opacity:0},100,function(){
                            $(target).css({"background-image":"url('../images/off-icon.png')"});
                            $(target).animate({opacity:1},100)
                        });
                        $(target).parent().find("input[type='checkbox']").prop("checked",false);
                        $(target).parents("form").find("label").css({"color":"#cccccc"});
                        console.log("关闭+发送ajax请求");

                        if(oldValue!=""){
                            $scope.warningText[index].number=oldValue;  //将之前旧值赋给当前的文本框
                            //此时的确认(对勾)变为图标编辑图标
                            $(target).parents("form").find(".onEdit").hide();
                            $(target).parents("form").find(".offEdit").show();

                            //当前文本框可以不可进行修改；
                            $(target).parents("form").find(".waring-number").show();
                            $(target).parents("form").find("input[type='text']").hide();

                            //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是禁用的；
                            $("input[src='../images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                            $("input[src='../images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                            $("input[src='../images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；
                            oldValue="";  //变量清空，为下一次获取旧的value做准备
                        }


                        $scope.warningText[index].checked=false;

                        console.log($scope.warningText);
                    }else {
                        $(target).animate({opacity:0},100,function(){
                            $(target).css({"background-image":"url('../images/on-icon.png')"});
                            $(target).animate({opacity:1},100)
                        });
                        $(target).parent().find("input[type='checkbox']").prop("checked",true);
                        $(target).parents("form").find("label").css({"color":"#404040"});
                        console.log("打开+发送ajax请求");
                        $scope.warningText[index].checked=true;
                        console.log($scope.warningText);
                    }
                }

        $event.stopPropagation();
        $event.preventDefault();  //阻止默认事件
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
        //页面一加载自动生成开关按钮
        mySwitch();
    });

    function mySwitch(){
        $(".switch").each(function(index){
            var disabled= $(this).find("input[type='checkbox']").prop("disabled");
            if(disabled){   //如果当前的，复选框是被禁用的情况
                $(this).css({"opacity":"0.5"});
                $(this).css({"filter":"alpha(opacity=50)"});
                $(this).parents("form").find("label").css({"color":"#cccccc"})
            }

            //根据复选框的状态去动态生成    关闭或打开的效果
            if($(this).find("input[type='checkbox']").is(":checked")){
                $(this).find("span").css({"background-image":"url('../images/on-icon.png')"});
            }else {
                $(this).find("span").css({"background-image":"url('../images/off-icon.png')"});
                $(this).parents("form").find("label").css({"color":"#cccccc"})
            }

//              给当前的开关绑定点击事件
//         $(this).click(function(event){
//                if(!$(this).find("input[type='checkbox']").prop("disabled")){   //如果不是禁用状态，就进行开关的样式修改
//                    if($(this).find("input[type='checkbox']").is(":checked")){
//
//                        $(this).find("span").animate({opacity:0},100,function(){
//                            $(this).css({"background-image":"url('../images/off-icon.png')"});
//                            $(this).animate({opacity:1},100)
//                        });
//                        $(this).find("input[type='checkbox']").prop("checked",false);
//                        $(this).parents("form").find("label").css({"color":"#cccccc"});
//
//                        console.log("关闭");
//                        $scope.warningText[index].checked=false;
//                        console.log($scope.warningText);
//
//                    }else {
//                        $(this).find("span").animate({opacity:0},100,function(){
//                            $(this).css({"background-image":"url('../images/on-icon.png')"});
//                            $(this).animate({opacity:1},100)
//                        });
//                        $(this).find("input[type='checkbox']").prop("checked",true);
//                        $(this).parents("form").find("label").css({"color":"#404040"});
//                        console.log("打开");
//                        $scope.warningText[index].checked=true;
//                        console.log($scope.warningText);
//                    }
//                }
//
//                event.preventDefault();  //阻止默认事件  防止事件执行两次
//            })

        });
    }

    $scope. historyInforBtn=function(){   //历史信息的时间跳转
        $state.go('newsCenter',{argumentsId:"222",argumentsName:"预警提醒"});
    }

}]);

//    EC预警  控制器模板
myapp.controller("waringEc", ["$scope","$rootScope","$http","$window","$document","User","$state", function($scope,$rootScope,$http,$window,$document,User,$state) {

    //配置页面样式，存储信息，
    $document[0].title="预警设置";
    $rootScope.navActive=0;    //这是在设置头部nav的链接样式
    User.set("navActive",0);              //这是在设置头部nav的链接样式
    User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式

    $scope.waringText=[
        {title:"定向流量统付产品(9003430111)",phone:"13716005154",email:"",
        infor:[{name:"单用户日使用量超高",number:"39",unit:"KB",checked:true,disabled:false},
              {name:"单用户月使用量超高",number:"50",unit:"KB",checked:true,disabled:false},
              {name:"单订购日使用量超高",number:"103",unit:"KB",checked:true,disabled:false},
              {name:"单订购月使用量超高",number:"130",unit:"KB",checked:true,disabled:false},
              {name:"单订购月业务量环比增幅超高",number:"90",unit:"%",checked:true,disabled:false},
              {name:"分省月业务量环比增幅超高",number:"45",unit:"%",checked:false,disabled:false}
        ]},
        {title:"定向流量统付产品(9003529222)",phone:"",email:"1007804453@qq.com",
            infor:[{name:"单用户日使用量超高",number:"39",unit:"KB",checked:false,disabled:false},
                {name:"单用户月使用量超高",number:"50",unit:"KB",checked:false,disabled:false},
                {name:"单订购日使用量超高",number:"103",unit:"KB",checked:false,disabled:false},
                {name:"单订购月使用量超高",number:"130",unit:"KB",checked:false,disabled:false},
                {name:"单订购月业务量环比增幅超高",number:"90",unit:"%",checked:false,disabled:false},
                {name:"分省月业务量环比增幅超高",number:"45",unit:"%",checked:false,disabled:false}
            ]},
        {title:"定向流量统付产品(9003430333)",phone:"13716005154",email:"",
            infor:[{name:"单用户日使用量超高",number:"39",unit:"KB",checked:false,disabled:false},
                {name:"单用户月使用量超高",number:"50",unit:"KB",checked:false,disabled:false},
                {name:"单订购日使用量超高",number:"103",unit:"KB",checked:false,disabled:false},
                {name:"单订购月使用量超高",number:"130",unit:"KB",checked:false,disabled:false},
                {name:"单订购月业务量环比增幅超高",number:"90",unit:"%",checked:false,disabled:false},
                {name:"分省月业务量环比增幅超高",number:"45",unit:"%",checked:false,disabled:false}
            ]},
        {title:"定向流量统付产品(9003430444)",phone:"",email:"1007804453@qq.com",
            infor:[{name:"单用户日使用量超高",number:"39",unit:"KB",checked:false,disabled:false},
                {name:"单用户月使用量超高",number:"50",unit:"KB",checked:false,disabled:false},
                {name:"单订购日使用量超高",number:"103",unit:"KB",checked:false,disabled:false},
                {name:"单订购月使用量超高",number:"130",unit:"KB",checked:false,disabled:false},
                {name:"单订购月业务量环比增幅超高",number:"90",unit:"%",checked:false,disabled:false},
                {name:"分省月业务量环比增幅超高",number:"45",unit:"%",checked:false,disabled:false}
            ]}
    ];
    angular.forEach( $scope.waringText ,function(item){
        if(item.phone==""){
            item.phone="未填写"
        }
        if(item.email==""){
            item.email="未填写"
        }
    });


     //编辑按钮的事件
    $scope.editFun=function(target,index,$event){

         //先禁用所有的按钮，当时只有当前的保存，取消按钮处于启用状态
        $(target).parents(".waring-ec").find("button").prop("disabled",true);
        $(target).parents(".waring-box").find(".saveBtn").prop("disabled",false);
        $(target).parents(".waring-box").find(".cancelBtn").prop("disabled",false);
        // input输入框显示，span文本框隐藏  编辑按钮，历史信息按钮隐藏， 保存，取消按钮显示
         $(target).parents(".waring-box").find("input[type='text']").show();
         $(target).parents(".waring-box").find(".text-box").hide();
         $(target).parents(".waring-box").find(".editBtn").hide();
         $(target).parents(".waring-box").find(".historyBtn").hide();
         $(target).parents(".waring-box").find(".saveBtn").show();
         $(target).parents(".waring-box").find(".cancelBtn").show();

        //禁用所有的按钮
        $(target).parents(".waring-ec").find(".switch").css({"opacity":"0.5"});
        $(target).parents(".waring-ec").find(".switch").css({"filter":"alpha(opacity=50)"});
        $(target).parents(".waring-ec").find(".switch input[type='checkbox']").prop("disabled",true);

        var userInforValue=$(target).parents(".waring-box").find(".user-infor label");
        $.each(userInforValue,function(){
           var  value= $.trim($(this).find(".text-box").html().NoSpace());
            if(value=="未填写"){
                $(this).find("input[type='text']").val("")
            }else{
                $(this).find("input[type='text']").val(value)
            }
        });

        var waringText=$(target).parents(".waring-box").find(".waring-text .label-text");
        $.each(waringText,function(){
            var  value=$.trim($(this).find(".text-box").html().NoSpace());
            $(this).find("input[type='text']").val(value)
        })

    };

     //保存按钮的事件
    $scope.saveFun=function(target,index,$event){

        var newPhone=$.trim($(target).parents(".waring-box").find(".userPhone").val().NoSpace());
        var newEmail=$.trim($(target).parents(".waring-box").find(".userEmail").val().NoSpace());

        //首要的判断依据是，手机号与邮箱号不能同时为空，必须填写一个
        if(newPhone!=""||newEmail!=""){
            if(newPhone!=""){   //如果手机不为空，对手机进行表单验证
                if(!newPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                    $(target).parents(".waring-box").find(".userPhone").addClass("wrong");
                }
            }
            if(newEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                if(newEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(target).parents(".waring-box").find(".userEmail").addClass("wrong")
                }
            }

            //对流量包预警的判断
            judeNum ($(target));
            if($(target).parents(".waring-box").find('.wrong').length==0){  //如果此时没有感叹号的提示状态，这说明此时是正确的填写
                //这时再判断一下，邮箱跟手机号中，如果有一个是value是空，就赋值为未填写
                if(newPhone==""){    newPhone="未填写"    }
                if(newEmail==""){    newEmail="未填写"    }
                $(target).parents(".waring-box").find(".userPhone").val(newPhone);
                $(target).parents(".waring-box").find(".userEmail").val(newEmail);


                 //这里发送ajax请求给后台

                var newObject=$scope.waringText[index];

                newObject.phone=newPhone;
                newObject.email=newEmail;

                $.each($(target).parents(".waring-box").find(".label-text input[type='text']"),function(index,item){
                    var newValue=$(this).val();
                    newObject.infor[index].number=newValue;
                });


                $scope.waringText.splice(index,1);
                $scope.waringText.splice(index,0, newObject);

                // 启用所有的按钮
                $(target).parents(".waring-ec").find("button").prop("disabled",false);
                // input输入框隐藏，span文本框显示  编辑按钮，历史信息按钮显示， 保存，取消按钮隐藏
                $(target).parents(".waring-box").find("input[type='text']").hide();
                $(target).parents(".waring-box").find(".text-box").show();
                $(target).parents(".waring-box").find(".editBtn").show();
                $(target).parents(".waring-box").find(".historyBtn").show();
                $(target).parents(".waring-box").find(".saveBtn").hide();
                $(target).parents(".waring-box").find(".cancelBtn").hide();

                //启用所有的按钮
                $(target).parents(".waring-ec").find(".switch").css({"opacity":"1"});
                //$(target).parents(".waring-ec").find(".switch").css({"filter":"alpha(opacity=1)"});
                $(target).parents(".waring-ec").find(".switch input[type='checkbox']").prop("disabled",false);

            }

        }else{   //说明手机号跟，邮箱号同时为空
            $(target).parents(".waring-box").find(".userPhone").addClass("wrong");//给手机文本框警告
            $(target).parents(".waring-box").find(".userEmail").addClass("wrong");//给邮箱文本框警告
            //对流量包预警的判断
            judeNum ($(target));
        }

    };

    function judeNum (othis){   //对流量包预警判断的函数

        $.each(othis.parents(".waring-box").find(".label-text input[type='text']"),function(){
            var newNum=$.trim($(this).val().NoSpace());
            if(newNum!=""){   //如果流量包预警部不为空
                if((/^(\+)?\d+$/.test(newNum))){   //输入的是个大于0的正整数,说明输入成功了
                    newNum=parseInt(newNum);   //以防数字前有0的出现;这才是当前输入正确的value
                    $(this).val(newNum);//判别new的值正确时，赋给当前的文本框
                }else{
                    $(this).addClass("wrong");
                    //通过验证后，填写错误，给客户提示警告
                }
            }else{   //流量包预警部为空,则赋值为0；
                $(this).val("0")
            }

        }) ;
    }

    //取消按钮的事件
      $scope.cancelFun=function(target,index,$event){
          // 启用所有的按钮
          $(target).parents(".waring-ec").find("button").prop("disabled",false);

          // input输入框隐藏，span文本框显示  编辑按钮，历史信息按钮显示， 保存，取消按钮隐藏
          $(target).parents(".waring-box").find("input[type='text']").hide();
          $(target).parents(".waring-box").find(".text-box").show();
          $(target).parents(".waring-box").find(".editBtn").show();
          $(target).parents(".waring-box").find(".historyBtn").show();
          $(target).parents(".waring-box").find(".saveBtn").hide();
          $(target).parents(".waring-box").find(".cancelBtn").hide();

          //启用所有的按钮
          $(target).parents(".waring-ec").find(".switch").css({"opacity":"1"});
          //$(target).parents(".waring-ec").find(".switch").css({"filter":"alpha(opacity=1)"});
          $(target).parents(".waring-ec").find(".switch input[type='checkbox']").prop("disabled",false);


      };


    //   开关按钮  绑定事件
    $scope.switchFun=function(target,parentIndex,index,$event){
        if(!$(target).parents(".switch").find("input[type='checkbox']").prop("disabled")){   //如果不是禁用状态，就进行开关的样式修改

            if($(target).parents(".switch").find("input[type='checkbox']").is(":checked")){

                $(target).animate({opacity:0},100,function(){
                    $(target).css({"background-image":"url('../images/off-icon.png')"});
                    $(target).animate({opacity:1},100)
                });

                $(target).parents(".switch").find("input[type='checkbox']").prop("checked",false);
                $(target).parents(".waring-text>div").find("label").css({"color":"#cccccc"});
                console.log("关闭+发送ajax请求");
                $scope.waringText[parentIndex].infor[index].checked=false;

            }else {

                $(target).animate({opacity:0},100,function(){
                    $(target).css({"background-image":"url('../images/on-icon.png')"});
                    $(target).animate({opacity:1},100)
                });
                $(target).parents(".switch").find("input[type='checkbox']").prop("checked",true);
                $(target).parents(".waring-text>div").find("label").css({"color":"#404040"});
                console.log("打开+发送ajax请求");
                $scope.waringText[parentIndex].infor[index].checked=true;

            }
        }

        $event.stopPropagation();
        $event.preventDefault();  //阻止默认事件
    };

    $scope. historyInforBtn=function(){   //历史信息的时间跳转
        $state.go('newsCenter',{argumentsId:"222",argumentsName:"预警提醒"});
    };


    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕
        $(".waring-ec  .waring-box:first").css({"border":"1px #fff dashed"});

        // 给手机文本框添加，聚焦时value为空，清除感叹号标志
        $("body").on("focus",".waring-box .userPhone",function(){
            $(this).removeClass("wrong"); //清除当前的感叹号标志
            $(this).parents(".waring-box").find(".userEmail").removeClass("wrong");//清除邮箱的感叹号标志
        });

        $("body").on("focus",".waring-box .userEmail",function(){
            $(this).removeClass("wrong"); //清除当前的感叹号标志
            $(this).parents(".waring-box").find(".userPhone").removeClass("wrong");//清除邮箱的感叹号标志
        });

        $("body").on("focus",".waring-box .label-text input[type='text']",function(){
            $(this).removeClass("wrong"); //清除当前的感叹号标志
        });

        mySwitch();
    });

    function mySwitch(){

        $(".waring-ec .switch").each(function(index){
            var disabled= $(this).find("input[type='checkbox']").prop("disabled");

            if(disabled){   //如果当前的，复选框是被禁用的情况
                $(this).css({"opacity":"0.5"});
                $(this).css({"filter":"alpha(opacity=50)"});
                $(this).parents(".waring-text>div").find("label").css({"color":"#cccccc"})
            }

            //根据复选框的状态去动态生成    关闭或打开的效果
            if($(this).find("input[type='checkbox']").is(":checked")){
                $(this).find("span").css({"background-image":"url('../images/on-icon.png')"});
            }else {
                $(this).find("span").css({"background-image":"url('../images/off-icon.png')"});
                $(this).parents(".waring-text>div").find("label").css({"color":"#cccccc"})
            }

//              给当前的开关绑定点击事件
//         $(this).click(function(event){
//                if(!$(this).find("input[type='checkbox']").prop("disabled")){   //如果不是禁用状态，就进行开关的样式修改
//                    if($(this).find("input[type='checkbox']").is(":checked")){
//
//                        $(this).find("span").animate({opacity:0},100,function(){
//                            $(this).css({"background-image":"url('../images/off-icon.png')"});
//                            $(this).animate({opacity:1},100)
//                        });
//                        $(this).find("input[type='checkbox']").prop("checked",false);
//                        $(this).parents("form").find("label").css({"color":"#cccccc"});
//
//                        console.log("关闭");
//                        $scope.warningText[index].checked=false;
//                        console.log($scope.warningText);
//
//                    }else {
//                        $(this).find("span").animate({opacity:0},100,function(){
//                            $(this).css({"background-image":"url('../images/on-icon.png')"});
//                            $(this).animate({opacity:1},100)
//                        });
//                        $(this).find("input[type='checkbox']").prop("checked",true);
//                        $(this).parents("form").find("label").css({"color":"#404040"});
//                        console.log("打开");
//                        $scope.warningText[index].checked=true;
//                        console.log($scope.warningText);
//                    }
//                }
//
//                event.preventDefault();  //阻止默认事件  防止事件执行两次
//            })

        });
    }


}]);

//    消息中心 控制器模板
myapp.controller("newsCenter", ["$scope","$rootScope","$http","$window","$document","$stateParams","User", function($scope,$rootScope,$http,$window,$document,$stateParams,User) {

    //配置页面样式，存储信息，
    $document[0].title="消息中心";
    $rootScope.navActive=0;    //这是在设置头部nav的链接样式
    User.set("navActive",0);              //这是在设置头部nav的链接样式
    User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式


    //为了接受从预警历史信息页面跳转过来传递的数值
    var argumentsId= $stateParams.argumentsId;
    var argumentsName= $stateParams.argumentsName;


    //消息中心的筛选条件的初始数据

    //日历插件的日期的初始设定  无默认日期，无日期的区间限制
    var choseDateStart="请选择";
    var choseDateEnd="请选择";
    var startDate="";
    var endDate="";

    $scope.choseDateStart =choseDateStart;     //筛选的初始日期
    $scope.choseDateEnd = choseDateEnd;   //筛选的截止始日期

    //日历插件的日期的6+1个月的设置
    $scope.startDate = startDate;   //限定起始日期
    $scope.endDate = endDate;  //限定截止日期


    //消息来源  下拉框的数据    (只有消息来源是：预警提醒时   订购的条件才会出现)
    $scope.newsSourceArray=[      //订购下拉菜单的所有选项，这种id，name的结构不许变
        {"id":"000","name":"全部"},
        {"id":"111","name":"系统消息"},
        {"id":"222","name":"预警提醒"},
        {"id":"333","name":"文件下载提醒"}
    ];

    $scope.newsSourceShow=false;      //消息来源 下拉菜单的初始状态是隐藏

    if(argumentsName!="预警提醒"){
        $scope.newsSourceName="全部";    //消息来源 初始默认选项内容
        $scope.newsSourceId="000";        //消息来源 初始默认选项id
        $scope.newsControlOrder=false;   //只有消息来源是：预警提醒时   订购的条件才会出现

    }else{
        $scope.newsSourceName=argumentsName;    //消息来源  说明是从预警页面过来的选项内容
        $scope.newsSourceId=argumentsId;        //消息来源  说明是从预警页面过来的选项id
        $scope.newsControlOrder=true;        //只有消息来源是：预警提醒时   订购的条件才会出现
    }


    $scope.newsSourceSelectInputFun=function($event){
        $scope.newsSourceShow=!$scope.newsSourceShow;
        $scope.orderShow=false;
        $event.stopPropagation();
    };

   $scope.newsSourceSelectOptionFun=function(name,id,$event){
       $scope.newsSourceName=name;
       $scope.newsSourceId=id;
       $scope.newsSourceShow=false;

       if(name=="预警提醒"){
           $scope.newsControlOrder=true;
           $scope.orderName="无订购";   //订购 初始默认选项内容
           $scope.orderId="000";        //订购  初始默认选项id
       }else{
           $scope.newsControlOrder=false;
       }
       $event.stopPropagation();
   };



    //订购 下拉框的数据    (只有消息来源是：预警提醒时 订购的条件才会出现)
    $scope.orderArray=[      //订购下拉菜单的所有选项，这种id，name的结构不许变
        {"id":"000","name":"无订购"},
        {"id":"111","name":"订购（11111111111111111111111111）"}
    ];

    $scope.orderName="无订购";   //订购 初始默认选项内容
    $scope.orderId="000";
    $scope.orderShow=false;      //订购下拉菜单的初始状态是隐藏

    $scope.orderSelectInputFun=function($event){
        $scope.orderShow=!$scope.orderShow;
        $scope.newsSourceShow=false;
        $event.stopPropagation();
    };

    $scope.orderSelectOptionFun=function(name,id,$event){
        $scope.orderName=name;
        $scope.orderId=id;
        $scope.orderShow=false;
        $event.stopPropagation();
    };


    //这个给整个的文档添加事件   这要是下拉菜单都要有
    angular.element(document).bind("click",function($event){
        $scope.orderShow=false;
        $scope.newsSourceShow=false;
        $scope.$apply(function(){});
        $event.stopPropagation();
    });


    //获取关键字
    $scope.keyword="";


    $scope.filterBtnFun=function($event){
    };




    $scope.warningHeadText=[{header:"手机"},{header:"归属省"},{header:"赠送套餐档位"},{header:"赠送时间"},{header:"开始时间"},{header:"结束时间"}]
    $scope.warningBodyText=[
        {phone:"13701699536",city:"河北省位赠送河北省位赠",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-252016-01-252016-01-252016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"},
        {phone:"13701699536",city:"河北省位赠送",dangwei:"5元10G位赠送",presentTime:"2016-01-25",starTime:"2016-01-25",endTime:"2016-01-25"}
    ];
    $scope.detailWindowShow=false;

    $scope.detailWindowFun=function($event){
        $scope.detailWindowShow=true;
    };
    $scope.windowCloseFun=function($event){
        $scope.detailWindowShow=false;
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {    //监听数据是否ng-repeat遍历完毕

        $(".new-center .tableOne thead th").each(function(index){
            var owidth=0;
            if($(this).width()>160){
                owidth=160;
            }else if ($(this).width()<90){
                owidth=90;
            }else {
                owidth=Math.ceil($(this).width());
            }
            $(".new-center .tableTwo tbody tr td").eq(index).width(owidth);
            $(this).width(owidth)
        });
        $(".new-center .ascrail2000-hr").css({"display":"none"});
    });

}]);

//    下载列表 控制器模板
myapp.controller("downList", ["$scope","$rootScope","$http","$window","$document","User", function($scope,$rootScope,$http,$window,$document,User) {

    //配置页面样式，存储信息，
    $document[0].title="下载列表";
    $rootScope.navActive=0;    //这是在设置头部nav的链接样式
    User.set("navActive",0);              //这是在设置头部nav的链接样式
    User.set("leftNavTab",0);              //这是在设置左部导航nav的链接样式
}]);

//   控制器模板
myapp.controller("Controller", ["$scope","$rootScope","$http","$http","$window","$document","User", function($scope,$rootScope,$http,$window,$document,User) {
    $document[0].title="";
}]);
