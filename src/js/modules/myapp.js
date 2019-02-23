/**
 * Created by Administrator on 2017/3/10.
 */


var userId = getQueryString("userId");
var permissionList;
initUrl="../../text.json";
angular.element(document).ready(function() {

    $.ajax({
        type: "POST",
        url:initUrl,
        success:function(result){ // 这里的参数data，代表服务器端返回的数据
            permissionList=result;  //获取所有的数据
            //permissionList=JSON.parse(permissionList);
            //调用bootstrap函数手动启动
            angular.bootstrap(document, ['myapp']);

        },
        error:function(data){
            window.location.replace('../../src/EC_WEB/error.html?error=2');
            console.log("用户不存在")
        }
    });

});

var myapp=angular.module('myapp', ["ui.router"]);


// 配置路由 - 依赖注入$routeProvider服务
myapp.config(["$httpProvider",'$stateProvider', '$urlRouterProvider',
    function($httpProvider,$stateProvider,$urlRouterProvider){

        angular.forEach(permissionList.data.userNavMenu,function(item,index){
            var url="/"+item.menuAddr;
            var templateUrl="../EC_WEB/"+item.menuAddr+".html";
            if(index==0){
                //$urlRouterProvider.otherwise(url);
                $stateProvider.state(item.menuAddr, {
                        url:url,
                        templateUrl: templateUrl
                    });
            }else{
                if(item.menuAddr=="statistics"){
                    //angular.forEach(permissionList.data.userLeftMenu,function(ite){
                    //    angular.forEach(ite.son,function(its){
                    //        $urlRouterProvider.when("/"+item.menuAddr,"/"+item.menuAddr+"/"+its.menuAddr);
                    //    }) ;
                    //});

                    $stateProvider.state(item.menuAddr, {
                        url:url,
                        templateUrl: templateUrl,
                        params:{'argumentsId':{},argumentsName:{}}
                    });

                     //下面是视图嵌套配置父子路径
                    angular.forEach(permissionList.data.userLeftMenu,function(ite){
                        angular.forEach(ite.son,function(its){
                            $urlRouterProvider.when(item.menuAddr,item.menuAddr+its.menuAddr);
                            var ostate=item.menuAddr+"."+its.menuAddr;
                            var ourl="/"+its.menuAddr;
                            var otemplateUrl="../EC_WEB/"+its.menuAddr+".html";
                            $stateProvider.state(ostate, {
                                url:ourl,
                                templateUrl: otemplateUrl,
                                params:{'argumentsId':{},argumentsName:{}}
                            });
                        }) ;
                    })


                }else{
                    $stateProvider.state(item.menuAddr, {
                        url:url,
                        templateUrl: templateUrl
                    });
                }

            }
        });

        angular.forEach(permissionList.data.userOptionMenu,function(item,index){
            var url="/"+item.menuAddr;
            var templateUrl="../EC_WEB/"+item.menuAddr+".html";
            $stateProvider.state(item.menuAddr, {
                url:url,
                templateUrl: templateUrl,
                params:{'argumentsId':{},argumentsName:{}}
            });

        });

        $stateProvider.state("error", {
            url:"/error",
            templateUrl: "../EC_WEB/error.html"
        });

        $httpProvider.interceptors.push(function($q,$rootScope) {
            return {
                request: function(config){
                    $rootScope.loading = true;
                    return config;
                },
                requestError: function(err){
                    $rootScope.loading = true;
                    return $q.reject(err);
                },
                response: function(res){
                    $rootScope.loading = false;
                    return res;
                },
                responseError: function(err){
                    //if(-1 === err.status) {
                    //    // 远程服务器无响应
                    //} else if(500 === err.status) {
                    //    // 处理各类自定义错误
                    //} else if(501 === err.status) {
                    //    // ...
                    //}
                    $rootScope.loading = true;
                    return $q.reject(err);
                }
            };
        });
    }]);



