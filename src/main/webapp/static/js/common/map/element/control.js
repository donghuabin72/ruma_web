/*
 * 地图操作控件(图层、控件)定义实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 瓦片矩阵ID
 */
var matrixIds = new Array(maxLevel);
for (var i = 0; i <= maxLevel; ++i) {
	matrixIds[i] = "EPSG:900913:" + i;
}

/**
 * 业务区域底图矢量图层
 */
// 底图矢量瓦片服务图层
var baseVector = new OpenLayers.Layer.WMTS({
	name : "底图矢量瓦片(WMTS)",
	url : tilesVectorServiceUrl + "/service/wmts/WMTSCapabilities",
	layer : "vector",
	style : "default",
	matrixSet : "EPSG:900913",
	matrixIds : matrixIds,
	format : "image/jpg",
	isBaseLayer : true
});


var baseRaster = new OpenLayers.Layer.WMTS({
	name : "基础底图",
	url : "http://10.20.0.123:8080/NeunnTiles/service/wmts/WMTSCapabilities",
	layer : "20131005",
	style : "default",
	matrixSet : "EPSG:900913",
	matrixIds: matrixIds,
	format : "image/jpg",
	isBaseLayer : true
});


var baseRaster99 = new OpenLayers.Layer.WMTS({
	name : "地物分类",
	url : "http://10.20.0.123:8080/NeunnTiles/service/wmts/WMTSCapabilities",
	layer : "20130707_terrainclassification",
	style : "default",
	matrixSet : "EPSG:900913",
	matrixIds: matrixIds,
	format : "image/jpg",
	isBaseLayer : true
});

/**
 * 业务区域底图影像图层
 */
// 本地底图栅格瓦片服务图层
/*var baseRaster2 = new OpenLayers.Layer.WMTS({
	name : "底图影像瓦片(WMTS)",
	url : tilesRasterServiceUrl + "/service/wmts/WMTSCapabilities",
	layer : "raster",
	style : "default",
	matrixSet : "EPSG:900913",
	matrixIds : matrixIds,
	format : "image/jpg",
	isBaseLayer : true
});*/

// 用户数据矢量瓦片（基础图层、业务图层）服务图层
var busVector = new OpenLayers.Layer.WMS("用户数据矢量瓦片(WMS)", wmsUrl, {
	layers : wmsInitServiceName,
	transparent : true,
	projection : 'EPSG:900913',
	format : 'image/png'
}, {
	singleTile : true,
	isBaseLayer : false
});

// 用户数据影像瓦片服务图层
var baseRaster2 = new OpenLayers.Layer.WMTS({
	name : "底图影像瓦片(WMTS)",
	url : busTilesRasterServiceUrl + "/service/wmts/WMTSCapabilities",
	layer : "raster",
	style : "default",
	matrixSet : "EPSG:900913",
	matrixIds : matrixIds,
	format : "image/jpg",
	isBaseLayer : true
});

// 空间查询图层
var searchConditionLayer = new OpenLayers.Layer.Vector("searchConditionLayer", {
	eventListeners : {
		"sketchcomplete" : polygonDrawComplete
	}
});

// 查询结果图层
var searchResultLayer = new OpenLayers.Layer.Vector("searchResultLayer", {
	disableShowInMenu : false,
	styleMap : resultLayerStyleMap
});

// 高亮显示图层
var highLightLayer = new OpenLayers.Layer.Vector("highLightLayer", {
	disableShowInMenu : false,
	styleMap : highLightStyleMap
});

// 测量结果显示图层
var measureLayer = new OpenLayers.Layer.Vector("measureLayer", {
	disableShowInMenu : false,
	renderers : renderer
});
measureLayer.style = WebtAPI.WStyle.clone();
//measureLayer.setZIndex(846);

// 矩形区域描画控制器
var rectangleControl = new OpenLayers.Control.DrawFeature(searchConditionLayer, OpenLayers.Handler.RegularPolygon, {
	handlerOptions : {
		sides : 4,
		irregular : true
	}
});

// 多边形区域描画控制器
var polygonControl = new OpenLayers.Control.DrawFeature(searchConditionLayer, OpenLayers.Handler.Polygon);

// 测量面积画面操作处理对象
var areaMeasureTool = new WebtAPI.WControl.MeasureArea(measureLayer, OpenLayers.Handler.Polygon, {
	id : "areaMeasureTool",
	showEndPopup : true,
	geodesic : true,
	callback : {},
	multiMeasure : false
});

// 测量距离画面操作处理对象
var disMeasureTool = new WebtAPI.WControl.Measure({
	id : "disMeasureTool",
	showEndPopup : true,
	callback : {},
	multiMeasure : false
});