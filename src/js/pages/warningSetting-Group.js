$(document).ready(function(){

    var oldName="";    //申明变量，为获取旧的联系人的value做准备，各个函数用完时，变量清空
    var oldPhone="";   //申明变量，为获取旧的手机号的value做准备，各个函数用完时，变量清空
    var oldEmail="";   //申明变量，为获取旧的邮箱号的value做准备，各个函数用完时，变量清空

    //去除掉文字中间的空格，为下面的表单验证做准备
    String.prototype.NoSpace = function(){return this.replace(/\s+/g, "");}
    //这是用法   var s="df dfdf f ff ";  alert(s.NoSpace());


    ifValueNull();        //如果input中text类型的value中没有值，人为的添加未填写这个内容
    function ifValueNull() {
        $(".warForm").find("input:text").each(function () {
            if ($.trim($(this).val()) == "") {
                $(this).val("未填写")
            }
        });
    }

    addInfor ()
    function   addInfor (){
        //不管初始联系人，邮箱，手机是否有信息绑定，
        // 都要添加一个可以添加信息的一行输入框
        $(".waring-box").append(
            '<form class="form-inline warDiv warForm " role="form">'+
            '<div class="form-group">'+
            '<p class="form-control-static">联系人：</p>'+
            '</div>'+
            '<div class="form-group warMRadd">'+
            '<input type="text" class="form-control inputInfo " autocomplete="off" name="username" value="">'+
            '</div>'+
            '<div class="form-group">'+
            '<p class="form-control-static">手机号：</p>'+
            '</div>'+
            '<div class="form-group warMRadd">'+
            '<input type="text" class="form-control inputInfo" autocomplete="off" name="userphone"  value="">'+
            '</div>'+
            '<div class="form-group">'+
            '<p class="form-control-static">邮箱：</p>'+
            '</div>'+
            '<div class="form-group warMRadd">'+
            '<input type="text" class="form-control inputInfo" autocomplete="off" name="useremail" value="">'+    //unborder这里添加这个类名，是为了表单验证做铺垫，否则会有问题
            '</div>'+
            '<input type="image" class="addBtn" src="images/add.png" alt="添加按钮">'+
            '</form>'
        )
    }


//先判断是不是有有联系人，如果一打开页面只有添加行，没有联系人，为阀值开关处于关闭状态做条件判断
    noUserName();
    function noUserName(){
        if($("input[name='username']").length==1){  //一定要注意是否放在了添加事件的前面,不然条件判断要修改
            $(".switch input[type='checkbox']").prop("checked",false);  //页面一加载阀门开关处于关闭状态
            $(".switch input[type='checkbox']").prop("disabled",true);   //因为没有联系人所以阀门禁用
        }
    }




    //当对联系人，手机号，邮箱号，的焦点获取时，清空当前的value值，字体颜色为蓝色，取消感叹号
    $('input[name="username"]').focus(function(){
        //$(this).val("");
        $(this).removeClass("inputWarn")
    });

    $('input[name="userphone"]').focus(function(){
        //$(this).val("");
        $(this).removeClass("inputWarn");
        $(this).parents("form").find('input[name="useremail"]').removeClass("inputWarn")
    });

    $('input[name="useremail"]').focus(function(){
        //$(this).val("");
        $(this).removeClass("inputWarn");
        $(this).parents("form").find('input[name="userphone"]').removeClass("inputWarn");
    });


    //对添加按钮的时间绑定
    $("input[src='images/add.png']").on("click",function(event){

        //对联系人进行验证
        var nameFlag=false;   //说明此时该行的联系人的状态是错误的
        var userName=$(this).parent().find('input[name="username"]').val().trim().NoSpace();
        //获取该行的联系人的value值，为表单验证进行准备；
        var userPhone=$(this).parent().find('input[name="userphone"]').val().trim().NoSpace();
        //获取该行的联系人的value值，为表单验证进行准备；
        var userEmail=$(this).parent().find('input[name="useremail"]').val().trim().NoSpace();
        //获取该行的联系人的value值，为表单验证进行准备；

        if(userName==''){   //先要判断联系人是不是填写了，这是判断的首要关键
            $(this).parent().find('input[name="username"]').addClass("inputWarn");
        }else{
            nameFlag=true;  //说明此时的联系人的状态是正确的状态；
        }


        if(nameFlag){   //这里说明联系人已经填写了，判断手机号跟邮箱号
            if(userPhone!=""||userEmail!=""){    //手机或邮箱必须有一个是要填写的
                if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                    if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                        $(this).parent().find('input[name="userphone"]').addClass("inputWarn");
                    }
                }
                if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                    if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                        $(this).parent().find('input[name="useremail"]').addClass("inputWarn")
                    }
                }

                if($(this).parent().find('.inputWarn').length==0){   //如果此时没有感叹号的提示状态，这说明此时是正确的填写
                    //这时再判断一下，邮箱跟手机号中，如果有一个是value是空，就赋值为未填写
                    if(userPhone==""){    userPhone="未填写"    }
                    if(userEmail==""){    userEmail="未填写"    }

                    $(this).parent().before(
                        '<form class="form-inline warDiv warForm " role="form">'+
                        '<div class="form-group">'+
                        '<p class="form-control-static  ">联系人：</p>'+
                        '</div>'+
                        '<div class="form-group warMR">'+
                        '<input type="text" class="form-control inputInfo unborder " name="username" autocomplete="off" value='+userName+' disabled>'+
                        '</div>'+
                        '<div class="form-group">'+
                        '<p class="form-control-static ">手机号：</p>'+
                        '</div>'+
                        '<div class="form-group warMR">'+
                        '<input type="text" class="form-control inputInfo unborder " name="userphone" autocomplete="off" value='+userPhone+' disabled>'+
                        '</div>'+
                        '<div class="form-group">'+
                        '<p class="form-control-static">邮箱：</p>'+
                        '</div>'+
                        '<div class="form-group warMR">'+
                        '<input type="text" class="form-control inputInfo unborder " name="useremail" autocomplete="off" value='+userEmail+' disabled>'+
                        '</div>'+
                        '<input type="image" src="images/mod.png" alt="编辑按钮">'+
                        '<input type="image" src="images/rem.png" alt="删除按钮">'+
                        '</form>'
                    );
                   // alert("发送一次post，向后台传递参数");  //把username、userphone、useremail发送给后台就行
                    $(this).parent().find('input[name="username"]').val("");
                    $(this).parent().find('input[name="userphone"]').val("");
                    $(this).parent().find('input[name="useremail"]').val("");
                    //这里是为了让阀门按钮解除禁用
                    if($("input[name='username']").length==2){  //只要有一个联系人就启用，之后再添加就不用管了
                          bootstrapSwitchOk();   //阀门按钮的启用
                    }
                }

            }else{
                $(this).parent().find('input[name="userphone"]').addClass("inputWarn");
                $(this).parent().find('input[name="useremail"]').addClass("inputWarn")
                return false;
            }
        } else{   //如果联系人为空，但是手机号或邮箱号不为空就要进行表单验证了

            if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                    $(this).parent().find('input[name="userphone"]').addClass("inputWarn");
                }
            }

            if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(this).parent().find('input[name="useremail"]').addClass("inputWarn");
                }
            }
            return false;
        }

        event.preventDefault();  //阻止默认事件
    })

    //删除按钮的事件绑定
    $("body").on("click","input[src='images/rem.png']",function(event){
        var username=$(this).parent().find('input[name="username"]').val().trim().NoSpace();  //获取当前行的联系人名称
        var userphone=$(this).parent().find('input[name="userphone"]').val().trim().NoSpace();//获取当前行的手机号
        var useremail=$(this).parent().find('input[name="useremail"]').val().trim().NoSpace();//获取当前行的邮箱号

        if($("input[name='username']").length>2){   //如果除了添加行，还有一条联系人存在，用户可以随便删除
            $(this).parent().remove();
        }else{    //说明只剩一条联系人存在了，用户不能随便删除，有添加判断的

            var switchState= $(".switch").find("input:checked")   //预警阀门当前的状态
            if(switchState.length==0){    //预警阀门都处于关闭状态，可以删除这条联系人

                if(confirm("你是否删除？")) {
                    $(this).parent().remove();   //这个就删除了
                    bootstrapSwitchDis ()
                }

            }else{
                 return false;  //单击事件结束，这调联系人不能删除，因为预警阀门未都处于关闭状态
            }

        }

            /*     //判断是不是有联系人，如果只有添加行，没有联系人，为阀值开关处于关闭状态
                 if($("input[name='username']").length==1){  //一定要注意是否放在了添加事件的前面,不然条件判断要修改
                     $.each($(".switch input[type='checkbox']"),function(){   //先遍历一次已存在的阀门开关，获取每个阀门开关的checked
                         $(this).parents(".switch").append('<input type="checkbox" class="checkbox"/>');
                         $(this).parents(".switch").find("input[type='checkbox']").prop("disabled",true);
                         //为动态添加的checkbook设置禁用
                     });
                     $(".bootstrap-switch").remove();  //先删除之前已经显示的阀门按钮
                     bootstrapSwitch();
                     defaultSwitch()
                 }   */



        event.preventDefault();  //阻止默认事件
    });



    //编辑按钮的事件绑定   其实是在为确认，取消按钮做准备
    $("body").on("click","input[src='images/mod.png']",function(event){
        //为点击确认键，数据是否向后台发送post的判断做比较的准备
        oldName=$(this).parent().find('input[name="username"]').val().trim().NoSpace();
        //先获取当前行旧的联系人名称
        oldPhone=$(this).parent().find('input[name="userphone"]').val().trim().NoSpace();
        //先获取当前行旧的手机号
        oldEmail=$(this).parent().find('input[name="useremail"]').val().trim().NoSpace();
        //先获取当前行旧的邮箱号
        //判断手机号吗或邮箱号码哪一个是未填写，如果是未填写，清空当前的value
        if(oldPhone=="未填写"){$(this).parent().find('input[name="userphone"]').val("")}
        if(oldEmail=="未填写"){$(this).parent().find('input[name="useremail"]').val("")}

        $(this).prop("src","images/correct.png");   //这时编辑图片变为对勾确认图片；
        $(this).parent().find("input[src='images/rem.png']").prop("src","images/cancel.png");
        //这时该行的删除图标变成取消图标
        $(this).parent().find('input[type="text"]').removeClass("unborder");
        //这时，当前的input类型是text类型的是可以编辑的
        $(this).parent().find('input[type="text"]').removeAttr("disabled");
        //启动当前的input输入框，disabled为false
        $("input[src='images/add.png']").prop("disabled",true);     //添加按钮都设置禁用；
        $("input[src='images/mod.png']").prop("disabled",true);     //编辑按钮都设置禁用；
        $("input[src='images/rem.png']").prop("disabled",true);     //删除按钮都设置禁用；
         bootstrapSwitchDis() ;//阀门按钮禁用
        event.preventDefault();  //阻止默认事件
    });



    //取消按钮的事件绑定
    $("body").on("click","input[src='images/cancel.png']",function(event){

        $(this).parent().find('input[name="username"]').val(oldName);
        $(this).parent().find('input[name="userphone"]').val(oldPhone);
        $(this).parent().find('input[name="useremail"]').val(oldEmail);
        //点击取消，说明用户不想进行修改了，联系人，手机号，邮箱号还应该是之前的value；

        $(this).prop("src","images/rem.png");   //这时该行的取消图标变成删除图标；
        $(this).parent().find("input[src='images/correct.png']").prop("src","images/mod.png");
        //这时该行的对勾确认图标变成编辑图标
        $(this).parent().find('input[type="text"]').addClass("unborder");
        //这时，当前的input类型是text类型的是不可以编辑的
        $(this).parent().find('input[type="text"]').attr("disabled","disabled");
        //这时，当前的input类型是text类型是只读
        $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
        $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
        $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；
        bootstrapSwitchOk() ;//阀门按钮启用
        //防止有感叹号警告的出现，如果出现清除这个感叹号编辑,是清除当前的
        $(this).parents("form").find('input[name="username"]').removeClass("inputWarn");
        $(this).parents("form").find('input[name="userphone"]').removeClass("inputWarn");
        $(this).parents("form").find('input[name="useremail"]').removeClass("inputWarn");
        oldName="";    //变量清空，为下一次获取旧的联系人的value做准备
        oldPhone="";   //变量清空，为下一次获取旧的手机号的value做准备
        oldEmail="";   //变量清空，为下一次获取旧的邮箱号的value做准备
        event.preventDefault();  //阻止默认事件
    });



    ////确认按钮（对勾图标）的事件绑定
    $("body").on("click","input[src='images/correct.png']",function(event){

        var nameFlag=false;   //说明此时该行的联系人的状态是错误的
        var userName=$(this).parent().find('input[name="username"]').val().trim().NoSpace();
        //获取当前行新编辑联系人名称（不一定是有效的，要进行验证）
        var userPhone=$(this).parent().find('input[name="userphone"]').val().trim().NoSpace();
        //获取当前行新编辑手机号（不一定是有效的，要进行验证）
        var userEmail=$(this).parent().find('input[name="useremail"]').val().trim().NoSpace();
        //获取当前行新编辑的邮箱号（不一定是有效的，要进行验证）
        var Othis= $(this);
        $(this).parent().find('input[name="username"]').focus(function(){
            Othis.parent().find('input[name="username"]').val("")
            Othis.parent().find('input[name="username"]').removeClass("inputWarn");
        });

        $(this).parent().find('input[name="userphone"]').focus(function(){
            Othis.parent().find('input[name="userphone"]').val("")
            Othis.parent().find('input[name="userphone"]').removeClass("inputWarn");
            Othis.parent().find('input[name="useremail"]').removeClass("inputWarn");
        });

        $(this).parent().find('input[name="useremail"]').focus(function(){
            Othis.parent().find('input[name="useremail"]').val("");
            Othis.parent().find('input[name="userphone"]').removeClass("inputWarn");
            Othis.parent().find('input[name="useremail"]').removeClass("inputWarn");
        });



        if(userName==''){   //先要判断联系人是不是填写了，这是判断的首要关键
            $(this).parent().find('input[name="username"]').addClass("inputWarn");
        }else{
            nameFlag=true;  //说明此时的联系人的状态是正确的状态；
        }


        if(nameFlag){   //这里说明联系人已经填写了，判断手机号跟邮箱号
            if(userPhone!=""||userEmail!=""){    //手机或邮箱必须有一个是要填写的
                if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                    if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                        $(this).parent().find('input[name="userphone"]').addClass("inputWarn");
                    }
                }
                if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                    if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                        $(this).parent().find('input[name="useremail"]').addClass("inputWarn")
                    }
                }

                if($(this).parent().find('.inputWarn').length==0){   //如果此时没有感叹号的提示状态，这说明此时是正确的填写
                    //这时再判断一下，邮箱跟手机号中，如果有一个是value是空，就赋值为未填写
                    if(userPhone==""){    userPhone="未填写"    }
                    if(userEmail==""){    userEmail="未填写"    }
                    //表单验证成功了，给联系人，手机号，邮箱号码的value中赋值
                    $(this).parent().find('input[name="username"]').val(userName);
                    $(this).parent().find('input[name="userphone"]').val(userPhone);
                    $(this).parent().find('input[name="useremail"]').val(userEmail);

                    $(this).prop("src","images/mod.png");   //对勾确认图片变成编辑图片；
                    $(this).parent().find("input[src='images/cancel.png']").prop("src","images/rem.png");
                    //这时该行的取消图标变成删除图标
                    $(this).parent().find('input[type="text"]').addClass("unborder");
                    //这时，当前的input类型是text类型的是不可以编辑的
                    $(this).parent().find('input[type="text"]').attr("disabled","disabled");
                    //这时，当前的input类型是text类型是只读
                    $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                    $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                    $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；
                    bootstrapSwitchOk() ;//阀门按钮启用
                    //这里对比一下新旧数据，是否发生了变化，如果有变动，就发动一次post请求
                    if(userName!=oldName||userPhone!=oldPhone||userEmail!=oldEmail){
                        alert("发送一次post，告诉后台我编辑了哪些数据，哪些数据是要被替换掉的");
                        //这里发送的请求要告诉后台，我哪些旧的数据被替换了，旧的数据就是oldName、oldPhone、oldEmail
                        //新的数据是
                    }

                    oldName="";    //变量清空，为下一次获取旧的联系人的value做准备
                    oldPhone="";   //变量清空，为下一次获取旧的手机号的value做准备
                    oldEmail="";   //变量清空，为下一次获取旧的邮箱号的value做准备
                }

            }else{
                $(this).parent().find('input[name="userphone"]').addClass("inputWarn");
                $(this).parent().find('input[name="useremail"]').addClass("inputWarn")
                return false;
            }
        } else{   //如果联系人为空，但是手机号或邮箱号不为空就要进行表单验证了

            if(userPhone!=""){   //如果手机不为空，对手机进行表单验证
                if(!userPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                    $(this).parent().find('input[name="userphone"]').addClass("inputWarn");
                }
            }

            if(userEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                if(userEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(this).parent().find('input[name="useremail"]').addClass("inputWarn");
                }
            }
            return false;
        }

        event.preventDefault();  //阻止默认事件
    });


