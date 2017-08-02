/*
 * 几何图形操作实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 获取几何图形弹出窗口显示点
 * 
 * @param geoStr 几何图形边界字符串
 */
function getGeomPopupCenter(geoStr) {
	var wtk = eval('(' + "OpenLayers.Geometry.fromWKT(\"" + geoStr + "\")" + ')');
	var lonlat = wtk.getBounds().getCenterLonLat();
	if (wtk.id.indexOf("Line") > -1) {
		var points = geoStr.split(",");
		var length = points.length;
		if (length > 2) {
			var point = points[parseInt(length / 2)];
			var pointArr = point.split(" ");
			lonlat = new OpenLayers.LonLat(pointArr[0], pointArr[1]);
		}
	} else if (wtk.id.indexOf("Polygon") > -1) {
		if (wtk.id.indexOf("MultiPolygon") > -1) {
			var contains = false;// 是否包含点
			var centroid = wtk.getCentroid();
			for (var j = 0; j < wtk.components.length; ++j) {
				contains = wtk.components[j].containsPoint(centroid);
				if (contains) {
					break;
				}
			}
			if (contains == false) {
				var point = wtk.components[0].components[0].components[0];
				lonlat = new OpenLayers.LonLat(point.x, point.y);
			} else {
				lonlat = new OpenLayers.LonLat(centroid.x, centroid.y);
			}
		} else if (!wtk.containsPoint(lonlat)) {
			var point = wtk.components[0].components[0];
			lonlat = new OpenLayers.LonLat(point.x, point.y);
		}
	}
	return lonlat;
}

/**
 * 高亮显示多边形
 * 
 * @param geom 几何对象
 */
function highLightGeom(geom) {
	highLightLayer.removeAllFeatures();
	var newGeom = geom.clone();
	// 获得显示样式
	var disStyle = null;
	if (geom.id.indexOf("Point") > -1) {
		disStyle = highLightSymbolizers.Point;
	} else if (geom.id.indexOf("Line") > -1) {
		if (geom.id.indexOf("LinearRing") > -1) {
			disStyle = highLightSymbolizers.LinearRing;
		} else {
			disStyle = highLightSymbolizers.Line;
		}
	} else if (geom.id.indexOf("Polygon") > -1) {
		disStyle = highLightSymbolizers.Polygon;
	} else {
		disStyle = highLightSymbolizers.geom;
	}
	// 创建高亮样式元素对象并添加到高亮图层中
	var feature = new OpenLayers.Feature.Vector(newGeom, [], disStyle);
	highLightLayer.addFeatures([ feature ]);
	highLightLayer.setZIndex(845);
}