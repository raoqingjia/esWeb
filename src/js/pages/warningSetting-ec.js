
$(document).ready(function(){

  //去除掉文字中间的空格，为下面的表单验证做准备
    String.prototype.NoSpace = function(){return this.replace(/\s+/g, "");}
    //这是用法   var s="df dfdf f ff ";  alert(s.NoSpace());

       valueIsNull ();   //如果input中text类型的value中没有值，人为的添加未填写这个内容   记得加类名
      function valueIsNull (){     //如果input中text类型的value中没有值，人为的添加未填写这个内容
          $(".ECForm .form-group").find("input:text").each(function () {
              if ($.trim($(this).val()) == "") {
                  $(this).val("未填写")
              }
          });
      }

    //这是控制下面开关的js代码，利用了一个bootstrap的插件
    bootstrapSwitch()
    function bootstrapSwitch(){
        $(".checkbox").each(function(index,obj){//遍历开关按钮控制样式
            $(this).bootstrapSwitch({size:"mini",animate:false,
                onSwitchChange:function(){
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
                }});
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
    };
    defaultSwitch();

     //先申明四个变量，作为手机号，邮箱，预警数字的保存准备
    var oldPhone="";
    var oldEmail="";
    var oldNum=[];
    var oldPercent=[];

    //给input[name='userphone']文本框添加，聚焦时value为空，清除感叹号标志
    $("body").on("focus","input[name='userphone']",function(){
        //$(this).val("");  //清空当前的文本框
        $(this).removeClass("inputWarn"); //清除当前的感叹号标志
        $(this).parents(".warningBody").find("input[name='useremail']").removeClass("inputWarn");//清除邮箱的感叹号标志
    });
    $("body").on("focus","input[name='useremail']",function(){
        //$(this).val("");  //清空当前的文本框
        $(this).removeClass("inputWarn"); //清除当前的感叹号标志
        $(this).parents(".warningBody").find("input[name='userphone']").removeClass("inputWarn");//清除邮箱的感叹号标志
    });

    $("body").on("focus","input[name='usernumber']",function(){
        //$(this).val("");  //清空当前的文本框
        $(this).removeClass("inputWarn"); //清除当前的感叹号标志
    });
    $("body").on("focus","input[name='userpercent']",function(){
        //$(this).val("");  //清空当前的文本框
        $(this).removeClass("inputWarn");  // 清除当前的感叹号标志
    });

    // zp
    $("span.divText").each(function(i){
        $(this).text($(this).siblings("input[type='text'][class*='input-box']").val());
    });
// zp

  // 点击编辑增删改按钮显示
  $("body").on("click",".edit",function(event){
      var othis= $(this);
      inputClear(othis) ;//如果input中text类型的value中s是未填写，清空这个value
      $(this).css("display","none");   //编辑按钮隐藏
      $(this).siblings(".log").css("display","none");  //历史信息隐藏
      $(this).siblings(".save").css("display","block"); //保存按钮显示
      $(this).siblings(".cancel").css("display","block");//取消按钮显示

      // zp
      $("input[type='text'][class*='input-box']").each(function(i){
          $(this).val($(this).siblings("span.divText").text());
      });
      $(this).parents(".warningBody").find("span.divText").show(); //text类型的input边框显示
      // zp

      $(this).parents(".warningBody").find("input[type='text']").addClass("addborder"); //text类型的input边框显示
      $(this).parents(".warningBody").find("input[type='text']").prop("disabled",false);//text类型的input边框禁用解除
      //给oldPhone，oldEmail，oldNum，oldPercent这四个变量赋值
      oldPhone=$(this).parents(".warningBody").find("input[name='userphone']").val().trim();
      oldEmail=$(this).parents(".warningBody").find("input[name='useremail']").val().trim();
      //oldNum=$(this).parents(".warningBody").find("input[name='usernumber']").val().trim();
      //oldPercent=$(this).parents(".warningBody").find("input[name='userpercent']").val().trim();
      $.each(othis.parents(".warningBody").find("input[name='usernumber']"),function(){
          oldNum.push($(this).val().trim())
      });
      $.each(othis.parents(".warningBody").find("input[name='userpercent']"),function(){
          oldPercent.push($(this).val().trim())
      });
      //阀门按钮启用
      bootstrapSwitchOk()
      function bootstrapSwitchOk(){
          othis.parents(".warningBody").find(".switch input[type='checkbox']").each(function(){//先遍历一次已存在的阀门开关，获取每个阀门开关的checked
              var checked=$(this).prop("checked");//获取每个阀门开关checked做准备
              if(checked){   //通过已有的阀门开关checked,再动态的添加checkbook为启用做准备
                  $(this).parents(".switch").append('<input type="checkbox" class="checkbox " checked/>');
              }else {
                  $(this).parents(".switch").append('<input type="checkbox" class="checkbox "/>');
              }
              $(this).parents(".switch").find("input[type='checkbox']").prop("disabled",false);
              //为动态添加的checkbook设置启用
          });
          othis.parents(".warningBody").find(".bootstrap-switch").remove();  //先删除之前已经显示的阀门按钮
          bootstrapSwitch();
      }
      event.preventDefault();  //阻止默认事件
  });

 //给保存按钮添加事件
  $("body").on("click",".save",function(event){//点击保存.save图标消失,禁止输入,
      //先获取当前用户输入的数值，进行表单验证
      var newPhone=$(this).parents(".warningBody").find("input[name='userphone']").val().trim().NoSpace();
      var newEmail=$(this).parents(".warningBody").find("input[name='useremail']").val().trim().NoSpace();
      //var newNum=$(this).parents(".warningBody").find("input[name='usernumber']").val().trim().NoSpace();
      //var newPercent=$(this).parents(".warningBody").find("input[name='userpercent']").val().trim().NoSpace();
       var othis=$(this);
      //首要的判断依据是，手机号与邮箱号不能同时为空，必须填写一个
        if(newPhone!=""||newEmail!=""){
            if(newPhone!=""){   //如果手机不为空，对手机进行表单验证
                if(!newPhone.match(/^(((13[4-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
                    $(this).parents(".warningBody").find("input[name='userphone']").addClass("inputWarn");
                }
            }
            if(newEmail!=""){      //如果邮箱不为空，对邮箱进行表单验证
                if(newEmail.search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(this).parents(".warningBody").find("input[name='useremail']").addClass("inputWarn")
                }
            }
            //对流量包预警的判断
            judeNum (othis);
            judePercent (othis);
            if($(this).parents(".warningBody").find('.inputWarn').length==0){  //如果此时没有感叹号的提示状态，这说明此时是正确的填写
                //这时再判断一下，邮箱跟手机号中，如果有一个是value是空，就赋值为未填写
                if(newPhone==""){    newPhone="未填写"    };
                if(newEmail==""){    newEmail="未填写"    };
                $(this).parents(".warningBody").find("input[name='userphone']").val(newPhone);
                $(this).parents(".warningBody").find("input[name='useremail']").val(newEmail);

                // zp
                $("input[type='text'][class*='input-box']").each(function(i){
                    $(this).val($(this).siblings("span.divText").text());
                });
                $(this).parents(".warningBody").find("span.divText").show(); //text类型的input边框显示
                // zp

                $(this).parents(".warningBody").find("input[type='text']").removeClass("addborder"); //text类型的input边框隐藏
                $(this).parents(".warningBody").find("input[type='text']").prop("disabled",true);//text类型的input边框禁用
                 var phone=$(this).parents(".warningBody").find("input[name='userphone']").val().trim();

                $(this).css("display","none");            //保存按钮隐藏
                $(this).siblings(".cancel").css("display","none");//取消按钮隐藏
                $(this).siblings(".edit").css("display","block");  //编辑按钮显示
                $(this).siblings(".log").css("display","block");  //历史信息显示
                //将四个储备的变量值清空，为下一次使用做准备
                oldPhone="";
                oldEmail="";
                oldNum=[];
                oldPercent=[];
            }

            }else{   //说明手机号跟，邮箱号同时为空
            $(this).parents(".warningBody").find("input[name='userphone']").addClass("inputWarn");//给手机文本框警告
            $(this).parents(".warningBody").find("input[name='useremail']").addClass("inputWarn");//给邮箱文本框警告
            //对流量包预警的判断
            judeNum (othis);
            judePercent (othis)
        }
      event.preventDefault();  //阻止默认事件
  });

//给取消按钮添加事件
    $("body").on("click",".cancel",function(event) {//点击保存.save图标消失,禁止输入,
        var othis= $(this);
        $(this).css("display","none");            //取消按钮隐藏
        $(this).siblings(".save").css("display","none");//保存按钮隐藏
        $(this).siblings(".edit").css("display","block");  //编辑按钮显示
        $(this).siblings(".log").css("display","block");  //历史信息显示
        $(this).parents(".warningBody").find("input[name='userphone']").val();
       //手机号，邮箱号，预警数量变为原来的值
        $(this).parents(".warningBody").find("input[name='userphone']").val(oldPhone);
        $(this).parents(".warningBody").find("input[name='useremail']").val(oldEmail);
        //$(this).parents(".warningBody").find("input[name='usernumber']").val(oldNum);
        //$(this).parents(".warningBody").find("input[name='userpercent']").val(oldPercent);
        $.each(othis.parents(".warningBody").find("input[name='usernumber']"),function(i){
            $(this).val(oldNum[i])
        });
        $.each(othis.parents(".warningBody").find("input[name='userpercent']"),function(i){
            $(this).val(oldPercent[i])
        });
        othis.parents(".warningBody").find("input").removeClass("inputWarn");
        ifValueNull(othis);
        //如果邮箱跟手机号都是未填写，阀门按钮禁用

//如果邮箱跟手机号都是未填写，阀门按钮禁用
        var phoneJudeg=$(this).parents(".warningBody").find("input[name='userphone']").val();
        var  emailJudeg=$(this).parents(".warningBody").find("input[name='useremail']").val();
        if(phoneJudeg=="未填写"&&emailJudeg=="未填写"){
            othis.parents(".warningBody").find(".switch input[type='checkbox']").each(function(){//先遍历一次已存在的阀门开关，获取每个阀门开关的checked
                $(this).parents(".switch").append('<input type="checkbox" class="checkbox "/>');
                $(this).parents(".switch").find("input[type='checkbox']").prop("disabled",true);
                //为动态添加的checkbook设置禁用
            });
            var warningId=$(this).parents(".warningBody").find("input[name='warningId']").val();
            //当邮箱和手机号未填写时，可以控制按钮，但是取消时就会关闭按钮
            othis.parents(".warningBody").find(".bootstrap-switch").remove();  //先删除之前已经显示的阀门按钮
            defaultSwitch();
            bootstrapSwitch();
        }

        // zp
        $("input[type='text'][class*='input-box']").each(function(i){
            $(this).val($(this).siblings("span.divText").text());
        });
        $(this).parents(".warningBody").find("span.divText").show(); //text类型的input边框显示
        // zp
        //将四个储备的变量值清空，为下一次使用做准备
        oldPhone="";
        oldEmail="";
        oldNum=[];
        oldPercent=[];
        $(this).parents(".warningBody").find("input[type='text']").removeClass("addborder"); //text类型的input边框隐藏
        $(this).parents(".warningBody").find("input[type='text']").prop("disabled",true);//text类型的input边框禁用
        event.preventDefault();  //阻止默认事件
    });



    function inputClear(othis){  //如果input中text类型的value中s是未填写，清空这个value
        othis.parents(".warningBody").find("input:text").each(function() {
            if($.trim($(this).val()) == "未填写") {
                $(this).val("")
            }
        });
    }

    function ifValueNull(othis) {      //如果input中text类型的value中没有值，人为的添加未填写这个内容
        othis.parents(".warningBody").find("input:text").each(function() {
            if($.trim($(this).val()) == "") {
                $(this).val("未填写")
            }
        });
    }

  function judeNum (othis){   //对流量包预警判断的函数
      $.each(othis.parents(".warningBody").find("input[name='usernumber']"),function(){
          var newNum=$(this).val().trim().NoSpace();
          if(newNum!=""){   //如果流量包预警部不为空
              if((/^(\+)?\d+$/.test(newNum))){   //输入的是个大于0的正整数,说明输入成功了
                  newNum=parseInt(newNum);   //以防数字前有0的出现;这才是当前输入正确的value
                  $(this).val(newNum);//判别new的值正确时，赋给当前的文本框
              }else{
                  $(this).addClass("inputWarn");
                  //通过验证后，填写错误，给客户提示警告
              }
          }else{   //流量包预警部为空,则赋值为0；
              $(this).val("0")
          }

      }) ;
  }

    function judePercent (othis){   //对套餐订购波动预警的函数
        $.each(othis.parents(".warningBody").find("input[name='userpercent']"),function(){
            var newpercent=$(this).val().trim().NoSpace();
            if(newpercent!=""){   //如果流量包预警部不为空
                if((/^(\+)?\d+$/.test(newpercent))){   //输入的是个大于0的正整数,说明输入成功了
                    newpercent=parseInt(newpercent);   //以防数字前有0的出现;这才是当前输入正确的value
                    $(this).val(newpercent);//判别new的值正确时，赋给当前的文本框
                }else{
                    $(this).addClass("inputWarn");
                    //通过验证后，填写错误，给客户提示警告
                }
            }else{   //流量包预警部为空,则赋值为0；
                $(this).val("0")
            }

        }) ;
    }

    SwitchDis(); //如果邮箱跟手机号都是未填写，阀门按钮禁用
    function SwitchDis(){     //如果邮箱跟手机号都是未填写，阀门按钮禁用
        $(".warningBody").each(function(){
             var userphone=$(this).find("input[name='userphone']").val();
             var useremail=$(this).find("input[name='useremail']").val();
            if(userphone=="未填写"&&useremail=="未填写"){
                $(this).find(".switch input[type='checkbox']").each(function(){   //先遍历一次已存在的阀门开关，获取每个阀门开关的checked
                    var checked=$(this).prop("checked");  //获取每个阀门开关checked做准备
                    if(checked){  //通过已有的阀门开关checked,再动态的添加checkbook为禁用做准备
                        $(this).parents(".switch").append('<input type="checkbox" class="checkbox " checked/>');
                    }else {
                        $(this).parents(".switch").append('<input type="checkbox" class="checkbox "/>');
                    }
                    $(this).parents(".switch").find("input[type='checkbox']").prop("disabled",true);
                    //为动态添加的checkbook设置禁用
                });
               $(this).find(".bootstrap-switch").remove();  //先删除之前已经显示的阀门按钮
                bootstrapSwitch();
            }
        })
    }


    $("body").on("keydown","input[type='text']",function(event){
         //动态的给文本框添加禁止回车事件
            if(event.which==13){
                event.preventDefault();  //阻止默认事件
            }
     })

});











