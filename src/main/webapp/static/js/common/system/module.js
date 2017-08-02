$(document).ready(function() {
	init();
	$(".add_actions").html($("#addModule").html());
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
	
	new SelectorJS.selector.init({
		id: '#ServiceNon',
		data: [
			["GET", "GET"],
			["POST", "POST"],
			["DELETE", "DELETE"],
			["PUT", "PUT"]
		]
	});
});

var moduleTable;
var moduleId;

function init() {
	moduleTable = $('#moduleTable').dataTable( {
			"aaSorting" : [ [ 0, 'asc' ] ],
	    	"language" : {
				"lengthMenu" : "每页 _MENU_ 行",
				"info" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
				"zeroRecords" : "未查询到任何记录",
				"infoEmpty" : "没有满足条件的记录",
				"infoFiltered" : "(共有 _MAX_ 条记录)",
				"search" : "",
				"sSearchPlaceholder":"搜索...",
				"processing": "处理中...",
				"paginate" : {
					"first" : "首页",
					"previous" : "前一页",
					"next" : "后一页",
					"last" : "尾页"
				}
			},
			"preDrawCallback": function( settings ) {
			    $("#moduleTableProcess").html("加载数据中,请稍候...");
			    setDivCss("#moduleProcess");
			},
			"drawCallback": function( settings ) {
				hideDiv("#moduleProcess");
			},
			"bAutoWidth": true,
			"processing" : false,
			 "iDisplayLength":15,
			"lengthChange": false,
			"serverSide" : true,
			"bSort": false,
			"sDom":"<'add_actions_f'f><'add_actions'>tip",
	        "oClasses":{"sFilterInput":"custom-search"},
			"ajax" : {
				   "url": basePath + "/sys/module",
				   "error": function (jqXHR, textStatus) { 
						var path = jqXHR.responseText.replace(/^\"|\"$/g,'');
						window.location.href = path;
				   	}
			 },
			"columns" : [ 
			              {	"data" : "id"}, 
			              {	"data" : "id"}, 
			              {	"data" : "name"	}, 
			              {	"data" : "operations"	}, 
			              {	"data" : "description"},
			              {	"data" : "parentName"}, 
			              {	"data" : "requestUrl"}, 
			              {	"data" : "requestMethod"}],
	        "columnDefs": [{
				"targets" : [ 0 ],
				"render" : function(data, type, full) {
					return "<input type=\"checkbox\" name=\"chkItem\" value=\""+full.id+"\">";
				}
				}, {
		         	"targets": [8],
		            "data": "id", 
		            "render": function ( data, type, full ) {
		            	return "<a class=\"icon-btn\" title=\"修改模块信息\" onclick=\"detail('"+ data + "')\"><span class=\"icon-info-block f18 text-blue\"></span></a>";  
		            }
	 		}]
	    } );
}

function showCreateDiv() {
	$(".icon-clear").prev().text("新增模块");
	$("#moduleId").removeAttr("readonly");

	$("#moduleId").val("");
	$("#url").val("");
	$(".text-select").val("请选择");
	$("#ServiceNon").children("dt").text("请选择");
	$("#method").val("");
	$("#name").val("");
	$("#parentModuleId").val("");
	$("#parentModuleName").val("");
	$("#description").val("");

	$("#validateMessage").html("");
	$("#parentModuleTree").html("");
	$("#operate").val("create");
	setDivCss("#loginmodal-add");
	$("#moduleId").focus();
}

function detail(id) {
	$(".icon-clear").prev().text("修改模块信息");
	$("#moduleId").attr("readonly", "readonly");
	$("#validateMessage").html("");
	$("#parentModuleTree").html("");
	$.ajax({
		url : basePath + "/sys/module/" + id,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			var jsonData = eval(data);
			$("#moduleId").val(jsonData["id"]);
			$("#url").val(jsonData["requestUrl"]);
			if (jsonData["requestMethod"] == null) {
				$("#ServiceNon").children("dt").text("请选择");
			} else {
				$("#ServiceNon").children("dt").text(jsonData["requestMethod"]);
				$("#method").val(jsonData["requestMethod"]);
			}
			$("#name").val(jsonData["name"]);
			$("#parentModuleId").val(jsonData["parentId"]);
			$("#parentModuleName").val(jsonData["parentName"]);
			$("#description").val(jsonData["description"]);
			$("#operate").val("");
			setDivCss("#loginmodal-add");
			$("#moduleId").focus();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#validateMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			moduleTable.fnDraw();
		}
	});
}

