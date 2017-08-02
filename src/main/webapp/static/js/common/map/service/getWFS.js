/*
 * WFS瓦片服务交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * wfs属性查询处理方法（地图图层元素点击事件响应方法）
 * 
 * @param evt 点击事件
 */
function showInfoWfsDefine(evt) {
	if (searchTableName != null && searchTableName.length > 0) {
		var pixels = evt.xy;
		var lonlat = map.getLonLatFromPixel(pixels);
		var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
		// 获得地图分辨率
		var resolution = map.getResolution();
		// 根据中心点和半径构建多边形
		var polygon = new OpenLayers.Geometry.Polygon.createRegularPolygon(point, resolution * 12, 4);
		var wkt_c = new OpenLayers.Format.WKT();
		var geoStr = wkt_c.extractGeometry(polygon);// 获取多边形的wkt值
		getLayerFeature(searchTableName, geoStr, point);
	} else {
		alertMsg("请勾选需要查看的图层!", 0);
	}

	// 清除鼠标样式和点击事件
	map.div.style.cursor = "";
	map.layerContainerDiv.style.cursor = "";
	map.events.unregister("click", map, showInfoWfsDefine);
	OpenLayers.Event.stop(evt);
}