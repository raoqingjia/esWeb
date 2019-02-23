/**
 * Created by Administrator on 2017/3/10.
 */

//angular中所有的指令

// 详单查询，业务明细   的日期插件  起始日期跟截止日期都在同一个月里    起始日期的指令
myapp.directive('inTheSameMonthStart',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="inTheSameMonthStart" ng-model="choseDateStart" placeholder="起始日期" readonly>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $(element).val($scope.choseDateStart).datepicker({
                language:  'zh-CN',
                autoclose:true,
                format:'yyyy-mm-dd',
                startView: 0,
                maxViewMode: 2,
                minViewMode:0,
                todayHighlight:false,
                startDate:$scope.startDate,
                endDate:$scope.endDate
            }).on('changeDate',function (e){


                //得到现实中昨天的日期
                var  yesterdayValue;
                realityYesterday ();
                function  realityYesterday (){
                    var today = new Date();
                    today.setDate(today.getDate()-1);//获取AddDayCount天后的日期
                    var y = today.getFullYear();
                    var m = today.getMonth()+1;//获取当前月份的日期
                    m = m<10 ? '0'+m : m;
                    var d = today.getDate();
                    d = d<10 ? '0'+d : d;
                    yesterdayValue= y+"-"+m+"-"+d;
                    return yesterdayValue
                }

                //得到你选择开始日历插件中数值
                var ChoseStart=$(this).val();

                //得到你选择结束日历插件中数值
                var ChoseEnd=$scope.choseDateEnd ;

                //得到你选择开始日历插件中这个月的最后一天
                var dt= e.date;
                var ChoseMonthEnd;
                getLastDay(dt);
                function getLastDay(dt){
                    dt.setDate(1);
                    dt.setMonth(dt.getMonth()+1);
                    var cdt = new Date(dt.getTime()-1000*60*60*24);
                    var y=cdt.getFullYear();
                    var m=Number(cdt.getMonth())+1;
                    m = m<10 ? '0'+m : m;
                    var d=cdt.getDate();
                    d = d<10 ? '0'+d : d;
                    ChoseMonthEnd=y+"-"+m+"-"+d;
                    return ChoseMonthEnd
                }
                //通过开始日期中的选择时间，设置结束日期的起始日期
                $("#inTheSameMonthEnd").datepicker("setStartDate", ChoseStart);  //设置结束期日历的起始日期

                //先判断开始，结束日期是否在同一个月中
                var statrMonth=parseInt(ChoseStart.substr(5,2));  //先获取开始日期的月份
                var endMonth=parseInt(ChoseEnd.substr(5,2));     //先获取截止日期的月份

                var ChoseStartNum=parseInt(ChoseStart.replace(/-/ig, ""));  //先获取开始日期的数字大小
                var ChoseEndNum=parseInt(ChoseEnd.replace(/-/ig, ""));    //先获取截止日期的数字大小

                var ChoseMonthEndNum=parseInt(ChoseMonthEnd.replace(/-/ig, ""));  //先获取当月月末日期的数字大小
                var yesterdayValueNum=parseInt(yesterdayValue.replace(/-/ig, ""));   //先获取现实中昨天数字大小

                // 先判断开始日期跟结束日期是不是在同一个月
                if(statrMonth==endMonth){   //说明开始日期跟结束日期在同一月

                    if(ChoseStartNum>ChoseEndNum){   //如果起始日期大于结束日期；重新设置结束时间得截止时间
                        //判断这个月过没过完
                        if(yesterdayValueNum<ChoseMonthEndNum){   //说明这个月已过完
                            //如果现实中，这个月还没到月末，截止时间就不能设置为当月月底，设置到昨天
                            $scope.choseDateEnd=yesterdayValue;
                            $("#inTheSameMonthEnd").val(yesterdayValue);
                            $("#inTheSameMonthEnd").datepicker("setEndDate", yesterdayValue);
                        }else {  //说明这个月已还没过完
                            $scope.choseDateEnd=ChoseMonthEnd;
                            $("#inTheSameMonthEnd").val(ChoseMonthEnd);
                            $("#inTheSameMonthEnd").datepicker("setEndDate", ChoseMonthEnd);
                        }

                    }
                }else {   //说明开始日期跟结束日期不在同一月

                    //判断这个月过没过完
                    if(yesterdayValueNum<ChoseMonthEndNum){
                        //这个月还没到月末，截止时间就不能设置为当月月底，设置到昨天
                        $scope.choseDateEnd=yesterdayValue;
                        $("#inTheSameMonthEnd").val(yesterdayValue);
                        $("#inTheSameMonthEnd").datepicker("setEndDate", yesterdayValue);

                    }else { //说明这个月已还没过完
                        $scope.choseDateEnd=ChoseMonthEnd;
                        $("#inTheSameMonthEnd").val(ChoseMonthEnd);
                        $("#inTheSameMonthEnd").datepicker("setEndDate", ChoseMonthEnd);
                    }
                }
                $scope.$apply(function(){});
            });
        }
    }
});
// 详单查询，业务明细   的日期插件  起始日期跟截止日期都在同一个月里    结束日期的指令
myapp.directive('inTheSameMonthEnd',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="inTheSameMonthEnd" ng-model="choseDateEnd" placeholder="结束日期" readonly>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $(element).val($scope.choseDateEnd).datepicker({
                language:  'zh-CN',
                autoclose: true,
                format:'yyyy-mm-dd',
                startView:0,   //日期时间插鼠标点击之后首先显示的视图，是日期页面，月份页面，年份页面
                maxViewMode: 2,
                minViewMode:0,
                todayHighlight:false,  //如果为true, 高亮当前日期
                startDate:$scope.choseDateStart,
                endDate:$scope.endDate
            }).on('changeDate',function (ev){
                $scope.choseDateEnd=$(this).val();
                $scope.$apply(function(){});

            });
        }
    }
});


