/*
 * openLayer Ajax请求交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 *关键字图层查询（只针对选中的图层进行查询）
 */
function searchFeaturesByCondition() {
	queryType = 1;
	pageType = 1;
	flagAttInfo = 1;
	
	var key = $("#defaultTypeCondition span:hidden").html().split(",")[0];
	var table = 'colNameObj_' + selectedBusLayers.get(key).serviceKey.substring(2);// "data_seaarea2014";
	parsePageSetting(table);
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

	var xmlPara = "<?xml version='1.0' encoding='UTF-8'?>" 
			+ "<wfs:GetFeature service='WFS' version='1.0.0' " 
			+ "xmlns:wfs='http://www.opengis.net/wfs' "
			+ "xmlns:gml='http://www.opengis.net/gml' " 
			+ "xmlns:ogc='http://www.opengis.net/ogc' " 
			+ "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' "
			+ "xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd'>" 
			+ "<wfs:Query typeName='area:" + selectedBusLayers.get(key).serviceKey + "' xmlns:area='http://www.neunn.com/area' srsName='EPSG:3857' >";
	for ( var item in detailItem.keys) {
		xmlPara += "<wfs:PropertyName>" + item + "</wfs:PropertyName>";
	}
	xmlPara += "<wfs:PropertyName>geom</wfs:PropertyName>" 
			+ "<wfs:PropertyName>gid</wfs:PropertyName>" 
			+ "<wfs:PropertyName>tablename</wfs:PropertyName>"
			+ "<wfs:PropertyName>viewname</wfs:PropertyName>";
	if (list.length > 0) {
		xmlPara += formatCondition(selectedBusLayers.get(key).serviceKey, {
			"like" : likeList,
			"equal" : equalList,
			"between" : betweenList
		});
	}
	xmlPara += "</wfs:Query>" + "</wfs:GetFeature>";

	OpenLayers.Request.POST({
		async : true,
		url : wfsUrl,
		data : xmlPara,
		callback : searchFeaturesOnComplete
	});
}

/**
 * 空间图层查询（只针对选中的图层进行查询）
 * 
 * @param geometry 几何形状
 */
function searchFeaturesByPolygon(geometry) {
	queryType = 0;
	pageType = 1;
	flagAttInfo = 1;

	var key = $("#defaultTypeSpace span:hidden").html().split(",")[0];
	searchResultLayer.destroyFeatures();
	// TODO 测试代码
	searchTableName = selectedBusLayers.get(key).serviceKey.replace("test_","v_");
	var xmlPara = "<?xml version='1.0' encoding='UTF-8'?>" 
			+ "<wfs:GetFeature service='WFS' version='1.0.0' " 
			+ "xmlns:wfs='http://www.opengis.net/wfs' "
			+ "xmlns:gml='http://www.opengis.net/gml' " 
			+ "xmlns:ogc='http://www.opengis.net/ogc' " 
			+ "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' "
			+ "xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd'>" 
			+ "<wfs:Query typeName='area:" + searchTableName + "' xmlns:area='http://www.neunn.com/area' srsName='EPSG:3857' >";
	for ( var item in detailItem.keys) {
		xmlPara += "<wfs:PropertyName>" + item + "</wfs:PropertyName>";
	}
	xmlPara += "<wfs:PropertyName>geom</wfs:PropertyName>" 
			+ "<wfs:PropertyName>gid</wfs:PropertyName>" 
			+ "<wfs:PropertyName>tablename</wfs:PropertyName>"
			+ "<wfs:PropertyName>viewname</wfs:PropertyName>" 
			+ formatSpatial(geometry, searchTableName, "geom") 
			+ "</wfs:Query>"
			+ "</wfs:GetFeature>";

	panBounds = geometry.getBounds();
	map.zoomToExtent(panBounds, false);
	OpenLayers.Request.POST({
		url : wfsUrl,
		data : xmlPara,
		callback : searchFeaturesOnComplete
	});
}