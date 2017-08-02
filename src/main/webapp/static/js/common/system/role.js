$(document).ready(function() {
	init();
	$(".add_actions").html($("#addRole").html());
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
	$("#delCancelDiv").click(function(){
		hideDiv("#loginmodal-del");
	});
	
	$("#roleCancleDiv").click(function(){
		hideDiv("#loginmodal-role");
	});
	$("#roleCloseDiv").click(function(){
		hideDiv("#loginmodal-role");
	});
	

});

var roleTable;
var roleId;

function init() {
	roleTable = $('#roleTable').dataTable(
			{
				"aaSorting" : [ [ 1, 'asc' ] ],
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
					$("#roleTableProcess").html("加载数据中,请稍候...");
					setDivCss("#roleProcess");
				},
				"drawCallback" : function(settings) {
					hideDiv("#roleProcess");
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
					"url" : basePath + "/sys/role",
					"error" : function(jqXHR, textStatus) {
						var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
						window.location.href = path;
					}
				},
				"columns" : [ {
					"data" : "id",
				}, {
					"data" : "name"
				}, {
					"data" : "description"
				} ],
				"columnDefs" : [
						{
							"targets" : [ 0 ],
							"render" : function(data, type, full) {
								return "<input type=\"checkbox\" name=\"chkItem\" value=\""+full.id+"\">";
							}
						},
						{
							"targets" : [ 3 ],
							"data" : "id",
							"render" : function(data, type, full) {
								return "<a class=\"icon-btn\" title=\"分配权限\" id=\"modaltrigger-role\" onclick=\"showRoleRights('"+ data + "')\"><span class=\"icon-key-01 f18 text-blue\"></span></a><a class=\"icon-btn\" title=\"修改角色信息\" onclick=\"detail('"+ data + "')\"><span class=\"icon-info-block f18 text-blue\"></span></a>";
							}
						} ]
			});
}

function showCreateDiv() {
	$(".icon-clear").prev().text("新增角色");
	$("#name").val("");
	$("#description").val("");

	$("#validateMessage").html("");

	$("#operate").val("create");
	$("#errorMessage").html("");
	setDivCss("#loginmodal-add");
	$("#name").focus();
}

function detail(id) {
	$(".icon-clear").prev().text("修改角色信息");
	$("#errorMessage").html("");
	$("#validateMessage").html("");
	$("#operate").val("");
	$.ajax({
		url : basePath + "/sys/role/" + id,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			var jsonData = eval(data);
			$("#name").val(jsonData["name"]);
			$("#description").val(jsonData["description"]);
			$("#roleId").val(jsonData["id"]);
			setDivCss("#loginmodal-add");
			$("#name").focus();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#errorMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			roleTable.fnDraw();
		}
	});
}

function operateRole() {
	var name = $("#name").val();
	var description = $("#description").val();
	var opType = $("#operate").val();
	$("#errorMessage").html("");
	if (name.replace(/\s/g, "") == "") {
		$("#validateMessage").html("请输入角色名称");
		$("#name").focus();
		return;
	}
	if (checkLen(name, 20)) {
		$("#validateMessage").html("名称长度不能超过20个字符");
		$("#name").focus();
		return;
	}

	if (checkLen(description, 200)) {
		$("#validateMessage").html("描述长度不能超过200个字符");
		$("#description").focus();
		return;
	}

	if (opType == "create") {
		createRole();
	} else {
		updateRole();
	}
}