//消息中心      起始日期不能在截止日期之后，截止日期不能在起始日期之前  日期格式是yyyy-mm-dd    起始日期的指令
myapp.directive('dayFilterStart',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="dayFilterStart" ng-model="choseDateStart" placeholder="结束日期" readonly>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $(element).val($scope.choseDateStart).datepicker({
                language:  'zh-CN',
                autoclose: true,
                format:'yyyy-mm-dd',
                startView:0,
                maxViewMode: 2,
                minViewMode:0,
                todayHighlight:false,  //如果为true, 高亮当前日期
                startDate:$scope.startDate,
                endDate:$scope.choseDateEnd
            }).on('changeDate',function (e){
                $scope.choseDateStart=$(this).val();
                $("#dayFilterEnd").datepicker("setStartDate", $(this).val());
                $scope.$apply(function(){});
            });
        }
    }
});
//消息中心      起始日期不能在截止日期之后，截止日期不能在起始日期之前  日期格式是yyyy-mm-dd    结束日期的指令
myapp.directive('dayFilterEnd',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="dayFilterEnd" ng-model="choseDateEnd" placeholder="结束日期" readonly>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $(element).val($scope.choseDateEnd).datepicker({
                language:  'zh-CN',
                autoclose: true,
                format:'yyyy-mm-dd',
                startView:0,   //日期时间插鼠标点击之后首先显示的视图，是日期页面，月份页面，年份页面
                maxViewMode: 2,
                minViewMode:0,
                todayHighlight:false,  //如果为true, 高亮当前日期
                startDate:$scope.choseDateStart,
                endDate:$scope.endDate
            }).on('changeDate',function (e){
                $scope.choseDateEnd=$(this).val();
                $("#dayFilterStart").datepicker("setEndDate", $(this).val());
                $scope.$apply(function(){});
            });
        }
    }
});



// 起始日期不能在截止日期之后，截止日期不能在起始日期之前  日期格式是yyyy-mm    起始日期的指令

myapp.directive('monthFilterStart',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="monthFilterStart" ng-model="choseDateStart" placeholder="结束日期" readonly>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $(element).val($scope.choseDateStart).datepicker({
                language:  'zh-CN',
                autoclose: true,
                format:'yyyy-mm',
                startView:1,
                maxViewMode: 2,
                minViewMode:1,
                todayHighlight:false,  //如果为true, 高亮当前日期
                startDate:$scope.startDate,
                endDate:$scope.choseDateEnd
            }).on('changeDate',function (e){
                $scope.choseDateStart=$(this).val();
                $("#monthFilterEnd").datepicker("setStartDate", $(this).val());
                $scope.$apply(function(){});
            });
        }
    }
});

// 起始日期不能在截止日期之后，截止日期不能在起始日期之前  日期格式是yyyy-mm    截止日期的指令
myapp.directive('monthFilterEnd',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="monthFilterEnd" ng-model="choseDateEnd" placeholder="结束日期" readonly>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $(element).val($scope.choseDateEnd).datepicker({
                language:  'zh-CN',
                autoclose: true,
                format:'yyyy-mm',
                startView:1,   //日期时间插鼠标点击之后首先显示的视图，是日期页面，月份页面，年份页面
                maxViewMode: 2,
                minViewMode:1,
                todayHighlight:false,  //如果为true, 高亮当前日期
                startDate:$scope.choseDateStart,
                endDate:$scope.endDate
            }).on('changeDate',function (e){
                $scope.choseDateEnd=$(this).val();
                $("#monthFilterStart").datepicker("setEndDate", $(this).val());
                $scope.$apply(function(){});
            });
        }
    }
});


