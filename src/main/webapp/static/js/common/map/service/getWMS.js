/*
 * WMS瓦片服务交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * wms属性查询处理方法
 * 
 * @param evt 点击事件
 */
function showInfoWmsDefine(feature) {
	if (selectedBusLayers.size() > 0 || selectedBaseLayers.size() > 0) {
		var layerNames = "";
		// 保存选取的业务图层名称
		for (var i = 0; i < selectedBusLayers.size(); i++) {
			if (i == 0) {
				var key = selectedBusLayers.keys[i];
				layerNames = selectedBusLayers.get(key).serviceKey;
			} else {
				var key = selectedBusLayers.keys[i];
				layerNames += "," + selectedBusLayers.get(key).serviceKey;
			}
		}
		// 保存选取的基础图层名称
		for (var j = 0; j < selectedBaseLayers.size(); j++) {
			if (layerNames == "") {
				var key = selectedBaseLayers.keys[i];
				layerNames = selectedBaseLayers.get(key).serviceKey;
			} else {
				var key = selectedBaseLayers.keys[i];
				layerNames += "," + selectedBaseLayers.get(key).serviceKey;
			}
		}
		//var pixels = evt.xy;
		//var lonlat = map.getLonLatFromPixel(pixels);
		var point = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
		// 获得地图分辨率
		var resolution = map.getResolution();
		// 根据中心点和半径构建多边形
		var polygon = new OpenLayers.Geometry.Polygon.createRegularPolygon(point, resolution * 12, 4);
		var wkt_c = new OpenLayers.Format.WKT();
		var geoStr = wkt_c.extractGeometry(polygon);// 获取多边形的wkt值
		getLayerFeature(layerNames, geoStr, point);
	} else {
		alertMsg("请勾选需要查看的图层!", 0);
	}

	// 清除鼠标样式和点击事件
	map.div.style.cursor = "";
	map.layerContainerDiv.style.cursor = "";
	map.events.unregister("click", map, showInfoWmsDefine);

	OpenLayers.Event.stop(evt);
}
