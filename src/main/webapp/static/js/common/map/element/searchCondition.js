/*
 * 查询画面（空间查询/关键字查询）交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 加载关键字查询图层下拉列表
 * 
 * @param id 下拉列表控件ID
 * @param layers 选中图层信息列表
 * @param jspName 查询条件画面jsp文件名
 * @param rowId 图层ID
 * @param maxZoom 最大显示级别列表
 */
function loadConditionLayerList(id, layers, jspName, rowId, maxZoom) {
	for ( var layer in layers) {
		$("#" + id).append(
				"<li><a tabindex='-1' href='javascript:loadSearchConditionPage(\"searchCondition\", \"" + jspName + "\",\"" + layers[layer] + "\",\""
					+ rowId[layer] + "\",\"" + maxZoom[layer] + "\")'>" + layers[layer] + "</a></li>");
	}
}

/**
 * 点击关键字查询按钮,加载条件查询画面
 * 
 * @returns 加载结果
 */
function initConditionSearchPage() {
	$("#typeListCondition").html("");
	$("#typeListSpace").html("");
	if (selectedBusLayers.isEmpty()) {
		alertMsg("请选择一个可查询图层再进行查询！", 0);
		return false;
	} else {
		var length = selectedBusLayers.size();
		for (var i = 0; i < length; i++) {
			var key = selectedBusLayers.keys[i];
			var keyObj = selectedBusLayers.get(key);
			loadConditionLayerList("typeListCondition", {key : keyObj.name}, "../queryPage/" + keyObj.serviceKey.substring(7), {key : keyObj.id}, {key : keyObj.maxZoom});
			if (i == 0) {
				$("#searchCondition").load("../queryPage/" + keyObj.serviceKey.substring(7) + ".jsp");
				$("#defaultTypeCondition").html(keyObj.name + "<span class='caret'></span><span style='display:none'>" + keyObj.id + "," + keyObj.maxZoom + "</span>");
			}
		}
		return true;
	}
}

/**
 * 图层下拉列表框值改变时，加载查询条件窗口处理方法
 * 
 * @param id 查询条件显示div标识符
 * @param jspName 查询条件画面jsp名称
 * @param layerName 图层名称
 * @param rowId 图层ID
 * @param maxZoom 最大显示级别
 */
function loadSearchConditionPage(id, jspName, layerName, rowId, maxZoom) {
	$("#" + id).load(jspName + ".jsp");
	$("#defaultTypeCondition").html(layerName + "<span class='caret'></span><span style='display:none'>" + rowId + "," +maxZoom + "</span>");
}

/**
 * 显示关键字查询结果（查询结果表格和地图标识、查询画面调用）
 */
function showConditionSearchResult() {
	queryType = 1;
	pageType = 1;
	flagAttInfo = 1;
	panorama = "undo";

	var zoomObj = $("#defaultTypeCondition span:hidden").html().split(",")[1];
	if (zoomObj != null) {
		var zoom = zoomObj.trim();
		if (map.getZoom() < zoom) {
			map.zoomTo(zoom);
		}
	}

	var likeList = [], equalList = [], betweenList = [];
	for (var i = 0; i < conditionItem.size(); i++) {
		var columnId = conditionItem.keys[i];
		var type = conditionItem.get(columnId);
		if (type == "like") {
			likeList.push(columnId);
		} else if (type == "equal") {
			equalList.push(columnId);
		} else if (type == "between") {
			betweenList.push(columnId);
		}
	}
	var sqlWhere = formatSqlParameter({
		"like" : likeList,
		"equal" : equalList,
		"between" : betweenList
	});
	if (sqlWhere.indexOf("{error}") != -1) {
		closeMask();
		return;
	}
	searchTableName = selectedBusLayers.get(key).serviceKey;
	var parameter = {};
	parameter.tableName = searchTableName;
	parameter.sqlWhere = sqlWhere;
	if (sumField.size() > 0) {
		parameter.sumField = sumItem.get(sumItem.keys[0]);
	}

	$("#conditionSearchDiv").hide();
	$("#polygonSearchDiv").hide();
	$('#layerItemListDiv').show();
	if (dataTable) {
		$("#layerItemListTable tbody").off("click", "tr");
		dataTable.fnClearTable(false);
		dataTable.fnDestroy();
	}
	dataTable = $('#layerItemListTable').NEDataTable({
		"serverSide" : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"ajax" : {
			async : true,
			cache : false,
			type : "POST",
			url : projectName + "/layerFeature/getFeaturesByCondition",
			data : parameter,
			error : function(jqXHR, textStatus) {
				var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
				if (sessionOvertime == 'sessionOvertime') {
					sessionTimeout();
				}
			}
		},
		fnDrawCallback : function(obj) {
			setPageStyle(this);
			if (obj.json.sumValue) {
				var totalObj = {
					"合计" : obj.json.sumValue
				};
				createTotalRow("layerItemListTable", totalObj);
			}
			setTableSize("layerItemListTable");
		},
		"columns" : [ {
			"title" : "index",
			"bSortable" : false,
			"className" : "dt-center",
			"visible" : false
		}, {
			"title" : "taskId",
			"createdCell" : function(td, cellData, rowData, row, col) {
				var firstItemDataIndex={};
    			for ( var key in rowData) {
    				for ( var columnKey in firstItem.keys) {
    					if (key == firstItem.get(firstItem.keys[columnKey])) {
    						firstItemDataIndex[firstItem.keys[columnKey]] = orderNo;
    					}
    				}
    				orderNo++;
    			}
				formatCell(td, rowData, firstItemDataIndex, mapListTitle);
			}
		} ],
		aoColumnDefs : [ {
			sDefaultContent : '',
			aTargets : [ '_all' ]
		} ]
	});
	$("#layerItemListTable").css("width", "345px");
	$(".actions").html($("#layerItemListActionDiv").html());

	panBounds = map.getExtent();
	$("#layerItemListTable tbody").on("click", "tr", function() {
		highLightLayer.removeAllFeatures();
		dataTable.$('tr.selected').removeClass('selected');
		$(this).addClass('selected');
		var viewName = $(this).find("span:hidden").first().html();
		var gid = $(this).find("span:hidden").last().html();
		getFeatureInfoById(viewName, gid);
	});

	// 地图显示查询结果
	searchFeaturesByCondition();
	// 注册地图拖动显示查询结果事件
	map.events.register("moveend", map, searchFeaturesByCondition);
}