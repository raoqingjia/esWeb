/**
 * Created by Administrator on 2017/3/9.
 */
//这个页面的js主要是为了实现浏览器的兼容性问题，多半使用的是jQuery的代码


    //兼容不支持placeholder的浏览器开始
$(function() {
    // 如果不支持placeholder，用jQuery来完成
    if(!isSupportPlaceholder()) {
        // 遍历所有input对象, 除了密码框
        $('input').not("input[type='password']").each(
            function() {
                var self = $(this);
                var val = self.attr("placeholder");
                input(self, val);
            }
        );
        /**//* 对password框的特殊处理
         * 1.创建一个text框
         * 2.获取焦点和失去焦点的时候切换
         */
        $('input[type="password"]').each(
            function() {
                var pwdField= $(this);
                var pwdVal= pwdField.attr('placeholder');
                var pwdId= pwdField.attr('id');
                // 重命名该input的id为原id后跟1
                pwdField.after('<input id="' + pwdId +'1" type="text" value='+pwdVal+' autocomplete="off" />');
                var pwdPlaceholder = $('#' + pwdId + '1');
                pwdPlaceholder.show();
                pwdField.hide();
                pwdPlaceholder.focus(function(){
                    pwdPlaceholder.hide();
                    pwdField.show();
                    pwdField.focus();
                });

                pwdField.blur(function(){
                    if(pwdField.val() == '') {
                        pwdPlaceholder.show();
                        pwdField.hide();
                    }
                });
            }
        );
    }
});

// 判断浏览器是否支持placeholder属性
function isSupportPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
}

// jQuery替换placeholder的处理
function input(obj, val) {
    var $input = obj;
    var val = val;
    $input.attr({value:val});
    $input.focus(function() {
        if ($input.val() == val) {
            $(this).attr({value:""});
        }
    }).blur(function() {
        if ($input.val() == "") {
            $(this).attr({value:val});
        }
    });
}

//兼容不支持placeholder的浏览器结束


//JavaScript判断object/json 是否为空，可以使用jQuery的isEmptyObject()方法。 true说明是空对象，false说明不是空对象
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

//从url获取参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


//去除掉文字中间的空格，为下面的表单验证做准备
String.prototype.NoSpace = function(){return this.replace(/\s+/g, "");}
//这是用法   var s="df dfdf f ff ";  alert(s.NoSpace());


//取得当前月份前或后几个月的年月信息：0-当前年月，1-下个月，-1-上个月
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



//取得日期昨天，今天，明天  0-当前日，1-明天，-1-昨天
function  getDayFun(n){
    var today = new Date();
    today.setDate(today.getDate()+n);//日期  0-当前日，1-明天，-1-昨天
    var y = today.getFullYear();  //获取当年
    var m = today.getMonth()+1;  //获取当前月份的日期
    m = m<10 ? '0'+m : m;
    var d = today.getDate();
    d = d<10 ? '0'+d : d;
    return y+"-"+m+"-"+d;
}



//获取上个月的最后一天
function   lastMonth_lastDay(){
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if(month==0)
    {
        month=12;
        year=year-1;
    }
    if (month < 10) {
        month = "0" + month;
    }
   // var firstDay = year + "-" + month + "-" + "01";//上个月的第一天
    var myDate = new Date(year, month, 0);
    var lastDay = year + "-" + month + "-" + myDate.getDate();//上个月的最后一天
    return  lastDay;
}

function  CloseWebPage(){
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        } else {
            window.open('', '_top');
            window.top.close();
        }
    } else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
    } else {
        window.opener = null;
        window.open('  ', '_self', '');
        window.close();
        if(!window.close()){
            window.location.replace("about:blank");
            document.title=""
        }

    }

}



//数字改变成每隔三位用逗号隔开啊，如：21,035
function formatNum(strNum,unit) {
    if (strNum.length <= 3) {
        return strNum +unit;
    }
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
        return strNum +unit;
    }
    var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
    var re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c +unit;
}


$(document).on('click', function () {
    $(".echarts-window").css({"display":"none"});
});




IPG="http://192.168.1.148:8081/";
IPJ="http://192.168.1.148:8082/";