//这是控制下面开关的js代码，利用了一个bootstrap的插件
    bootstrapSwitch()
   function bootstrapSwitch(){
       $(".checkbox").each(function(index,obj){//遍历开关按钮控制样式
           $(this).bootstrapSwitch({size:"mini",animate:false,
               onSwitchChange:function(){
                   var mystate=$(".input-box"+index).parent().siblings().find(".bootstrap-switch").hasClass("bootstrap-switch-on");
                   if(!mystate){

                       var  oValue=$(".input-box"+index).parent().find("input[type='text']").val().trim().NoSpace()
                       //获取当前的这个值；文本框的值进行判断

                       if(oValue!=""){   //如果输入框不为空
                           if((/^(\+)?\d+$/.test(oValue))){   //判断格式是否正确
                               oValue=parseInt(oValue);   //以防数字前有0的出现;这才是当前输入正确的value
                               $(".input-box"+index).parent().find("input[type='text']").val(oValue);//这时的输入文本框为oValue
                               $(".input-box"+index).parent().find("input[src='images/correct.png']").removeClass("onEdit").addClass("offEdit");
                               //先删除掉当前onEdit这个类名，添加offEdit这个类名，为编辑的事件做准备；
                               $(".input-box"+index).parent().find("input[type='text']").addClass("unborder");
                               $(".input-box"+index).parent().find("input[type='text']").attr("disabled",true);
                               //当前文本框可以不可进行修改；
                               $(".input-box"+index).parent().find("input[src='images/correct.png']").prop("src","images/mod.png");
                               //此时的(对勾)图标变为确认编辑图标
                               //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是启用的；
                               $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                               $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                               $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

                               $(".input-box"+index).addClass("unedit");
                               $(".input-box"+index).siblings(".per-icon").addClass("unedit");
                               $(".input-box"+index).parent().prev().find("p.form-control-static").addClass("unedit");
                           }else{   //如果填写格式错误，清空为0

                               $(".input-box"+index).parent().find("input[type='text']").val("0");//这时的输入文本框为0
                               $(".input-box"+index).parent().find("input[src='images/correct.png']").removeClass("onEdit").addClass("offEdit");
                               //先删除掉当前onEdit这个类名，添加offEdit这个类名，为编辑的事件做准备；
                               $(".input-box"+index).parent().find("input[type='text']").addClass("unborder");
                               $(".input-box"+index).parent().find("input[type='text']").attr("disabled",true);
                               //当前文本框可以不可进行修改；
                               $(".input-box"+index).parent().find("input[src='images/correct.png']").prop("src","images/mod.png");
                               //此时的(对勾)图标变为确认编辑图标
                               //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是启用的；
                               $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                               $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                               $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

                               $(".input-box"+index).addClass("unedit");
                               $(".input-box"+index).siblings(".per-icon").addClass("unedit");
                               $(".input-box"+index).parent().prev().find("p.form-control-static").addClass("unedit");

                           }
                       }else{
                           //如果为空
                           $(".input-box"+index).parent().find("input[type='text']").val("0");//这时的输入文本框为0
                           $(".input-box"+index).parent().find("input[src='images/correct.png']").removeClass("onEdit").addClass("offEdit");
                           //先删除掉当前onEdit这个类名，添加offEdit这个类名，为编辑的事件做准备；
                           $(".input-box"+index).parent().find("input[type='text']").addClass("unborder");
                           $(".input-box"+index).parent().find("input[type='text']").attr("disabled",true);
                           //当前文本框可以不可进行修改；
                           $(".input-box"+index).parent().find("input[src='images/correct.png']").prop("src","images/mod.png");
                           //此时的(对勾)图标变为确认编辑图标
                           //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是启用的；
                           $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                           $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                           $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

                           $(".input-box"+index).addClass("unedit");
                           $(".input-box"+index).siblings(".per-icon").addClass("unedit");
                           $(".input-box"+index).parent().prev().find("p.form-control-static").addClass("unedit");
                       }

                   }else{
                       $(".input-box"+index).removeClass("unedit");
                       $(".input-box"+index).siblings(".per-icon").removeClass("unedit");
                       $(".input-box"+index).parent().prev().find("p.form-control-static").removeClass("unedit");

                       var onValue=$(".input-box"+index).parent().find("input[type='text']").val()
                       //开启状态向后台提交一次数据，这行代码是否要，跟后台沟通
                       //alert("向后台发送onValue="+onValue)
                   }
               }
           });
       });
   }
