/*
 * 图层查询条件输入框交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 图层查询处理方法
 */
function searchLayers() {
	// 根据名称查询图层信息
	getLayerInfos();
	// 显示图层信息列表
	showLayerList();
	// 清除地图图层
	clearMapWithBaseLayer();
	$("#layerName").focus();
}