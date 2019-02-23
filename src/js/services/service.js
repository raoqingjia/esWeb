/**
 * Created by Administrator on 2017/3/10.
 */

myapp.factory('permissions', function ($rootScope) {
    var permissionList;
    return {
        setPermissions: function(permissions) {
            permissionList = permissions;
            $rootScope.$broadcast('permissionsChanged')
        }
    };
});

myapp.factory('userService',["$http","$q",function($http,$q){
    var deferred=$q.defer();
    var promise=deferred.promise;
    $http({
        method:'POST',
        url:'../../text.json'
    }).success(function(data,status,headers,config){
        deferred.resolve(data);//执行成功
    }).error(function(data,status,headers,config){
        deferred.reject();//执行失败
    });
    return promise;
}]);


myapp.factory('User',['$window',function($window) {   //本地数据临时储存
    return{
        //存储单个属性
        set :function(key,value){
            $window.sessionStorage[key]=value;
        },
        //读取单个属性
        get:function(key,defaultValue){
            return $window.sessionStorage[key] || defaultValue;
        },
        //存储对象，以JSON格式存储
        setObject:function(key,value){
            $window.sessionStorage[key]=JSON.stringify(value);
        },
        //读取对象
        getObject: function (key) {
            return JSON.parse($window.sessionStorage[key] || '{}');
        },
        //清除所有的sessionStorage信息
        clearObject:function(){
            $window.sessionStorage.clear();
        }
    }
}]);


myapp.factory('citySelectArray',[function() {   //把归属省数据写成公用的，以后直接用调用citySelectArray就行了
    var service=[
        {
            partition: "华北地区",
            city: [
                {name: "北京市", code: "100", status: false},
                {name: "天津市", code: "220", status: false},
                {name: "河北省", code: "311", status: false},
                {name: "山西省", code: "351", status: false},
                {name: "内蒙古自治区", code: "471", status: false}
            ]
        },
        {
            partition: "东北地区",
            city: [
                {name: "辽宁省", code: "240", status: false},
                {name: "吉林省", code: "431", status: false},
                {name: "黑龙江省", code: "451", status: false}
            ]
        },
        {
            partition: "华东地区",
            city: [
                {name: "上海市", code: "210", status: false},
                {name: "江苏省", code: "250", status: false},
                {name: "浙江省", code: "571", status: false},
                {name: "安徽省", code: "551", status: false},
                {name: "福建省", code: "591", status: false},
                {name: "江西省", code: "791", status: false},
                {name: "山东省", code: "531", status: false}
            ]
        },
        {
            partition: "中南地区",
            city: [
                {name: "河南省", code: "371", status: false},
                {name: "湖北省", code: "270", status: false},
                {name: "湖南省", code: "731", status: false},
                {name: "广东省", code: "200", status: false},
                {name: "海南省", code: "898", status: false},
                {name: "广西壮族自治区", code: "771", status: false}
            ]
        },
        {
            partition: "西南地区",
            city: [
                {name: "重庆市", code: "230", status: false},
                {name: "四川省", code: "280", status: false},
                {name: "贵州省", code: "851", status: false},
                {name: "云南省", code: "871", status: false},
                {name: "西藏自治区", code: "891", status: false}
            ]
        },
        {
            partition: "西北地区",
            city: [
                {name: "陕西省", code: "290", status: false},
                {name: "甘肃省", code: "931", status: false},
                {name: "青海省", code: "971", status: false},
                {name: "宁夏回族自治区", code: "951", status: false},
                {name: "新疆维吾尔自治区", code: "991", status: false}
            ]
        }
    ];
    return service
}]);


myapp.factory('userActionOption',["$http",function($http) {   //这是头部用户位置的操作选项的数据数据
    return{
        customerManager : [
            {name: "预警设置", code: "#/warningSettingGroup"}
        ],
        messageCenter: [
            {name: "预警设置", code: "#/warningSettingGroup"},
            {name: "下载列表", code: "#/downList"}
            //{name: "[退出]", code: "javascript:void(0);"}
        ]
    }
}]);

myapp.factory('ecIdSelectArray',[function() {   //把EC/id下拉框效果数据写成公用的，以后直接用调用ecIdSelectArray就行了
    var service=[
        {name:"EC编码",id:"000"},{name:"订购ID",id:"111"}
    ];
    return service
}]);



