//遍历开关按钮默认控制样式
    function defaultSwitch()  {
        $(".checkbox").each(function(index,obj){
            var mystate=$(".input-box"+index).parent().siblings().find(".bootstrap-switch").hasClass("bootstrap-switch-on");
            if(!mystate){
                $(".input-box"+index).addClass("unedit");
                $(".input-box"+index).siblings(".per-icon").addClass("unedit");
                $(".input-box"+index).parent().prev().find("p.form-control-static").addClass("unedit");
            }else{
                $(".input-box"+index).removeClass("unedit");
                $(".input-box"+index).siblings(".per-icon").removeClass("unedit");
                $(".input-box"+index).parent().prev().find("p.form-control-static").removeClass("unedit");
            }
        });
    }

    defaultSwitch();


    //下面的代码是控制套餐位置的编辑图标的事件绑定
    //交互解释：如果处于关闭状态，编辑禁用，如果处于开启状态，编辑启用，此时编辑图标变为确认（对勾）图标，
    // 此时可以对该行的数据进行编辑修改，但是修改的都是数字，并且处于修改编辑状态时，该行的开关禁用

    //开关为开时的编辑图标的事件绑定
    var  oldValue="";
    $(".warEdit").on("click",".offEdit",function(event){

        //通过当前行中checkbox的checked的值，去判断开关状态，true是开启，false是关闭
        var state= $(this).parents("form").find("input[type='checkbox']").prop("checked")
        if(state){   //说明处于开启状态
            $(this).removeClass("offEdit").addClass("onEdit");
            //先删除掉当前offEdit这个类名，添加onEdit这个类名，为确认的事件做准备；
            $(this).prop("src","images/correct.png");
            //此时的编辑图标变为，确认(对勾)图标
            oldValue=$(this).parent().find("input[type='text']").val().trim();
            //获取当前行文本框的值，进行变量储存，如果更改的新值不等于旧值，向后台发送数据
            $(this).parent().find("input[type='text']").removeClass("unborder");
            $(this).parent().find("input[type='text']").attr("disabled",false);
            //获取当前行文本框的值,当前文本框可以进行修改；

            //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是禁用的；
            $("input[src='images/add.png']").prop("disabled",true);     //添加按钮都设置禁用；
            $("input[src='images/mod.png']").prop("disabled",true);     //编辑按钮都设置禁用；
            $("input[src='images/rem.png']").prop("disabled",true);     //删除按钮都设置禁用；

            //????????这里要给当前的开关设置禁用；

            var Othis= $(this);
            $(this).parent().find('input[type="text"]').focus(function(){
                //Othis.parent().find('input[type="text"]').val("")
            });


        }else{
            return false;
        }
        event.preventDefault();//阻止默认事件；
    });