function createRole() {
	var parameter = {};
	parameter["name"] = $("#name").val();
	parameter["description"] = $("#description").val();
	$.ajax({
		url : basePath + "/sys/role/getRoleByName/" + parameter["name"],
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			var roles = eval(data);
			if(roles.length==0) {
				$.ajax({
					url : basePath + "/sys/role",
					async : true,
					type : 'POST',
					data : parameter,
					success : function(data, textStatus) {
						hideDiv("#loginmodal-add");
						roleTable.fnDraw();
					},
					error : function(jqXHR, textStatus, errorThrown) {
						if (jqXHR.responseText.indexOf(".") == -1) {
							$("#errorMessage").html(jqXHR.responseText);
						} else {
							var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
							window.location.href = path;
						}
						roleTable.fnDraw();
					}
				});
			} else {
				$("#validateMessage").html("角色名称已存在，请重新输入");
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

function updateRole() {
	var parameter = {};
	parameter["name"] = $("#name").val();
	parameter["description"] = $("#description").val();
	parameter["id"] = $("#roleId").val();
	
	$.ajax({
		url : basePath + "/sys/role/updateValidate",
		async : true,
		type : 'GET',
		data : parameter,
		success : function(data, textStatus) {
			if (data=="") {
				$.ajax({
					url : basePath + "/sys/role",
					async : true,
					type : 'PUT',
					data : parameter,
					success : function(data, textStatus) {
						hideDiv("#loginmodal-add");
						roleTable.fnDraw();
					},
					error : function(jqXHR, textStatus, errorThrown) {
						if (jqXHR.responseText.indexOf(".") == -1) {
							$("#errorMessage").html(jqXHR.responseText);
						} else {
							var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
							window.location.href = path;
						}
						roleTable.fnDraw();
					}
				});
			} else {
				$("#validateMessage").html("角色名称已存在，请重新输入");
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
		return;
	}
	roleId = id;
	setDivCss("#loginmodal-del");

}

var sysSelectedNode;
var roleSelectedNode;

function showRoleRights(id) {
	roleId = id;
	// 加载系统权限树
	if ($("#sysModuleTree").jstree(true)) {
		$("#sysModuleTree").jstree(true).destroy(true);
	}
	$('#sysModuleTree').jstree({
		"core" : {
			"dblclick_toggle" : false,
			"multiple" : false,
			"animation" : 0,
			"check_callback" : true,
			"themes" : {
				"stripes" : true
			},
			'data' : {
				"url" : function(node) {
					if (node.id == "#") {
						return basePath + "/sys/module/role/" + roleId + "/null";
					} else {
						return basePath + "/sys/module/role/" + roleId + "/" + node.id;
					}
				},
				"dataType" : "json"
			}
		},
		"types" : {
			"#" : {
				"max_children" : 1,
				"max_depth" : 4,
				"valid_children" : [ "root" ]
			},
			"root" : {
				"valid_children" : [ "default" ]
			},
			"default" : {
				"valid_children" : [ "default", "file" ]
			},
			"file" : {
				"icon" : "glyphicon glyphicon-file",
				"valid_children" : []
			}
		},
		"plugins" : [ "state", "wholerow" ]
	}).on("dblclick.jstree", function(e) {
		var sysModuleTree = $("#sysModuleTree").jstree(true);
		sysSelectedNode = sysModuleTree.get_node(e.target);
		addRoles();
	}).on("loaded.jstree", function(e, data) {
		$("#sysModuleTree").jstree(true).open_all();
	}).on("click.jstree", function(e, data) {
		var node = $("#sysModuleTree").jstree(true).get_node(e.target);
		sysSelectedNode = node;
		roleSelectedNode = null;
	});
	$("#sysModuleTree").show();

	// 加载角色权限树
	if ($("#roleModuleTree").jstree(true)) {
		$("#roleModuleTree").jstree(true).destroy(true);
	}
	$('#roleModuleTree').jstree({
		"core" : {
			"dblclick_toggle" : false,
			"multiple" : false,
			"animation" : 0,
			"check_callback" : true,
			"themes" : {
				"stripes" : true
			},
			'data' : {
				"url" : function(node) {
					if (node.id == "#") {
						return basePath + "/sys/roleRights/" + roleId + "/null";
					} else {
						return basePath + "/sys/roleRights/" + roleId + "/" + node.id;
					}
				},
				"dataType" : "json"
			}
		},
		"types" : {
			"#" : {
				"max_children" : 1,
				"max_depth" : 4,
				"valid_children" : [ "root" ]
			},
			"root" : {
				"valid_children" : [ "default" ]
			},
			"default" : {
				"valid_children" : [ "default", "file" ]
			},
			"file" : {
				"icon" : "glyphicon glyphicon-file",
				"valid_children" : []
			}
		},
		"plugins" : [ "state", "wholerow" ]
	}).on("dblclick.jstree", function(e) {
		var roleModuleTree = $("#roleModuleTree").jstree(true);
		roleSelectedNode = roleModuleTree.get_node(e.target);
		removeRoles();
	}).on("loaded.jstree", function(e, data) {
		$("#roleModuleTree").jstree(true).open_all();
	}).on("click.jstree", function(e, data) {
		var node = $("#roleModuleTree").jstree(true).get_node(e.target);
		roleSelectedNode = node;
		sysSelectedNode = null;
	});
	$("#roleModuleTree").show();

	setDivCss("#loginmodal-role");
}
function validation(){
	$.ajax({
		url : basePath + "/sys/userRole/role/" + roleId,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			var jsonData = eval(data);
			if (jsonData.length > 0) {
				hideDiv("#loginmodal-del");
				$("#failedMessage").text(jsonData+"角色已分配给用户，无法删除！");
				setDivCss("#validation-prompt");
				setTimeout("hideDiv('#validation-prompt')", 3000);
			} else {
				deleteRole();
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
			window.location.href = path;
		}
	});

}
function deleteRole() {
	$.ajax({
		url : basePath + "/sys/role/" + roleId,
		async : true,
		type : 'DELETE',
		success : function(data, textStatus) {
			hideDiv("#loginmodal-del");
			setDivCss("#del-success");
			setTimeout("hideDiv('#del-success')", 1000);
			roleTable.fnDraw();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				hideDiv("#loginmodal-del");
				setDivCss("#del-failure");
				setTimeout("hideDiv('#del-failure')", 1000);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			roleTable.fnDraw();
		}
	});
	$('#allcb').attr("checked",false);
}

function addRoles() {
	if (!sysSelectedNode) {
		return false;
	}

	var sysModuleTree = $("#sysModuleTree").jstree(true);
	var roleModuleTree = $("#roleModuleTree").jstree(true);
	// 创建当前选中节点的上级节点目录结构
	var nodePath = sysSelectedNode.parents.reverse();
	$.each(nodePath, function(index, parentNodeId) {
		if (!roleModuleTree.get_node(parentNodeId)) {
			var parentNode = sysModuleTree.get_node(parentNodeId);
			roleModuleTree.create_node(nodePath[index - 1], {
				id : parentNode.id,
				text : parentNode.text
			});
		}
	});
	// 创建当前选中节点及其下级节点目录结构
	sysSelectedNode.parents.reverse();
	createNodes(sysModuleTree, roleModuleTree, sysSelectedNode.parents[0], sysSelectedNode.id);

	// 系统权限树上删除当前节点，并级联删除上级节点
	sysModuleTree.delete_node(sysSelectedNode.id);
	$.each(sysSelectedNode.parents, function(index, parentNodeId) {
		if (sysModuleTree.get_node(parentNodeId).children.length == 0) {
			sysModuleTree.delete_node(parentNodeId);
		}
	});

	roleSelectedNode = sysSelectedNode;
	sysSelectedNode = null;
	roleModuleTree.open_all();
}

function removeRoles() {
	if (!roleSelectedNode) {
		return false;
	}

	var sysModuleTree = $("#sysModuleTree").jstree(true);
	var roleModuleTree = $("#roleModuleTree").jstree(true);
	// 创建当前选中节点的上级节点目录结构
	var nodePath = roleSelectedNode.parents.reverse();
	$.each(nodePath, function(index, parentNodeId) {
		if (!sysModuleTree.get_node(parentNodeId)) {
			var parentNode = roleModuleTree.get_node(parentNodeId);
			sysModuleTree.create_node(nodePath[index - 1], {
				id : parentNode.id,
				text : parentNode.text
			});
		}
	});

	// 创建当前选中节点及其下级节点目录结构
	roleSelectedNode.parents.reverse();
	createNodes(roleModuleTree, sysModuleTree, roleSelectedNode.parents[0], roleSelectedNode.id);

	// 用户权限树上删除当前节点，并级联删除上级节点
	roleModuleTree.delete_node(roleSelectedNode.id);
	$.each(roleSelectedNode.parents, function(index, parentNodeId) {
		if (roleModuleTree.get_node(parentNodeId).children.length == 0) {
			roleModuleTree.delete_node(parentNodeId);
		}
	});

	sysSelectedNode = roleSelectedNode;
	roleSelectedNode = null;
	sysModuleTree.open_all();
}

function operateRoleRights() {
	var nodes = $("#roleModuleTree").jstree(true)._model.data;
	var rights = "";
	$.each(nodes, function(index, node) {
		if (node.id != "#") {
			rights = rights + node.id + ",";
		}
	});
	var parameter = {};
	parameter["roleId"] = roleId;
	parameter["rights"] = rights;
	$.ajax({
		url : basePath + "/sys/roleRights",
		async : true,
		type : 'POST',
		data : parameter,
		success : function(data, textStatus) {
			hideDiv("#loginmodal-role");
			roleTable.fnDraw();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#roleErrorMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			roleTable.fnDraw();
		}
	});
}

function createNodes(fromTree, toTree, parentId, nodeId) {
	// 创建当前节点
	var curNode = fromTree.get_node(nodeId);
	if(!toTree.get_node(nodeId)){
		toTree.create_node(parentId, {
			id : curNode.id,
			text : curNode.text
		});
	}

	// 遍历当前节点的子节点
	var subChildrens = curNode.children;
	for (var i = 0; i < subChildrens.length; i++) {
		// 创建子节点
		if(!toTree.get_node(fromTree.get_node(subChildrens[i]).id)){
			toTree.create_node(nodeId, {
				id : fromTree.get_node(subChildrens[i]).id,
				text : fromTree.get_node(subChildrens[i]).text
			});
		}
		var subSubChildernNodes = fromTree.get_node(subChildrens[i]).children;
		// 存在孙子节点时，向下遍历
		if (subSubChildernNodes.length > 0) {
			// 遍历当前节点的孙子节点
			for (var j = 0; j < subSubChildernNodes.length; j++) {
				var subSubChildernNode = fromTree.get_node(subSubChildernNodes[j]);
				// 创建孙子节点
				if(!toTree.get_node(subSubChildernNode.id)){
					toTree.create_node(subChildrens[i], {
						id : subSubChildernNode.id,
						text : subSubChildernNode.text
					});
				}

				// 孙子节点还有子节点(递归调用)
				if (fromTree.get_node(subSubChildernNode.id).children.length > 0) {
					for (var k = 0; k < fromTree.get_node(subSubChildernNode.id).children.length; k++) {
						createNodes(fromTree, toTree, subSubChildernNode.id, fromTree.get_node(subSubChildernNode.id).children[k]);
					}
				} else {
					// 孙子节点是叶子节点，不做任何处理
				}
			}
		} else {
			// 不存在孙子节点时，不做任何处理
		}
	}
}