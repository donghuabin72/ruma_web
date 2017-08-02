$(document).ready(function() {
	var orgId = $("#searchOrgId").val();
	init(orgId);
	
	$(".add_actions").html($("#addUser").html());

	if ($("#searchOrgId").val() == "null") {
		$("#currentPosition").text("用户管理");
	}else{
		$("#currentPosition").html("<a id=\"org\" href=\"javascript:loadPage('org', 'org.jsp');\">组织机构管理</a>");
		$(".breadcrumb").append("<li class=\"active\">用户管理</li>");
	}

	$("#sysRoles").dblclick(function() {
		addRoles();
	});

	$("#userRoles").dblclick(function() {
		removeRoles();
	});
	$("#allcb").click(function(){ 
		if($('#allcb').is(':checked')){
			$("input[name='chkItem']").prop("checked",true);//全选 
			 
		}else{
			$("input[name='chkItem']").prop("checked",false);//全取消
		}
	});
	
	$("#closeDiv").click(function(){
		hideDiv("#loginmodal-add");
	});
	
	$("#addCancelDiv").click(function(){
		hideDiv("#loginmodal-add");
	}); 
	
	$("#roleCancelDiv").click(function(){
		hideDiv("#loginmodal-set");
	});
	
	$("#roleDiv").click(function(){
		hideDiv("#loginmodal-set");
	});
	
	$("#delCancelDiv").click(function(){
		hideDiv("#loginmodal-del");
	});
	
	$("#resetDiv").click(function(){
		hideDiv("#loginmodal-resetpsw");
	});
});

var userTable;
var userId;

function init(orgId) {
	var serviceUrl = "";
	if (orgId == "null") {
		serviceUrl = basePath+"/sys/user";
	} else {
		serviceUrl = basePath+"/sys/user/org/" + orgId;
	}
	userTable = $('#userTable')
			.dataTable(
					{
						"aaSorting" : [ [ 0, 'asc' ] ],
						"language" : {
							"lengthMenu" : "每页 _MENU_ 行",
							"info" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
							"zeroRecords" : "未查询到任何记录",
							"infoEmpty" : "没有满足条件的记录",
							"infoFiltered" : "(共有 _MAX_ 条记录)",
							"search" : "",
							"sSearchPlaceholder" : "搜索...",
							"processing" : "处理中...",
							"paginate" : {
								"first" : "首页",
								"previous" : "前一页",
								"next" : "后一页",
								"last" : "尾页"
							}
						},
						"preDrawCallback" : function(settings) {
							$("#userTableProcess").html("加载数据中,请稍候...");
							setDivCss("#userProcess");
						},
						"drawCallback" : function(settings) {
							hideDiv("#userProcess");
							$("#").modal('hide');
						},
						"bAutoWidth" : true,
						"processing" : false,
						"iDisplayLength" : 15,
						"lengthChange" : false,
						"serverSide" : true,
						"bSort": false,
						"sDom" : "<'add_actions_f'f><'add_actions'>tip",
						"oClasses" : {
							"sFilterInput" : "custom-search"
						},
						"ajax" : {
							"url" : serviceUrl,
							"error" : function(jqXHR, textStatus) {
								var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
								window.location.href = path;
							}
						},
						"columns" : [ {
							"data" : "id"
						}, {
							"data" : "username"
						}, {
							"data" : "name"
						}, {
							"data" : "email"
						}, {
							"data" : "tel"
						}, {
							"data" : "orgName"
						} , {
							"data" : "roleName"
						} ],
						"columnDefs" : [
								{
									"targets" : [ 0 ],
									"render" : function(data, type, full) {
										return "<input type=\"checkbox\" name=\"chkItem\" value=\""+full.username+"\">";
									}
								},
								{
									"targets" : [ 7 ],
									"data" : "username",
									"render" : function(data, type, full) {
										return "<a class=\"icon-btn\" title=\"分配角色\" onclick=\"showUserRole('"+data+"');\" id=\"modaltrigger-set\"><span class=\"icon-settings f18 text-blue\"></span></a><a class=\"icon-btn\" title=\"修改用户信息\" onclick=\"detail('"+ data + "')\"><span class=\"icon-info-block f18 text-blue\"></a>";
									}
								} ]
					});
}

function showCreateDiv() {
	$(".icon-clear").prev().text("新增用户");
	$("#userId").removeAttr("readonly");
	$("#password").parent("td").parent("tr").show();
	$("#passwordError").parent("td").parent("tr").show();
	$("#userId").val("");
	$("#password").val("");
	$("#userName").val("");
	$("#email").val("");
	$("#mobile").val("");
	$("#operate").val("create");
	$("#orgTree").html("");
	$("#validateMessage").html("");
	setDivCss("#loginmodal-add");
	$("#userId").focus();
}