//开关为开时的确认（对勾）图标的事件绑定
    $(".warEdit").on("click",".onEdit",function(event){

        var newValue=$(this).parent().find("input[type='text']").val().trim().NoSpace();
        //获取当前行文本框的值，进行验证是不是一个数字，进行变量储存，与oldValue进行比较，不等于旧值，向后台发送数据

        if( newValue!=""){      //如果此时的值不为空

            if((/^(\+)?\d+$/.test(newValue))){   //输入的是个大于0的正整数,说明输入成功了
                newValue=parseInt(newValue);   //以防数字前有0的出现;这才是当前输入正确的value
                $(this).parent().find("input[type='text']").val(newValue);//判别new的值正确时，赋给当前的文本框
                $(this).removeClass("onEdit").addClass("offEdit");
                //先删除掉当前onEdit这个类名，添加offEdit这个类名，为编辑的事件做准备；
                $(this).prop("src","images/mod.png");
                //此时的确认(对勾)变为图标编辑图标
                $(this).parent().find("input[type='text']").addClass("unborder");
                $(this).parent().find("input[type='text']").attr("disabled",true);
                //当前文本框可以不可进行修改；

                //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是禁用的；
                $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
                $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
                $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

                //????????这里要给当前的开关设置启用；

                //如果新编辑的值newValue不等于旧值oldValue，向后台发送post请求
                if(newValue!=oldValue){
                    alert("想后台发送newValue="+newValue)
                }
                oldValue="";  //变量清空，为下一次获取旧的value做准备
            }else{
                return false
            }
        }else{  //说明此时为空

            $(this).parent().find("input[type='text']").val("0")//将0赋给当前的文本框
            $(this).removeClass("onEdit").addClass("offEdit");
            //先删除掉当前onEdit这个类名，添加offEdit这个类名，为编辑的事件做准备；
            $(this).prop("src","images/mod.png");
            //此时的编辑图标变为，确认(对勾)图标
            $(this).parent().find("input[type='text']").addClass("unborder");
            $(this).parent().find("input[type='text']").attr("disabled",true);
            //当前文本框可以不可进行修改；
            //这是上半部的预警编辑，添加，删除中，跟此处的编辑图标应该是启用的；
            $("input[src='images/add.png']").prop("disabled",false);     //添加按钮都设置启用；
            $("input[src='images/mod.png']").prop("disabled",false);     //编辑按钮都设置启用；
            $("input[src='images/rem.png']").prop("disabled",false);     //删除按钮都设置启用；

            //????????这里要给当前的开关设置启用；
            oldValue="";  //变量清空，为下一次获取旧的value做准备

        }

        event.preventDefault();//阻止默认事件；
    })



    //阀门的禁用函数
    function bootstrapSwitchDis (){
        $.each($(".switch input[type='checkbox']"),function(){   //先遍历一次已存在的阀门开关，获取每个阀门开关的checked
            var checked=$(this).prop("checked");  //获取每个阀门开关checked做准备
            if(checked){  //通过已有的阀门开关checked,再动态的添加checkbook为禁用做准备
                $(this).parents(".switch").append('<input type="checkbox" class="checkbox " checked/>');
            }else {
                $(this).parents(".switch").append('<input type="checkbox" class="checkbox "/>');
            }
            $(this).parents(".switch").find("input[type='checkbox']").prop("disabled",true);
            //为动态添加的checkbook设置禁用
        });

        $(".bootstrap-switch").remove();  //先删除之前已经显示的阀门按钮
        bootstrapSwitch();
    }

    //阀门的启动函数
    function bootstrapSwitchOk(){
        $.each($(".switch input[type='checkbox']"),function(){//先遍历一次已存在的阀门开关，获取每个阀门开关的checked
            var checked=$(this).prop("checked");//获取每个阀门开关checked做准备
            if(checked){   //通过已有的阀门开关checked,再动态的添加checkbook为启用做准备
                $(this).parents(".switch").append('<input type="checkbox" class="checkbox " checked/>');
            }else {
                $(this).parents(".switch").append('<input type="checkbox" class="checkbox "/>');
            }
            $(this).parents(".switch").find("input[type='checkbox']").prop("disabled",false);
             //为动态添加的checkbook设置启用
        });
        $(".bootstrap-switch").remove();
        bootstrapSwitch();
    }

    $("body").on("keydown","input[type='text']",function(event){
        //动态的给文本框添加禁止回车事件
        if(event.which==13){
            event.preventDefault();  //阻止默认事件
        }
    })


});


