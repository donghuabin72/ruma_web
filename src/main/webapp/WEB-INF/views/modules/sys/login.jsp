<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/common.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- import plugin -->
<link rel="stylesheet" href="<%=ctxStatic%>/css/NUI/login-nui.css">
<link rel="stylesheet" href="<%=ctxStatic%>/css/NUI/login-two.css" />
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jquery.js"></script> 
<script src="<%= ctxStatic%>/js/framework/jquery-validation/1.15.0/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="<%=ctxStatic%>/js/framework/md5.js" type="text/javascript"></script>
<!-- import modules plugin -->
<script src="<%=ctxStatic%>/js/modules/sys/login.js" type="text/javascript"></script>
<script type="text/javascript">
$(document).ready(function() {
    $("#login-form").createLogin({
        isvalidatecode:"1",//是否需要验证码  1需要 0不需要
        error_id : "loginError",//错误信息显示区域id
        formid : "loginForm",//表单id
        name_id:"username",//登录名id
        pwd_id:"password",//登录密码id
        btn_id:"submitForm",//登录按钮id
        btn_val:"立即登录",
        createValidateCode_url : basePath+"/createValidateCode",//验证码创建url
        //点击登录按钮拦截事件，不需要拦截时增加login_url、method属性后组件直接提交表单到后台
        login:function(){
            validateForm();
        }
    });
    //验证提交数据
    function validateForm(){
        $("#loginForm").validate({
    		rules : {
    		    validateCode : {
					remote : basePath+"/checkValidateCode"
				},
    			username : {
    				required : true,
    				minlength : 2
    			},
    			password : {
    				required : true,
    				minlength : 6
    			}
    		},
    		messages : {
    			validateCode : {
					remote : "<br>验证码不正确.",
					required : "<br>请填写验证码."
				},
    			username : {
    				required : "<br>请输入用户名",
    				minlength : "<br>用户名至少由两个字母组成"
    			},
    			password : {
    				required : "<br>请输入密码",
    				minlength : "<br>密码长度不能小于 5 个字母"
    			}
    		},
    		errorLabelContainer : "#loginError"
    	});
    }
     //提交事件
   	$.validator.setDefaults({
		submitHandler : function() {
			var parameter = new Object();
			parameter.username = $("#username").val();
			parameter.password = $.md5($("#password").val());
			$.post(basePath + "/login", parameter, function(data) {
						if (data.status == "fail") {
							$("#loginError").css('display', 'block');
							$("#loginError").text(data.msg);
							$('.validateCodeRefresh').click();
							$('#validateCode').val('');
						} else {
							window.location.href = basePath+"/sys/index";
						}
			});
		}
   	});
});
</script>
<title>登录</title>
</head>
<body>
        <div class="bg">			
		</div>
		<div class="login">
			<h2 class="text-center">RUMA</h2>
			<!-- <h5 class="text-center">
				Welcome&nbsp;to&nbsp;NUI&nbsp;-&nbsp;Admin&nbsp;template&nbsp;backend&nbsp;systems&nbsp;!
			</h4>
			 -->
			 <div id = "login-form"></div>
		</div>
</body>
</html>