function detail(id) {
	$("#userId").attr("readonly", "readonly");
	$("#validateMessage").html("");
	$("#orgTree").html("");
	$("#password").parent("td").parent("tr").hide();
	$(".icon-clear").prev().text("修改用户信息");
	$.ajax({
		url : basePath + "/sys/user/" + id,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			var jsonData = eval(data);
			console.log(jsonData);
			$("#userId").val(jsonData["username"]);
			$("#userName").val(jsonData["name"]);
			$("#email").val(jsonData["email"]);
			$("#mobile").val(jsonData["tel"]);
			$("#operate").val("update");
			setDivCss("#loginmodal-add");
			$("#userName").focus();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#validateMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			userTable.fnDraw();
		}
	});
}

function operateUser() {
	var loginId = $("#userId").val();
	var password = $("#password").val();
	var userName = $("#userName").val();
	var opType = $("#operate").val();
	var orgId = $("#orgId").val();
	var mobile = $("#mobile").val();
	$("#validateMessage").html("");
	if (loginId.replace(/\s/g, "") == "") {
		$("#validateMessage").html("请输入用户名");
		$("#userId").focus();
		return;
	}
	if (checkLen(loginId, 20)) {
		$("#validateMessage").html("用户名长度不能超过20个字符");
		$("#userId").focus();
		return;
	}
	var reg = /^[a-zA-Z0-9_]+$/g;
	if (CtoH(loginId).match(reg) == null) {
		$("#validateMessage").html("只能输入字母、数字、下划线");
		$("#userId").focus();
		return;
	}

	if (opType == "create") {
		if (password.replace(/\s/g, "") == "") {
			$("#validateMessage").html("请输入密码");
			$("#password").focus();
			return;
		}

		if (checkLen(password, 30)) {
			$("#validateMessage").html("密码长度不能超过30位");
			$("#password").focus();
			return;
		}

		var reg = /^[a-zA-Z0-9_]+$/g;
		if (CtoH(password).match(reg) == null) {
			$("#validateMessage").html("只能输入字母、数字、下划线");
			$("#password").focus();
			return;
		}
	}

	if (userName.replace(/\s/g, "") == "") {
		$("#validateMessage").html("请输入姓名");
		$("#userName").focus();
		return;
	}
	
	if (checkLen(mobile, 11)) {
		$("#validateMessage").html("移动电话长度为11位");
		$("#mobile").focus();
		return;
	}
	
	var reg = new RegExp("^[0-9]*$");  
    if(!reg.test(mobile)){  
		$("#validateMessage").html("移动电话必须为数字");
		$("#mobile").focus();
		return;
    } 

	if (opType == "create") {
		createUser();
	} else {
		updateUser();
	}
}

function operateUserRole() {
	var userRoles = $('#userRoles').children();
	var roles = "";
	$.each(userRoles, function(index, userRole) {
		roles = roles + $(userRole).val() + ",";
	});
	var parameter = {};
	parameter["userId"] = userId;
	parameter["roleId"] = roles;
	$.ajax({
		url : basePath + "/sys/userRole",
		async : true,
		type : 'POST',
		data : parameter,
		success : function(data, textStatus) {
			hideDiv("#loginmodal-set");
			userTable.fnDraw();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#validateMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			userTable.fnDraw();
		}
	});
}

function createUser() {
	var parameter = {};
	parameter["id"] = $("#userId").val();
	parameter["passwd"] = $.md5($("#password").val());
	parameter["orgId"] = $("#orgId").val();
	parameter["name"] = $("#userName").val();
	parameter["email"] = $("#email").val();
	parameter["tel"] = $("#mobile").val();

	$.ajax({
		url : basePath+ "/sys/user/" + parameter["id"],
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			console.log("user exists"+data);
			if (data == "") {
				$.ajax({
					url : basePath+ "/sys/user",
					async : true,
					type : 'POST',
					data : parameter,
					success : function(data, textStatus) {
						hideDiv("#loginmodal-add");
						userTable.fnDraw();
					},
					error : function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
						if (jqXHR.responseText.indexOf(".") == -1) {
							$("#validateMessage").html(jqXHR.responseText);
						} else {
							var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
							window.location.href = path;
						}
						userTable.fnDraw();
					}
				});
			} else {
				$("#validateMessage").html("用户ID已存在，请重新输入");
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#validateMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			userTable.fnDraw();
		}
	});
}