//新专线2,0  审批不通过 起始日期的指令
myapp.directive('onlyMonthStartBar',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="monthStart"  ng-model="monthStart" placeholder="起始日期" readonly>',
        replace:true,
        link : function(scope,element,attrs,ctrl){
            $(element).val(scope.monthStart).datepicker({
                language:  'zh-CN',
                autoclose:true,
                format:'yyyy-mm',
                startView: 'year',
                maxViewMode:2,
                minViewMode:1,
                todayHighlight:false,
                startDate:scope.startDate,
                endDate:scope.monthEnd
            }).on('changeDate',function (ev){
                scope.monthStart=$(this).val();
                scope.startDate=$(this).val();
                var object=document.getElementById("monthEnd");
                $(object).datepicker("setStartDate",scope.startDate);

                var m= one_year_later($(this).val());
                var n=getY_M(-1);
                m= m.replace(/-/ig, "");
                m=parseInt(m);
                n= n.replace(/-/ig, "");
                n=parseInt(n);

                if(m>n){
                    $(object).datepicker("setEndDate",getY_M(-1));
                }else{
                    $(object).datepicker("setEndDate",one_year_later($(this).val()));
                }

                function one_year_later(date){
                    var data=date;
                    var n=11;    //向后推11个月
                    var y =data.substring(0,4);   //获取年份
                    y=parseInt(y);
                    var m = data.substring(5,7);    //获取月份
                    m=parseInt(m);
                    m += n;
                    y += parseInt(m / 12);
                    m %= 12;
                    if(m < 1){
                        y--;
                        m = 12 + m;
                    }
                    return y + "-" + ((m < 10) ? ("0" + m) : m);
                }

                function getY_M(n){
                    var y = new Date().getFullYear();   //获取年份
                    var m = new Date().getMonth()+1;    //获取月份
                    m += n;
                    y += parseInt(m / 12);
                    m %= 12;
                    if(m < 1){
                        y--;
                        m = 12 + m;
                    }
                    return y + "-" + ((m < 10) ? ("0" + m) : m);
                }

                scope.$apply(function(){});
            })
        }
    }
});
//新专线2,0  审批不通过  结束日期的指令
myapp.directive('onlyMonthEndBar',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="monthEnd"   ng-model="monthEnd" placeholder="结束日期" readonly>',
        replace:true,
        link : function(scope,element,attrs,ctrl){
            $(element).val(scope.monthEnd).datepicker({
                language:  'zh-CN',
                autoclose:true,
                format:'yyyy-mm',
                startView: 'year',
                maxViewMode:2,
                minViewMode:1,
                todayHighlight:false,
                startDate:scope.monthStart,
                endDate:scope.endDate
            }).on('changeDate',function (ev){
                scope.monthEnd=$(this).val();
                scope.endDate=$(this).val();
                var object=document.getElementById("monthStart");
                $(object).datepicker("setEndDate", scope.endDate);


                var m= one_year_ago($(this).val());
                m= m.replace(/-/ig, "");
                m=parseInt(m);
                if(m<=201601){
                    $(object).datepicker("setStartDate","2016-01");
                }else {
                    $(object).datepicker("setStartDate", one_year_ago($(this).val()));
                }
                function one_year_ago(date){
                    var data=date;
                    var n=-11;    //向前推11个月
                    var y =data.substring(0,4);   //获取年份
                    y=parseInt(y);
                    var m = data.substring(5,7);    //获取月份
                    m=parseInt(m);
                    m += n;
                    y += parseInt(m / 12);
                    m %= 12;
                    if(m < 1){
                        y--;
                        m = 12 + m;
                    }
                    return y + "-" + ((m < 10) ? ("0" + m) : m);
                }
                scope.$apply(function(){});
            })
        }
    }
});

//新专线2,0  所有，竣工的  起始日期的指令
myapp.directive('onlyMonthStartPie',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="monthStart"  ng-model="monthStart" placeholder="起始日期" readonly>',
        replace:true,
        link : function(scope,element,attrs,ctrl){
            $(element).val(scope.monthStart).datepicker({
                language:  'zh-CN',
                autoclose:true,
                format:'yyyy-mm',
                startView: 'year',
                maxViewMode:2,
                minViewMode:1,
                todayHighlight:false,
                startDate:scope.startDate,
                endDate:scope.monthEnd
            }).on('changeDate',function (ev){
                scope.monthStart=$(this).val();
                scope.startDate=$(this).val();
                var object=document.getElementById("monthEnd");
                $(object).datepicker("setStartDate",scope.startDate);


                var m= one_year_later($(this).val());
                var n=getY_M(-1);
                m= m.replace(/-/ig, "");
                m=parseInt(m);

                n= n.replace(/-/ig, "");
                n=parseInt(n);

                if(m>n){
                    $(object).datepicker("setEndDate",getY_M(-1));
                }else{
                    $(object).datepicker("setEndDate",one_year_later($(this).val()));
                }

                function one_year_later(date){
                    var data=date;
                    var n=23;    //向后推23个月
                    var y =data.substring(0,4);   //获取年份
                    y=parseInt(y);
                    var m = data.substring(5,7);    //获取月份
                    m=parseInt(m);
                    m += n;
                    y += parseInt(m / 12);
                    m %= 12;
                    if(m < 1){
                        y--;
                        m = 12 + m;
                    }
                    return y + "-" + ((m < 10) ? ("0" + m) : m);
                }

                function getY_M(n){
                    var y = new Date().getFullYear();   //获取年份
                    var m = new Date().getMonth()+1;    //获取月份
                    m += n;
                    y += parseInt(m / 12);
                    m %= 12;
                    if(m < 1){
                        y--;
                        m = 12 + m;
                    }
                    return y + "-" + ((m < 10) ? ("0" + m) : m);
                }

                scope.$apply(function(){});
            })
        }
    }
});
//新专线2,0  所有，竣工的结束日期的指令
myapp.directive('onlyMonthEndPie',function(){
    return {
        restrict : 'EA',
        scope:false,
        template : '<input type="text" class="filter-date" id="monthEnd"   ng-model="monthEnd" placeholder="结束日期" readonly>',
        replace:true,
        link : function(scope,element,attrs,ctrl){
            $(element).val(scope.monthEnd).datepicker({
                language:  'zh-CN',
                autoclose:true,
                format:'yyyy-mm',
                startView: 'year',
                maxViewMode:2,
                minViewMode:1,
                todayHighlight:false,
                startDate:scope.monthStart,
                endDate:scope.endDate
            }).on('changeDate',function (ev){
                scope.monthEnd=$(this).val();
                scope.endDate=$(this).val();
                var object=document.getElementById("monthStart");
                $(object).datepicker("setEndDate", scope.endDate);


                var m= one_year_ago($(this).val());
                m= m.replace(/-/ig, "");
                m=parseInt(m);
                if(m<=201601){
                    $(object).datepicker("setStartDate","2016-01");
                }else {
                    $(object).datepicker("setStartDate", one_year_ago($(this).val()));
                }
                function one_year_ago(date){
                    var data=date;
                    var n=-23;    //向前推23个月
                    var y =data.substring(0,4);   //获取年份
                    y=parseInt(y);
                    var m = data.substring(5,7);    //获取月份
                    m=parseInt(m);
                    m += n;
                    y += parseInt(m / 12);
                    m %= 12;
                    if(m < 1){
                        y--;
                        m = 12 + m;
                    }
                    return y + "-" + ((m < 10) ? ("0" + m) : m);
                }

                scope.$apply(function(){});
            })
        }
    }
});


