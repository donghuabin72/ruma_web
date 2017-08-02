/*
 * 共通js方法实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 点、线、面图层显示顺序排序
 */
function sortLayers() {
	var layerIndex = 201;
	var layersIndex = map.layers;
	for (var i = 0; i < layersIndex.length; i++) {
		var layersCurrent = map.layers[i].name;
		if (layersCurrent.indexOf(geoServerLayerPrefix) == -1) {
			map.layers[i].setZIndex(200);
		}
	}
	for (var i = 0; i < selectedLayers.size(); i++) {
		var key = selectedLayers.keys[i];
		var serviceKey = selectedLayers.get(key).serviceKey;
		var value = selectedLayers.get(key);
		if (value.geomType == "POLYGON") {
			var layer = getLayer(serviceKey);
			if (layer) {
				layer.setZIndex(layerIndex);
				layerIndex += 10;
			}
		}
	}
	for (var i = 0; i < selectedLayers.size(); i++) {
		var key = selectedLayers.keys[i];
		var serviceKey = selectedLayers.get(key).serviceKey;
		var value = selectedLayers.get(key);
		if (value.geomType == "LINE") {
			var layer = getLayer(serviceKey);
			if (layer) {
				layer.setZIndex(layerIndex);
				layerIndex += 10;
			}
		}
	}
	for (var i = 0; i < selectedLayers.size(); i++) {
		var key = selectedLayers.keys[i];
		var serviceKey = selectedLayers.get(key).serviceKey;
		var value = selectedLayers.get(key);
		if (value.geomType == "POINT") {
			var layer = getLayer(serviceKey);
			if (layer) {
				layer.setZIndex(layerIndex);
				layerIndex += 10;
			}
		}
	}
	changeSelectVectorIndex();
}

/**
 * 根据图层名称获得图层对象
 * 
 * @param layerName 图层名称
 * @returns 图层对象
 */
function getLayer(layerName) {
	var layers = map.layers;
	var len = layers.length;
	var returnLayer = null;
	for (var i = 0; i < len; i++) {
		var layersName = layers[i].name;
		if (layersName == layerName) {
			returnLayer = layers[i];
		}
	}
	return returnLayer;
}

/**
 * 根据图层名称移除图层
 * 
 * @param layerName 图层名称
 */
function removeLayer(layerName) {
	var layers = map.layers;
	var len = layers.length;
	var removeLayer = null;
	for (var i = 0; i < len; i++) {
		if(layers[i] == undefined){
			continue;
		}
		var layersName = layers[i].name;
		var temp = "mk_"+layerName;
		if (layersName == layerName||layersName==temp) {//modify by donghb
			removeLayer = layers[i];
			if (removeLayer) {
				map.removeLayer(removeLayer);
			}
		}
	}
}

/**
 * 清空图层（保留基础图层）
 */
function clearMapWithBaseLayer() {
	var layers = map.layers;
	var len = layers.length;
	for (var i = len; i > 0; i--) {
		var layer = layers[i - 1];
		var layerName = layer.name;
		var flagRemove = true;
		// 基础数据图层若被勾选，则保留
		for (var j = 0; j < selectedBaseLayers.size(); j++) {
			var key = selectedBaseLayers.get(selectedBaseLayers.keys[j]);
			if (key == layerName) {
				flagRemove = false;
				break;
			}
		}
		if (layerName != null) {
			if (layerName.indexOf(geoServerLayerPrefix) > -1 && flagRemove) {
				map.removeLayer(layer);
			}
		}
	}
	disMeasureTool.clearAllFeatures();
	searchResultLayer.removeAllFeatures();
	selectVector.removeAllFeatures();
}

/**
 * 设置最大显示范围，防止显示全部查询结果时地图显示过小
 */
function suitBound() {
	if (panorama == "doing") {
		var resultBound = searchResultLayer.getDataExtent();
		// 设置最大显示范围
		var maxBound = new OpenLayers.Bounds(13341266.2131, 4681884.495, 13828321.2448, 5009755.7291);
		if (resultBound.left < maxBound.left) {
			resultBound.left = maxBound.left;
		}
		if (resultBound.bottom < maxBound.bottom) {
			resultBound.bottom = maxBound.bottom;
		}
		if (resultBound.right > maxBound.right) {
			resultBound.right = maxBound.right;
		}
		if (resultBound.top > maxBound.top) {
			resultBound.top = maxBound.top;
		}
		if (resultBound) {
			map.zoomToExtent(resultBound, false);
			panBounds = resultBound;
		}
		panorama = "done";
	}
}