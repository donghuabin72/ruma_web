/*
 * 业务模块菜单交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 模块tab页点击事件处理方法
 * 
 * @param id 模块ID
 */
function setModelId(id) {
	//切换模块时，清空selectedBusLayers业务图层
	selectedBusLayers = new HashMap();
	// 设置模块ID
	modelId = id;
	// 设置查询类型(0:空间区域检索、1:条件检索)
	queryType = -1;
	// 设置画面显示类型（0:图层列表;1:结果列表;2:查询界面）
	pageType = 0;
	// 设置属性查看方式标志位（0:wms查看、1:wfs查看）
	flagAttInfo = 0;

	/*
	 * 清除画面显示项目
	 */
	// 清除测算地图显示项目
	disMeasureTool.clearAllFeatures();
	// 清除地图图层
	clearMapWithBaseLayer();
	// 清除属性显示相关设置
	cancleAttrInfo();

	// 设置模块tab样式
	setModelTabStyle();

	// 查询图层列表
	searchLayers();
	// 图层查询条件输入框清空
	$("#layerName").val("");
	// 设置模块名称
	setModelName();
}

/**
 * 设置模块tab样式
 */
function setModelTabStyle() {
	$("#model0").removeClass("ued_nav_visited");
	$("#model1").removeClass("ued_nav_visited");
	$("#model2").removeClass("ued_nav_visited");
	$("#model3").removeClass("ued_nav_visited");
	$("#model4").removeClass("ued_nav_visited");
	$("#model5").removeClass("ued_nav_visited");
	$("#model6").removeClass("ued_nav_visited");
	$("#model7").removeClass("ued_nav_visited");
	$("#model8").removeClass("ued_nav_visited");
	$("#model" + modelId).toggleClass("ued_nav_visited");

	$("#min-model0").removeClass("ued_nav_mini_visited");
	$("#min-model1").removeClass("ued_nav_mini_visited");
	$("#min-model2").removeClass("ued_nav_mini_visited");
	$("#min-model3").removeClass("ued_nav_mini_visited");
	$("#min-model4").removeClass("ued_nav_mini_visited");
	$("#min-model5").removeClass("ued_nav_mini_visited");
	$("#min-model6").removeClass("ued_nav_mini_visited");
	$("#min-model7").removeClass("ued_nav_mini_visited");
	$("#min-model8").removeClass("ued_nav_mini_visited");
	$("#min-model" + modelId).toggleClass("ued_nav_mini_visited");
	
	$("#min-model" + modelId).parent('li').addClass('cd-selected').siblings('li').removeClass('cd-selected');
	var selectedItem = $('.cd-selected'),
	leftPosition = selectedItem.offset().left;
 
	$('.cd-marker').css({
		'left': leftPosition,
	});
}

/**
 * 设置业务模块名称
 */
function setModelName() {
	var modelName = "模块名称";
	switch (parseInt(modelId)) {
	case 0:
		modelName = "基础地理";
		break;
	case 1:
		modelName = "业务模块1";
		break;
	case 2:
		modelName = "业务模块2";
		break;
	case 3:
		modelName = "业务模块3";
		break;
	case 4:
		modelName = "业务模块4";
		break;
	case 5:
		modelName = "业务模块5";
		break;
	case 6:
		modelName = "业务模块6";
		break;
	case 7:
		modelName = "业务模块7";
		break;
	case 8:
		modelName = "业务模块8";
		break;
	}
	$('#modelName').html(modelName);
	$('#modelNameMin').html(modelName);
	return modelName;
}