//下面的这几个参数是给折线图准备的
var params = [];
var u= 0;
var t = 0;
//最基本的折线图效果，xy轴如果x轴的数据量过大，则进行数据过滤
myapp.directive('echartsLine', function() {
    return {
        scope: {
            id: "@",
            xaxis: "=",
            series: "=",
            unit:"=",
            rotate:"=",
            bottom:"="
        },
        restrict: 'E',
        template: '<div class="echarts-trend"  id="trend-line" ></div>',
        replace: true,
        link: function($scope, element, attrs, controller) {
            var     option = {
                color: ['#567bd0'],
                    tooltip : {
                        //formatter: "{b} :{c}"+$scope.unit,
                        formatter: function (params) {
                            var returnData = "";
                            for (var i=0;i<params.length;i++){
                                returnData = params[i].name +"&nbsp;"+":" +"&nbsp;"+  formatNum(params[i].value, $scope.unit);
                            }
                            return returnData;
                        },

                        trigger: 'axis'
                    },
                toolbox: {
                    show : true,
                    x:'94%',
                    y:'top',
                    feature : {
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                 grid: {
                     top:'12%',
                     left: '2%',
                     right: '2%',
                     bottom: $scope.bottom,
                     containLabel: true
                },
                dataZoom:{   //统计表放大功能
                    type:"inside",
                    show:true,
                    yAxisAxisIndex:[0],
                    start:0,
                    end:100,
                    formatter:function(){
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,//两端是否充满图表
                        data : $scope.xaxis ,//横轴数据
                        axisTick: {
                            alignWithLabel: true//横轴数据与刻度的位置
                        },
                      axisLabel:{
                    //X轴刻度配置
                      interval:0,  //0：刻度之间显示不间隔；auto:自动根据刻度个数和宽度自动设置间隔个数
                    //interval：就表示两个刻度之间是否间隔，填写数字表示间隔了多少，被间隔掉的数据不显示
                    //如果数值为0，才能调用formatter这个函数，调用f还会显示ormatter，只是间隔掉了刻度，数据
                      rotate:$scope.rotate,  //刻度字体倾斜程度
                       formatter:function(val,index){
                              if(index == 0){
                                  u++;
                              }
                              var timeLength = $scope.xaxis.length;
                              if(u == 1){
                                  if(t < timeLength){
                                      params.push(intervalEchartsLine( $scope.xaxis,val));
                                      t = t+1;
                                  }
                              }
                              if(containsEchartsLine(params,val)){
                                  return val;
                              }else{
                                  return "";
                              }


                          }
            }
                    }
                ],
                yAxis : [
                    {   name : '单位：'+$scope.unit,
                        type : 'value',
                        axisLine: {show: false},//纵向坐标轴线
                        axisTick: {show: false},//纵轴刻度线
                        splitLine: {show: false},//横向间隔线
                        splitArea: {show: true},
                        axisLabel : {
                            formatter: '{value}'
                        },
                        nameTextStyle: {
                            fontFamily: '微软雅黑'
                        }
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'line',
                        smooth:true,
                        symbolSize: [8, 8],  //拐点的大小设置
                        symbol : 'emptyCircle',  //拐点的类型，emptyCircle空心圆   circle是实心圆  star 多边形  arrow三角
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    shadowColor : 'rgba(0,0,0,0.4)'
                                }
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: 'rgb(181,201,248)' // 0% 处的颜色
                                }, {
                                    offset: 0.8, color: 'rgb(240,245,254)' // 100% 处的颜色
                                }])
                            }
                        },
                        //纵轴数据
                        data:$scope.series
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById($scope.id));

            myChart.on('click', function (param) {
                var id="#"+$scope.id;
                var windowWidth=Math.ceil($(".echarts-window").width());
                var windowHeight=Math.ceil($(".echarts-window").height());

                var othisWidth=Math.ceil($(id).width());
                var othisHeight=Math.ceil($(id).height());
                var othisLeft=Math.ceil($(id).offset().left);
                var othisTop=Math.ceil($(id).offset().top);

                var x=othisWidth+othisLeft-windowWidth;
                var y=othisHeight+othisTop-windowHeight;
                if(param.seriesType=="line"){
                    $(id).on("click",function(ev){
                        // var e=ev||window.event;                 //事件对象
                        var  mouseX;
                        var  mouseY;
                        if(ev.pageX<x){   //如果左侧的弹出框没有超出统计表的边框
                            mouseX=ev.pageX;
                        }else{
                            mouseX=ev.pageX-windowWidth;
                        }
                        if(ev.pageY<y){
                            mouseY=ev.pageY-126;
                        }else{
                            mouseY=ev.pageY-windowHeight-126;
                        }
                        $(".echarts-window").css({"display":"block"});
                        $(".echarts-window").css({"left":mouseX+"px"});
                        $(".echarts-window").css({"top":mouseY+"px"});

                        $(id).off("click");          //解除绑定事件
                        ev.preventDefault();                     //阻止默认的快捷菜单显示
                        ev.stopPropagation();                    //阻止事件冒泡
                    });
                }
            });

            window.onresize = function(){
                window.onresize = myChart.resize
            };
            myChart.setOption(option);
        }
    };
});

