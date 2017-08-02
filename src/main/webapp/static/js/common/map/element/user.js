$(document).ready(function() {
	$("#closeDiv").click(function(){
		hideDiv("#loginmodal-add");
	});
	$("#addCancelDiv").click(function(){
		hideDiv("#loginmodal-add");
	});
	showUserInfo();
});

function logout() {
	$.ajax({
		async : false,
		type : "GET",
		url : projectName + "/logout",
		success : function() {
			window.location = projectName;
		}
	});
}

function showUserInfo() {
	$.ajax({
		async : true,
		type : "GET",
		url : projectName + "/user/self",
		success : function(data) {
			var backValue = eval("(" + data + ")");
			$(".dropdown-toggle").html(backValue.name+"<b class=\"caret\"></b>");
			$("#loginId").val(backValue.id);
			$("#pwdHid").val(backValue.passwd);
		},
		error : function(msg) {
			alertMsg('初始化失败', 0);
		}
	});
}

function showSystemManagePage(num) {
	setModelId(num);
	window.open("system/index.jsp");
}

function showPasswordMaintainDiv() {
	$("#pwd").val('');
	$("#pwd1").val('');
	$("#pwd2").val('');
	setDivCss("#loginmodal-add");
}

function updateUserPass() {
	var exp = $("#pwd").val();
	var exp1 = $("#pwd1").val();
	var exp2 = $("#pwd2").val();
	if (checkIsNull(exp)) {
		console.log($(".aui_iconBg").attr("background-image"));
		alertMsg("请输入原始密码。", 0);
		return;
	}

	if (checkLen(exp, 30)) {
		alertMsg("原始密码长度不能超过30位。", 0);
		return;
	}
	if (checkLen(exp1, 30)) {
		alertMsg("新密码长度不能超过30位。", 0);
		return;
	}

	if (checkIsNull(exp1)) {
		alertMsg("请输入新密码。", 0);
		return;
	}
	if (checkIsNull(exp2)) {
		alertMsg("请再次输入新密码。", 0);
		return;
	}
	if (checkSpecial(exp)) {
		alertMsg("原始密码只能输入字母、数字、下划线", 0);
		return;
	}
	if (checkSpecial(exp1)) {
		alertMsg("新密码只能输入字母、数字、下划线", 0);
		return;
	}
	if ($("#pwdHid").val() != $.md5($("#pwd").val())) {
		alertMsg("原始密码错误", 0);
		return;
	}
	if ($("#pwd1").val() != $("#pwd2").val()) {
		alertMsg("再次输入新密码错误", 0);
		return;
	}
	var dataP = {
		'id' : $("#loginId").val(),
		'passwd' : $.md5($("#pwd1").val())
	};
	$.ajax({
		async : true,
		type : "PUT",
		url : projectName + "/user",
		data : dataP,
		success : function(result) {
			var data = eval("(" + result + ")");
			if (data.flag == 'succeed') {// 成功
				$("#pwd").val('');
				$("#pwd1").val('');
				$("#pwd2").val('');
				$("#pwdHid").val(exp1);
				alertMsg('修改成功。', 1);
				closePasswordMaintainDiv();
			} else {
				alertMsg('修改失败!', 0);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
			if (sessionOvertime == 'sessionOvertime') {
				sessionTimeout();
			}
		}
	});
}

function closePasswordMaintainDiv(){
	hideDiv("#loginmodal-add");
}