function operateModule() {
	var moduleId = $("#moduleId").val();
	var name = $("#name").val();
	var opType = $("#operate").val();

	if (moduleId.replace(/\s/g, "") == "") {
		$("#validateMessage").html("请输入模块ID");
		$("#moduleId").focus();
		return;
	}
	if (checkLen(moduleId, 60)) {
		$("#validateMessage").html("模块ID长度不能超过60位");
		$("#moduleId").focus();
		return;
	}

	if (name.replace(/\s/g, "") == "") {
		$("#validateMessage").html("请输入模块名称");
		$("#name").focus();
		return;
	}
	if (checkLen(name, 20)) {
		$("#validateMessage").html("模块名称长度不能超过20位");
		$("#moduleId").focus();
		return;
	}

	var url = $("#url").val();
	if (checkLen(url, 60)) {
		$("#validateMessage").html("请求url长度不能超过60位");
		$("#url").focus();
		return;
	}

	var description = $("#description").val();
	if (checkLen(description, 200)) {
		$("#validateMessage").html("描述长度不能超过200个字符");
		$("#description").focus();
		return;
	}

	if (opType == "create") {
		createModule();
	} else {
		updateModule();
	}
}

function createModule() {
	var parameter = {};
	parameter["moduleId"] = $("#moduleId").val();
	parameter["url"] = $("#url").val();
	parameter["method"] = $("#method").val();
	parameter["name"] = $("#name").val();
	parameter["parentId"] = $("#parentModuleId").val();
	parameter["description"] = $("#description").val();
	
	$.ajax({
		url : basePath + "/sys/module/" + parameter["moduleId"],
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			if (data == "") {
				$.ajax({
					url : basePath + "/sys/module",
					async : true,
					type : 'POST',
					data : parameter,
					success : function(data, textStatus) {
						hideDiv("#loginmodal-add");
						moduleTable.fnDraw();
					},
					error : function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
						if (jqXHR.responseText.indexOf(".") == -1) {
							$("#validateMessage").html(jqXHR.responseText);
						} else {
							var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
							window.location.href = path;
						}
						moduleTable.fnDraw();
					}
				});
			} else {
				$("#validateMessage").html("模块ID已存在，请重新输入");
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText.indexOf(".") == -1) {
				$("#validateMessage").html(jqXHR.responseText);
			} else {
				var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
				window.location.href = path;
			}
			moduleTable.fnDraw();
		}
	});
}

function updateModule() {
	var parameter = {};
	parameter["moduleId"] = $("#moduleId").val();
	parameter["url"] = $("#url").val();
	parameter["method"] = $("#method").val();
	parameter["name"] = $("#name").val();
	parameter["parentId"] = $("#parentModuleId").val();
	parameter["description"] = $("#description").val();
	
	$.ajax({
		url : basePath + "/sys/module/validate/" + parameter["moduleId"] +"@"+parameter["parentId"],
		async : true,
		type : 'GET',
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.flag == "0") {
				$.ajax({
					url : basePath + "/sys/module",
					async : true,
					type : 'PUT',
					data : parameter,
					success : function(data, textStatus) {
						hideDiv("#loginmodal-add");
						moduleTable.fnDraw();
					},
					error : function(jqXHR, textStatus, errorThrown) {
						if (jqXHR.responseText.indexOf(".") == -1) {
							$("#validateMessage").html(jqXHR.responseText);
						} else {
							var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
							window.location.href = path;
						}
						moduleTable.fnDraw();
					}
				});
			} else if(data.flag == "-1"){
				$("#validateMessage").html("父模块不能选择当前模块");
			}else{
				$("#validateMessage").html("父模块不能选择当前模块的子模块");
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
	moduleId = id;
	setDivCss("#loginmodal-del");
}

function deleteModule() {
	$.ajax({
		url : basePath + "/sys/module/" + moduleId,
		async : true,
		type : 'DELETE',
		success : function(data, textStatus) {
			hideDiv("#loginmodal-del");
			setDivCss("#del-success");
			setTimeout("hideDiv('#del-success')", 1000);
			moduleTable.fnDraw();
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
			moduleTable.fnDraw();
		}
	});
}

function setRequestType(type) {
	$("#method").html(type + "<span class='caret'></span>");
	$('.dropdown-toggle').dropdown('toggle');
}

function showParentModule() {
	if ($("#parentModuleTree").jstree(true)) {
		$("#parentModuleTree").jstree(true).destroy(true);
	}
	$('#parentModuleTree').jstree({
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
						return basePath + "/sys/tree/module/null" + "@" +$("#moduleId").val();
					} else {
						return basePath + "/sys/tree/module/" + node.id + "@" + $("#moduleId").val();
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
		var obj = $("#parentModuleTree").jstree(true).get_node(e.target);
		if (!obj) {
			return false;
		}
		$("#parentModuleTree").hide();
		$("#parentModuleId").val(obj.id);
		$("#parentModuleName").val(obj.text);
	}).on("loaded.jstree", function(e, data) {
		$("#parentModuleTree").jstree(true).open_all(-1); // -1 opens all nodes in the container
	});
	$("#parentModuleTree").show();
}