//最基本的柱状图效果，xy轴无过滤条件
myapp.directive('echartsBar', function(){
    return {
        scope: {
            id: "@",
            xaxis: "=",
            series: "=",
            unit:"=",
            rotate:"=",
            bottom:"="
        },
        restrict: 'E',
        template: '<div class="echarts-trend"  id="trend-bar" ></div>',
        replace: true,
        link: function($scope, element, attrs, controller) {
            var option = {
                color: ['#34e1cf'],  //柱状图的颜色
                tooltip : {
                   //formatter: "{b} :{c}" +$scope.unit
                    formatter: function(params){  //这里一共有三个形参
                        //p.name是x轴数值 p.value是y轴数值
                        return  params.name+" : "+ formatNum(params.value,$scope.unit);
                    }
                },
                toolbox: {
                    show : true,
                    x:'94%',
                    y:'top',
                    feature : {
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                grid: {
                    top:'12%',
                    left: '2%',
                    right: '2%',
                    bottom: $scope.bottom,
                    containLabel: true
                },
                dataZoom:{   //统计表放大功能
                    type:"inside",
                    show:true,
                    yAxisAxisIndex:[0],
                    start:0,
                    end:100,
                    formatter:function(){
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        data :$scope.xaxis,
                        axisTick: {
                            //alignWithLabel: true
                        },
                        axisLabel:{
                            //X轴刻度配置
                            interval:0,  //0：刻度之间显示不间隔；auto:自动根据刻度个数和宽度自动设置间隔个数
                            //interval：就表示两个刻度之间是否间隔，填写数字表示间隔了多少，被间隔掉的数据不显示
                            //如果数值为0，才能调用formatter这个函数，调用f还会显示ormatter，只是间隔掉了刻度，数据
                            rotate:$scope.rotate  //刻度字体倾斜程度
                        }
                    }
                ],
                yAxis : [
                    {   name : '单位：'+$scope.unit,
                        type : 'value',
                        nameGap:20,
                        axisLine: {show: false},//纵向坐标轴线
                        axisTick: {show: false},//纵轴刻度线
                        splitLine: {show: false},//横向间隔线
                        splitArea: {show: true},
                        axisLabel : {
                            formatter: '{value}'
                        },
                        nameTextStyle: {
                            fontFamily: '微软雅黑',
                            fontSize: 12
                        }
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: '50%',
                        data:$scope.series
                    }
                ]
            };

            var myChart = echarts.init(document.getElementById($scope.id));

            myChart.on('click', function (param) {
                var id="#"+$scope.id;
                var windowWidth=Math.ceil($(".echarts-window").width());
                var windowHeight=Math.ceil($(".echarts-window").height());

                var othisWidth=Math.ceil($(id).width());
                var othisHeight=Math.ceil($(id).height());
                var othisLeft=Math.ceil($(id).offset().left);
                var othisTop=Math.ceil($(id).offset().top);

                var x=othisWidth+othisLeft-windowWidth;
                var y=othisHeight+othisTop-windowHeight;
                if(param.seriesType=="bar"){
                    $(id).on("click",function(ev){
                        // var e=ev||window.event;                 //事件对象
                        var  mouseX;
                        var  mouseY;
                        if(ev.pageX<x){   //如果左侧的弹出框没有超出统计表的边框
                            mouseX=ev.pageX;
                        }else{
                            mouseX=ev.pageX-windowWidth;
                        }
                        if(ev.pageY<y){
                            mouseY=ev.pageY-126;
                        }else{
                            mouseY=ev.pageY-windowHeight-126;
                        }
                        $(".echarts-window").css({"display":"block"});
                        $(".echarts-window").css({"left":mouseX+"px"});
                        $(".echarts-window").css({"top":mouseY+"px"});

                        $(id).off("click");          //解除绑定事件
                        ev.preventDefault();                     //阻止默认的快捷菜单显示
                        ev.stopPropagation();                    //阻止事件冒泡
                    });
                }
            });

            window.onresize = function(){
                window.onresize = myChart.resize
            };

            myChart.setOption(option);
        }
    };
});
//饼状图
myapp.directive('echartsPie', function() {
    return {
        scope: {
            id: "@",
            legend: "=",
            series: "=",
            unit:"=",
            name:"=",
            selected:"="
        },
        restrict: 'E',
        template: '<div class="echarts-trend" id="trend-pie" ></div>',
        replace: true,
        link: function($scope, element, attrs, controller) {
            var  option =  {
                title : {
                    //text: '某站点用户访问来源',    //这是饼图上的标题
                    //subtext: '纯属虚构',
                    x:'center',
                    textStyle: {
                        color: '#ccc'    //字体颜色的设置
                    }

                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a}<br/>{b} : {c}"+$scope.unit+"({d}%)"
                },
                //visualMap: {
                //            show:false,
                //             min: 800,
                //            max: 800,
                //            inRange: {
                //                colorLightness: [0, 1]
                //            }
                //    },
                legend: {
                    orient: 'vertical',       //这是提示文字的位置参数的设置
                    left: '2%',
                    top:'3%',
                    //itemGap:12,
                    data: $scope.legend,
                    selectedMode:$scope.selected  //禁止了图例的点击事件
                },

                //toolbox: {       //这是右侧工具刷新，下载为图片的样式
                //    show : true,
                //    feature : {
                //        mark : {show: true},
                //        dataView : {show: true, readOnly: false},
                //        restore : {show: true},
                //        saveAsImage : {show: true}
                //    }
                //},
                //calculable : true,

                series : [   //这是调饼状图的代码样式
                    {
                        name: $scope.name,
                        type: 'pie',
                        radius : '75%',   //这是饼图的大小
                        center: ['50%', '50%'],  //这是饼图在屏幕中的位置  第一个是左右，第二个是上下
                        data:$scope.series,
                        itemStyle: {    //下面的代码调的是饼状图被选中时的样式，可以不调节
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById($scope.id));
            window.onresize = function(){
                window.onresize = myChart.resize
            };
            myChart.setOption(option);


        }
    };

});

//table排序的属性指令
myapp.directive('tableSort', function() {
    return {
        scope: false,
        restrict: 'EA',
        link: function($scope, element, attrs, controller) {
            $(element).DataTable({
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

        }
    };

});

//table分页效果      （未用到、可删除） 加了个延迟 注意延迟思想
myapp.directive('tableFenPage',["$timeout",function($timeout) {
    return {
        scope: false,
        restrict: 'EA',
        link: function($scope, element, attrs, controller) {
            $timeout(function(){
                $(element).DataTable({
                    paging: true ,  //是否分页显示表格数据
                    "pagingType":   "full_numbers",  //分页展现的格式
                    searching : false, //去掉搜索框方法一
                    "lengthChange": true, //是否允许用户改变表格每页显示的记录数
                    "aLengthMenu": [[10, 25, 50,100, -1], ["10", "25", "50", "100","全部"]],//二组数组，第一组数
                    ordering: false ,//是否需要排序
                    iDisplayLength: 10, //每页显示10条记录
                    columnDefs:[{
                        orderable:false,//禁用排序
                    }
                    ],
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
            },0);

        }
    };

}]);

//监听ng-repeat是否执行完毕
myapp.directive('onFinishRender',['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished'); //事件通知
                });
            }
        }
    }
}]);

//niceScroll滚动条美化的效果
myapp.directive('niceScroll', function(){
    return {
        scope: false,
        restrict: 'EA',
        link: function($scope, element, attrs, controller) {
            $(element).niceScroll({
                cursorcolor: "#ccc",//#CC0071 光标颜色
                cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
                touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
                cursorwidth: "5px", //像素光标的宽度
                cursorborder: "0", // 	游标边框css定义
                cursorborderradius: "5px",//以像素为光标边界半径
                autohidemode: false, //是否隐藏滚动条
                horizrailenabled: false,
            });
        }
    };
});


// 过滤条件中  归属省选项的input文本框
myapp.directive('citySelectInput',function(){
    return {
        restrict : 'E',
        scope:false,
        template : '<input type="text" title="{{cityName}}" data="{{cityId}}" ng-model="cityName"  ng-click="selectCityShowFun($event)" class="filter-input input-select" readonly/>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.selectCityShowFun = function ($event) {
                $scope.cityNameInit = $scope.cityName;  //初始值的保存
                $scope.cityIdInit = $scope.cityId;  //初始值的保存

                //根据已选取的城市，在弹窗中勾选相对应的城市
                if($scope.cityName=="全部"){
                    angular.forEach($scope.cityArray, function (items) {
                        angular.forEach(items.city, function (ites) {
                            ites.status = true;
                        })
                    });
                }else{
                    var newArray = $scope.cityName;
                    newArray = newArray.split(",");
                    angular.forEach($scope.cityArray, function (items) {
                        angular.forEach(items.city, function (ites) {
                            angular.forEach(newArray, function (it) {
                                if (ites.name == it) {
                                    ites.status = true;
                                }
                            });
                        })
                    });
                }
                $scope.cityFilterShow = !$scope.cityFilterShow;  //显示隐藏的效果
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});
// 过滤条件中  归属省选项的全选按钮
myapp.directive('citySelectAll',function(){
    return {
        restrict : 'E',
        scope:false,
        template : '<button class="all btn btn-default btn-sm" ng-click="allCityFun($event)">全选</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.allCityFun = function ($event) {
                angular.forEach($scope.cityArray, function (items) {
                    angular.forEach(items.city, function (ites) {
                        ites.status = true;
                    })
                });
            };
        }
    }
});
// 过滤条件中  归属省选项的反选按钮
myapp.directive('citySelectReverse',function(){
    return {
        restrict : 'E',
        scope:false,
        template : '<button class="reverse btn btn-default btn-sm" ng-click="reverseCityFun($event)">反选</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.reverseCityFun = function ($event) {
                angular.forEach($scope.cityArray, function (items) {
                    angular.forEach(items.city, function (ites) {
                        ites.status = !ites.status;
                    })
                });
            };
        }
    }
});
// 过滤条件中  归属省选项的确认按钮
myapp.directive('citySelectSure',function(){
    return {
        restrict : 'E',
        scope:false,
        template : '<button class="btn btn-primary btn-sm" ng-click="sureCityFun($event)">确定</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.sureCityFun = function ($event) {
                $scope.cityName = "";
                $scope.cityId="";
                var newCityName = [];
                var newCityId = [];
                angular.forEach($scope.cityArray, function (items) {
                    angular.forEach(items.city, function (ites) {
                        if (ites.status == true) {
                            newCityName.push(ites.name)
                        }
                    })
                });
                angular.forEach($scope.cityArray, function (items) {
                    angular.forEach(items.city, function (ites) {
                        if (ites.status == true) {
                            newCityId.push(ites.code)
                        }
                    })
                });

                $scope.cityName = newCityName.join();
                $scope.cityId = newCityId.join();

                if ($scope.cityName == "") {
                    $scope.cityName ="请选择";
                    $scope.cityId="";
                }
                if($scope.cityName.length==142){   //当是142时说明31个省全被选中
                    $scope.cityName ="全部";
                }
                $scope.cityFilterShow = false; //选项栏隐藏
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});
// 过滤条件中  归属省选项的取消按钮
myapp.directive('citySelectCancel',function(){
    return {
        restrict : 'E',
        scope:false,
        template : '<button class="btn btn-sm" ng-click="cancelCityFun($event)">取消</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.cancelCityFun = function ($event) {
                $scope.cityName = $scope.cityNameInit;  //将初始值归还显示
                $scope.cityId = $scope.cityIdInit;  //将初始值归还显示

                //将所有选项默认都不勾选，等再次选择时，再通过cityName判断哪些选项
                angular.forEach($scope.cityArray, function (items) {
                    angular.forEach(items.city, function (ites) {
                        ites.status = false;
                    })
                });
                $scope.cityFilterShow = false;   //选项栏隐藏
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});

// 过滤条件中 单选下拉菜单的input
myapp.directive('selectInputFilter',function(){
    return {
        restrict : 'E',
        scope:{
            name:"=",
            code:"=",
            show:"="
        },
        template : '<input type="text"   readonly="readonly"  ng-click="selectInputFun($event)"  data="{{code}}" title="{{name}}" ng-model="name" class="filter-input input-select">',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.selectInputFun=function($event){
                $scope.show=!$scope.show;
                $event.stopPropagation();
            };
        }
    }
});
//过滤条件中 单选下拉菜单的option选项
myapp.directive('selectOptionFilter',[function(){
    return {
        restrict : 'E',
        scope:{
            items:"=",
            name:"=",
            code:"=",
            show:"="
        },
        template : '<a href="javascript:void(0);" ng-bind="items.name"  ng-click="selectOptionFun(items.name,items.id,$event)"></a>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
              //之所以 $scope.$parent.$parent.--     是因为这个指令是写在了ng-repeat中，它还自带作用域
                $scope.selectOptionFun=function(name,id,$event){
                $scope.name=name;
                $scope.code=id;
                $scope.show=false;
                $event.stopPropagation();
            };
        }
    }
}]);


