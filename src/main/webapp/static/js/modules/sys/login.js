/**
 * 登录模块
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年3月7日
 */
(function($) {
	var ops;
	$.fn.createLogin = function(options) { // 定义插件的名称
		var dft = {
			isvalidatecode : "1", // 是否需要验证码
			error_id : "loginError",// 错误信息区域id
			error_class : "prompt text-danger",// 错误信息区域样式
			login_url : "",// 登录请求url
			method:"post",//请求方式
			createValidateCode_url : "",// 创建验证码url
			formid : "loginForm", // 表单id
			name_id:"username",// 登录名id
			name_name:"username",// 登录名name
			name_class : "", // 登录名输入框样式
			pwd_id:"password",// 密码id
			pwd_name:"password",// 密码name
			pwd_class : "", // 密码输入框样式
			btn_id:"submitForm",//提交按钮id
			btn_val : "登录",// 提交按钮显示名称
			btn_class : "custom-btn custom-btn-primary",// 提交按钮样式
			usernameTdClass:"p-b-md  name",
			passwordTdClass:"p-b-md  psw",
			submitTdClass:"",
			errorTdClass:"prompt",
			validateTdClass:"checkcode",
			inputCssStyle : "margin-right:10px",// 验证码输入框样式
			imageCssStyle : "margin-right:10px;width:85px;height:40px",// 验证码图片样式
			buttonCssStyle : "",// 验证码按钮样式
			eventname:"click",//定义点击事件
			login:function(){//默认点击提交按钮后的事件
				$('#'+ops.formid).submit();
			}
		};

		ops = $.extend(dft, options);
		
		var table = $("<table></table>");
		
       //登录表单
		var node = $("<form></form>");
		node.attr("method", ops.method);
		node.attr("action", ops.login_url);
		node.attr("id", ops.formid);
        //登录名
		node.append(getUsernameDOM());
        //密码
		node.append(getPasswordDOM());
		// 是否需要验证码
		if (ops.isvalidatecode == "1") {
			node.append(getValidateCodeDOM());
		}
	    //登录按钮
        var submitBtn = getSubmitDOM();
		node.append(getSubmitDOM());
        //错误信息
		node.append(getErrorMsgDOM());
		
		table.append(node);
		// 将表单加入到想显示的div
		$(this).append(table); 
		//绑定提交事件
		$("#"+ops.btn_id).bind(ops.eventname,function(){
		      ops.login();
		});
	};
	//登录名DOM
	function getUsernameDOM(){
		var tr = $("<tr></tr>");
		var td = $("<td></td>");
	    var span = $("<span></span>");
	    span.attr("class", "icon-user-04 f18");
		td.attr("class", ops.usernameTdClass);
	   var nameInput = $("<input type='text' placeholder='用户名'></input>");
		nameInput.attr("id", ops.name_id);
		nameInput.attr("name", ops.name_name);
		nameInput.attr("class", ops.name_class);
		td.append(nameInput);
		td.append(span);
		tr.append(td);
		return tr;
	
	}
	//密码DOM
	function getPasswordDOM(){
		var tr = $("<tr></tr>");
	    var td = $("<td></td>");
	    var span = $("<span></span>");
	    span.attr("class", "icon-locked");
		td.attr("class", ops.passwordTdClass);
		var pwdInput = $("<input type='password' placeholder='密码'></input>");
		pwdInput.attr("id", ops.pwd_id);
		pwdInput.attr("name", ops.pwd_name);
		pwdInput.attr("class", ops.pwd_class);
		td.append(pwdInput);
		td.append(span);
		tr.append(td);
		return tr;
	}
	//登录按钮DOM
	function getSubmitDOM(){
		var tr = $("<tr></tr>");
		var td = $("<td></td>");
		td.attr("class", ops.submitTdClass);
	    var btnInput = $("<input type='submit'></input>");
	    btnInput.attr("id", ops.btn_id);
		btnInput.attr("class", ops.btn_class);
		btnInput.attr("value", ops.btn_val);
		td.append(btnInput);
		tr.append(td);
		return tr;
	}
	//错误信息DOM
	function getErrorMsgDOM(){
		var tr = $("<tr></tr>");
		var td = $("<td></td>");
		td.attr("class", ops.errorTdClass);
	    var errorArea = $("<p></p>");
		errorArea.attr("id", ops.error_id);
		errorArea.attr("class", ops.error_class);
		td.append(errorArea);
		tr.append(td);
		return tr;
	}
	//验证码DOM
	function getValidateCodeDOM(){
		   var tr = $("<tr></tr>");
		   var td = $("<td></td>");
		   td.attr("class", ops.validateTdClass);
	       //验证码DOM创建
			var validateCodeDiv = $("<div></div>");
			var validateUrl = ops.createValidateCode_url;
			var name = "validateCode";
	        //验证码输入框                           
			var validateInput = $("<input type='text' placeholder='验证码'></input>");
			validateInput.attr("id", name);
		    validateInput.attr("name", name);
		    validateInput.attr("maxlength", "10");
		    validateInput.attr("width", "25");
		    validateInput.attr("class", "txt required");
		    validateInput.attr("style", "width:70px;"+ops.inputCssStyle);
		    //验证码图片
		    var validateImg = $("<img></img>");
		    validateImg.attr("src", validateUrl);
		    validateImg.attr("onclick", "$('."+name+"Refresh').click();");
		    validateImg.attr("class", "mid "+name);
		    validateImg.attr("style", ops.imageCssStyle);
		    //验证码刷新按钮
		     var validateBtn = $("<a>看不清楚？</a>");
		     validateBtn.attr("onclick", "$(\'."+name+"\').attr(\'src\',\'"+validateUrl+"?\'+new Date().getTime());");
		     validateBtn.attr("class", "mid "+name+"Refresh");
		     validateBtn.attr("style", ops.buttonCssStyle);
			validateCodeDiv.append(validateInput);
			validateCodeDiv.append(validateImg);
			validateCodeDiv.append(validateBtn);
			td.append(validateCodeDiv);
			tr.append(td);
			return tr;
	}
})(jQuery);