function updateUser() {
	var parameter = {};
	parameter["id"] = $("#userId").val();
	parameter["orgId"] = $("#orgId").val();
	parameter["name"] = $("#userName").val();
	parameter["email"] = $("#email").val();
	parameter["tel"] = $("#mobile").val();
	$.ajax({
		url : basePath + "/sys/user",
		async : true,
		type : 'PUT',
		data : parameter,
		success : function(data, textStatus) {
			hideDiv("#loginmodal-add");
			userTable.fnDraw();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#validateMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			userTable.fnDraw();
		}
	});
}

function showDeleteConfirm() {
	var id = "";
	$("input[name='chkItem']").each(function(){
		if($(this).is(':checked')){
			id += $(this).val()+"@";
		}
	});
	if(""==id){
		setDivCss("#del-prompt");
		setTimeout("hideDiv('#del-prompt')", 2000);
		return ;
	}
	userId = id;
	setDivCss("#loginmodal-del");
}

function showResetConfirm() {
	var id = "";
	$("input[name='chkItem']").each(function(){
		if($(this).is(':checked')){
			id += $(this).val()+"@";
		}
	});
	if(""==id){
		setDivCss("#reset-prompt");
		setTimeout("hideDiv('#reset-prompt')", 2000);
		return ;
	} 
	userId = id;
	setDivCss("#loginmodal-resetpsw");
}

function showUserRole(id) {
	$("#roleErrorMessage").text("");
	userId = id;
	$.ajax({
		url : basePath + "/sys/userRole/" + id,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			var userRoles = eval(data);
			$("#userRoles").empty();
			if (userRoles.length > 0) {
				$.each(userRoles, function(index, userRole) {
					$("#userRoles").append("<option value='" + userRole["roleId"] + "'>" + userRole["roleName"] + "</option>");
				});
			}
			$.ajax({
				url : basePath + "/sys/role/user/" + encodeURI(encodeURI(id)),
				async : true,
				type : 'GET',
				success : function(data, textStatus) {
					var sysRoles = eval(data);
					$("#sysRoles").empty();
					if (sysRoles.length > 0) {
						$.each(sysRoles, function(index, sysRole) {
							$("#sysRoles").append("<option value='" + sysRole["id"] + "'>" + sysRole["name"] + "</option>");
						});
					}
					setDivCss("#loginmodal-set");
				},
				error : function(jqXHR, textStatus, errorThrown) {
					if (jqXHR.responseText.indexOf(".") == -1) {
						$("#roleErrorMessage").html(jqXHR.responseText);
					} else {
						var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
						window.location.href = path;
					}
				}
			});

		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#roleErrorMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
//				window.location.href = path;
			}
		}
	});
}
function resetUserPass() {
	$.ajax({
		url : basePath + "/sys/user/reset/" + userId,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			hideDiv("#loginmodal-resetpsw");
			setDivCss("#reset-success");
			setTimeout("hideDiv('#reset-success')", 2000);
			userTable.fnDraw();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				hideDiv("#loginmodal-resetpsw");
				setDivCss("#reset-failure");
				setTimeout("hideDiv('#reset-failure')", 2000);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			userTable.fnDraw();
		}
	});
}

function deleteUser() {
	$.ajax({
		url : basePath + "/sys/user/" + userId,
		async : true,
		type : 'DELETE',
		success : function(data, textStatus) {
			hideDiv("#loginmodal-del");
			setDivCss("#del-success");
			setTimeout("hideDiv('#del-success')", 1000);
			userTable.fnDraw();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				hideDiv("#loginmodal-del");
				setDivCss("#del-failure");
				setTimeout("hideDiv('#del-failure')", 1000);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
//				window.location.href = path;
			}
			userTable.fnDraw();
		}
	});
	$('#allcb').attr("checked",false);
}


function addRoles() {
	var selectedOptions = $('#sysRoles option:selected');
	$.each(selectedOptions, function(index, selectedOption) {
		var value = $(selectedOption).val();
		var content = $(selectedOption).text();
		$("#userRoles").append("<option value='" + value + "'>" + content + "</option>");
	});
	$('#sysRoles option:selected').remove();
}

function removeRoles() {
	var selectedOptions = $('#userRoles option:selected');
	$.each(selectedOptions, function(index, selectedOption) {
		var value = $(selectedOption).val();
		var content = $(selectedOption).text();
		$("#sysRoles").append("<option value='" + value + "'>" + content + "</option>");
	});
	$('#userRoles option:selected').remove();
}

function back() {
	$("#main", window.parent.document).load("user.jsp", function(response, status, xhr) {
		if (status == "error") {
			var path = response.replace(/^\"|\"$/g, '');
			window.location.href = path;
		}
	});
}
