var errorApp=angular.module('errorApp',[]);
window.history.forward(1);
//用户信息错误
errorApp.controller("errorController",["$scope","$rootScope","$http","$document",function($scope,$rootScope,$http,$document){
    var urlError = getQueryString("error");
    if(urlError=="1"){
        $document[0].title="超时";
        $scope.errorMessage="登录已超时, 请点重新登录!";
    }else if(urlError=="2"){
        $document[0].title="错误";
        $scope.errorMessage="用户不存在";
    }else if(urlError=="3"){
        $document[0].title="退出";
        $scope.errorMessage="您已退出";
    }
}]);

//http://www.cnblogs.com/webzwf/p/5714385.html
//防止浏览器后退

$(function() {
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            window.history.pushState('forward', null, '#');
            window.history.forward(1);
        });
    }
    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行   //ie8/9不支持
    window.history.forward(1);
    location.hash="../../src/EC_WEB/error.html?error=1";  //单独对ie8/9做的支持   和<script src="../plugins/history/js/history.js"></script>

});