//   过滤条件中  多选框的交互效果
//  多选框的input效果
myapp.directive('multipleSelectInputFun',function(){
    return {
        restrict :'E',
        scope:{
            selectArray:"=",
            selectName:"=",
            selectId:"=",
            selectNameInit:"=",
            selectIdInit:"=",
            selectShow:"="
        },
        template : '<input type="text"  title="{{selectName}}" code="{{selectId}}"  ng-click="multipleSelectInputFun($event)" ng-model="selectName" readonly="readonly" class="filter-input"/>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.multipleSelectInputFun = function ($event) {
                $scope.selectNameInit = $scope.selectName;  //初始值的保存
                $scope.selectIdInit = $scope.selectId;
                if($scope.selectName=="全部"){
                    angular.forEach($scope.selectArray, function (items) {
                        items.status = true;
                    });
                }else{
                    var newArray=$scope.selectName;
                    newArray = newArray.split(",");
                    angular.forEach($scope.selectArray, function (items) {
                        angular.forEach(newArray, function (it) {
                            if (items.name == it) {
                                items.status = true;
                            }
                        });
                    });
                }
                $scope.selectShow= true;  //显示隐藏的效果
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});

//  多选框的 全选效果
myapp.directive('multipleSelectAllFun',function(){
    return {
        restrict :'E',
        scope:{
            selectArray:"="
        },
        template : '<button class="all btn btn-default btn-sm" ng-click="multipleSelectAllFun($event)">全选</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.multipleSelectAllFun = function ($event) {
                angular.forEach($scope.selectArray, function (items) {
                    items.status = true;
                });
                $event.stopPropagation(); //防止冒泡事件的存在
            };

        }
    }
});

