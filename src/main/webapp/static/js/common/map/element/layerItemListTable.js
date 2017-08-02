/*
 * 图层项目显示表格交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 返回按钮点击处理方法
 */
function backToSearchPage() {
	// 查询结果隐藏
	$("#layerItemListDiv").hide();
	// 分页工具栏隐藏
	$("#dataTableDiv_paginate").hide();
	// 操作工具栏（收起、返回、导出）隐藏
	$(".actions").hide();
	if (queryType == 0) {
		$("#conditionSearchDiv").show();
	} else {
		$("#polygonSearchDiv").show();
	}
	// 清除属性查询相关项目
	cancleAttrInfo();
	// 清除空间查询条件图层
	searchConditionLayer.removeAllFeatures();
	// 清除查询结果图层
	searchResultLayer.removeAllFeatures();
	// 重置全局变量
	queryType = -1;
	pageType = 2;
	panBounds = null;
}

/**
 * 空间查询加载查询结果画面
 * 
 * @param data 查询结果数据
 * @param totalObj 合计结果
 * @param firstItemDataIndex 显示项目
 * @param title 数据标题项目名称
 */
function loadSearchResultTable(data, totalObj, firstItemDataIndex, title) {
	$("#conditionSearchDiv").hide();
	$("#polygonSearchDiv").hide();
	$('#layerItemListDiv').show();
	if (dataTable) {
		dataTable.fnDestroy();
	}
	dataTable = $('#layerItemListTable').NEDataTable({
		"data" : data,
		fnDrawCallback : function() {
			setPageStyle(this);
			createTotalRow("layerItemListTable", totalObj);
			//TODO 修正
//			setTableSize("layerItemListTable");
		},
		"columns" : [ {
			"title" : "index",
			"bSortable" : false,
			"className" : "dt-center",
			"visible" : false
		}, {
			"title" : "taskId",
			"createdCell" : function(td, cellData, rowData, row, col) {
				formatCell(td, rowData, firstItemDataIndex, title);
			}
		} ]
	});

	$("#layerItemListTable").css("width", "345px");
	$(".actions").html($("#layerItemListActionDiv").html());

	$("#layerItemListTable tbody").on("click", "tr", function() {
		highLightLayer.removeAllFeatures();
		$(this).addClass('selected');
		var viewName = $(this).find("span:hidden").first().html();
		var gid = $(this).find("span:hidden").last().html();
		getFeatureInfoById(viewName, gid);
	});
}

/**
 * 控制结果列表的显示与隐藏
 * 
 * @param flag 显示隐藏标志位（0:显示;1:隐藏）
 */
function switchLayerItemListTable(flag) {
	var mapName = setModelName();
	if (flag == 0) {
		$("#subNameHidDataTableQuery")[0].innerHTML = mapName;
		$("#collapseLayerItemListDiv").show();
		$("#layerItemListDiv").hide();
	} else {
		$("#layerItemListDiv").show();
		$("#collapseLayerItemListDiv").hide();
	}
}