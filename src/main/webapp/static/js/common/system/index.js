var speed = "500";

$(document).ready(function() {
//	hideUnauthElement();
	loadPage("user", "user.jsp");
	
	$(".mainnav-toggle").click(function(){
		$(".dataTable").width("100%");
	});
	init();
	$("#modify-pwd-div").click(function(){
		hideDiv("#loginmodal-modify-pwd");
	});
	$("#modify-pwd-cancelDiv").click(function(){
		hideDiv("#loginmodal-modify-pwd");
	});
});

function init(){
	$.ajax({
		async : true,
		type : "GET",
		url : basePath + "/sys/user/self",
		success : function(data) {
			var backValue = eval(data);
			$("#uName").text(backValue.name);
			$("#loginId").val(backValue.username);
			$("#pwdHid").val(backValue.passwd);
		},
		error : function(msg) {
			alertMsg('初始化用户名失败', 0);
		}
	});
}
function showPasswordMaintainDiv() {
	$("#pwd").val('');
	$("#pwd1").val('');
	$("#pwd2").val('');
	$.ajax({
		async : true,
		type : "GET",
		url : basePath + "/sys/user/self",
		success : function(data) {
			var backValue = eval(data);
			$("#pwdHid").val(backValue.passwd);
		},
		error : function(msg) {
			alertMsg('初始化用户名失败', 0);
		}
	});
	setDivCss("#loginmodal-modify-pwd");
}
function updateUserPass() {
	var exp = $("#pwd").val();
	var exp1 = $("#pwd1").val();
	var exp2 = $("#pwd2").val();
	if (checkIsNull(exp)) {
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
		url : basePath + "/sys/user",
		data : dataP,
		success : function(result) {
			var data = eval(result);
			if (data.flag == 'succeed') {// 成功
				$("#pwd").val('');
				$("#pwd1").val('');
				$("#pwd2").val('');
				$("#pwdHid").val(exp1);
				alertMsg('修改成功。', 1);
				hideDiv("#loginmodal-modify-pwd");
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

function logout() {
	$.ajax({
		async : false,
		type : "GET",
		url : basePath + "/sys/logout",
		success : function() {
			window.location = basePath;
		}
	});
}
function menuShow(){
	$(".dropdown-menu").css("display","block");
}
function menuHide(){
	$(".dropdown-menu").css("display","none");
}
function setMenuDisplay(id) {
	$("#" + id).toggle(speed);
	$("#" + id + "Right").toggleClass("bottom");
}

function loadPage(id, url) {
	$("#iframepage").load(url, function(response, status, xhr) {
		if (status == "error") {
			var path = response.replace(/^\"|\"$/g, '');
			window.location.href = path;
		}
	});
	$("#org").parent("li").removeClass("active-link");
	$("#user").parent("li").removeClass("active-link");
	$("#role").parent("li").removeClass("active-link");
	$("#module").parent("li").removeClass("active-link");
	$("#" + id).parent("li").addClass("active-link");
}
function setDivCss(id){
	var overlay = $("<div id='lean_overlay'></div>");
	$("body").append(overlay);
	$("#lean_overlay").css({
		"display": "block",
		opacity: 0
	});
	$("#lean_overlay").fadeTo(200, 0.5);
	var modal_height = $(id).outerHeight();
	var modal_width = $(id).outerWidth();
	$(id).css({
		"display": "block",
		"position": "fixed",
		"opacity": 0.5,
		"z-index": 11000,
		"left": 50 + "%",
		"margin-left": -(modal_width / 2) + "px",
		"top": 50 + "%",
		"margin-top": -(modal_height / 2) + "px",
	});
	$(id).fadeTo(200, 1);
}


function hideDiv(id){
	$(id).hide();
	$('#lean_overlay').remove();
}