//  多选框的 反选效果
myapp.directive('multipleSelectReverseFun',function(){
    return {
        restrict :'E',
        scope:{
            selectArray:"="
        },
        template : '<button class="reverse btn btn-default btn-sm" ng-click="multipleSelectReverseFun($event)">反选</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.multipleSelectReverseFun= function ($event) {
                angular.forEach($scope.selectArray, function (items) {
                    items.status = !items.status;
                });
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});

//  多选框的 确认效果
myapp.directive('multipleSelectSureFun',function(){
    return {
        restrict :'E',
        scope:{
            selectArray:"=",
            selectName:"=",
            selectId:"=",
            selectNameInit:"=",
            selectIdInit:"=",
            selectShow:"="
        },
        template : '<button class="btn btn-primary btn-sm" ng-click="multipleSelectSureFun($event)">确定</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){
            $scope.multipleSelectSureFun= function ($event) {
                $scope.selectName = "";
                $scope.selectId="";

                var newNameArray = [];
                var newIdArray=[];
                angular.forEach($scope.selectArray, function (items) {
                    if (items.status == true) {
                        newNameArray.push(items.name);
                        newIdArray.push(items.code)
                    }
                });

                if(newNameArray.length==$scope.selectArray.length){
                    $scope.selectName = "全选";
                    $scope.selectId = newIdArray.join();
                }else{
                    $scope.selectName = newNameArray.join();
                    $scope.selectId = newIdArray.join();
                    if ($scope.selectName == "") {
                        $scope.selectName = "请选择";
                        $scope.selectId="";
                    }
                }
                $scope.selectShow = false; //选项栏隐藏
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});

//  多选框的 取消效果
myapp.directive('multipleSelectCancelFun',function(){
    return {
        restrict :'E',
        scope:{
            selectArray:"=",
            selectName:"=",
            selectId:"=",
            selectNameInit:"=",
            selectIdInit:"=",
            selectShow:"="
        },
        template : '<button class="btn btn-sm" ng-click="multipleSelectCancelFun($event)">取消</button>',
        replace:true,
        link : function($scope,element,attrs,ctrl){

            $scope.multipleSelectCancelFun = function ($event) {
                $scope.selectName=$scope.selectNameInit;  //初始值的保存
                $scope.selectId=$scope.selectIdInit;
                angular.forEach($scope.selectArray, function (items) {
                    items.status = false;
                });
                $scope.selectShow= false;   //选项栏隐藏
                $event.stopPropagation(); //防止冒泡事件的存在
            };
        }
    }
});



//这是折线图的函数，为了X轴的的数据量进行判断
var num = 0;
function intervalEchartsLine(times, val) {
    if (times.length <= 40) {
        return val;
    }
    if (times.length > 40 && times.length <= 70) {
        for (var i = 0; i < times.length; i++) {
            var time = times[num];
            //alert(time)
            var timeMark = time;

            var valMark = val;
            if (timeMark == valMark) {
                num += 2;
                return val;
            }
            return "";
        }
        return "";
    }
    if (times.length > 70 && times.length <=100) {
        for (var i = 0; i < times.length; i++) {
            var time = times[num];
            //alert(time)
            var timeMark = time;

            var valMark = val;
            if (timeMark == valMark) {
                num += 3;
                return val;
            }
            return "";
        }
        return "";
    }
    if (times.length > 100) {
        for (var i = 0; i < times.length; i++) {
            var time = times[num];
            //alert(time)
            var timeMark = time;

            var valMark = val;
            if (timeMark == valMark) {
                num += 4;
                return val;
            }
            return "";
        }
        return "";
    }

}

function containsEchartsLine(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}