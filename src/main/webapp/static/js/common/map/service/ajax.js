/*
 * 地图后台服务交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 获得业务数据图层的矢量层级显示样式
 */
function getLayerLevelStyles() {
	$.ajax({
		url : projectName + "/layer/style/getLayerLevelStyles",
		data : '',
		dataType : 'json',
		type : 'POST',
		async : false,
		success : function(data) {
			var styles = eval(data);
			if (styles != null && styles.length > 0) {
				busLayerLevelStyles = styles;
			}
		},
		error : function(jqXHR, textStatus) {
			closeMask();
			var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
			if (sessionOvertime == 'sessionOvertime') {
				sessionTimeout();
			}
		}
	});
}

/**
 * 获得指定业务数据图层的矢量层级显示样式
 * 
 * @param viewName视图名称
 * @param level 级别
 */
function getLayerLevelStyle(viewName, level) {
	for (var i = 0; i < busLayerLevelStyles.length; i++) {
		if (busLayerLevelStyles[i] != null) {
			if (viewername == busLayerLevelStyles[i].viewName) {
				if (level && level == busLayerLevelStyles[i].level) {
					return busLayerLevelStyles[i].stylevalue;
				}
			}
		}
	}
	return null;
}

/**
 * 获得业务数据图层矢量显示样式
 */
function getLayerStyles() {
	$.ajax({
		url : projectName + "/layer/style/getLayerStyles",
		data : '',
		dataType : 'json',
		type : 'POST',
		async : false,
		success : function(data) {
			var styles = eval(data);
			if (styles != null && styles.length > 0) {
				busLayerStyles = styles;
			}
		},
		error : function(jqXHR, textStatus) {
			closeMask();
			var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
			if (sessionOvertime == 'sessionOvertime') {
				sessionTimeout();
			}
		}
	});
}

/**
 * 获得业务数据图层矢量显示样式
 * 
 * @param viewName 视图名称
 * @returns 图层样式
 */
function getLayerStyle(viewName) {
	for (var i = 0; i < busLayerStyles.length; i++) {
		if (busLayerStyles[i] != null) {
			if (viewName == busLayerStyles[i].serviceKey) {
				return busLayerStyles[i];
			}
		}
	}
	return null;
}

/**
 * 查询图层信息
 */
function getLayerInfos() {
	popupMask('正在查询图层，请稍等。');
	$('#layerListTable').dataTable().fnDestroy();
	var parameter = {};
	parameter["layerName"] = $("#layerName").val();
	$.ajax({
		async : true,
		type : "POST",
		"url" : projectName + "/layer/" + modelId,
		cache : false,
		data : parameter,
		success : function(data) {
			closeMask();
			$('#layerListTable').dataTable().fnDestroy();
			var layerListData = eval(data);
			$('#layerListTable').NEDataTable({
				data : layerListData,
				fnDrawCallback : function() {
					setPageStyle(this);
				},
				"aoColumnDefs" : [ {
					sDefaultContent : '',
					aTargets : [ '_all' ]
				} ],
				columns : [ {
					data : 'name',
					"createdCell" : function(td, cellData, rowData, row, col) {
						formatLayerListCell(td, rowData);
					}
				}, {
					data : 'id',
					"visible" : false
				} ]
			});
			$(".actions").html($("#layerListActionDiv").html());
			var len = $("#layerListTable tbody tr").length;
			for (var i = 0; i < len; i++) {// 循环图层列表
				var rowDisplay = $('#layerListTable tbody tr input[type="checkbox"]')[i];
				if (rowDisplay) {
					var idRow = rowDisplay.id;
					for (var j = 0; j < selectedBaseLayers.size(); j++) {// 循环已选择的基础地理中的图层
						var id = selectedBaseLayers.keys[j];
						if (id == idRow) {// 恢复基础地理中选中的图层
							$('#layerListTable tbody tr input[type="checkbox"]')[i].checked = true;
							$($('#layerListTable tbody tr')[i]).addClass('selected');
						}
					}
				}
			}
		},
		error : function(jqXHR, textStatus) {
			closeMask();
			var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
			if (sessionOvertime == 'sessionOvertime') {
				sessionTimeout();
			}
		}
	});
}

/**
 * 查询图层信息
 * 
 * @param layerName 图层名称
 * @param bounds 边界多边形
 * @param clickPoint 地图点击点对象
 */
function getLayerFeature(layerName, bounds, clickPoint) {
	var paramData = {};
	paramData.layers = layerName;
	paramData.bounds = bounds;
	popupMask("正在查询...");
	$.ajax({
		url : projectName + "/layerFeature/getFeatureByPoint",
		data : paramData,
		dataType : 'json',
		type : 'POST',
		async : false,
		success : function(data) {
			var features = eval(data);
			if (features.length > 0) {
				var minDistance = 0;
				var resultAttribute = null;
				for (var i = 0; i < features.length; i++) {
					var geoStr = features[i]["geom"];
					var pointGeom = new OpenLayers.Geometry.Point(clickPoint.x, clickPoint.y);
					var wtk = eval('(' + "OpenLayers.Geometry.fromWKT(\"" + geoStr + "\")" + ')');
					if (!resultAttribute) {
						resultAttribute = features[i];
						minDistance = pointGeom.distanceTo(wtk);
					}
					if (wtk.id.indexOf('Point') > -1 || wtk.id.indexOf('Line') > -1) {
						if (pointGeom.distanceTo(wtk) < minDistance) {
							minDistance = pointGeom.distanceTo(wtk);
							resultAttribute = features[i];
						}
					} else {
						if (pointGeom.intersects(wtk)) {
							resultAttribute = features[i];
							break;
						}
					}
				}
				if (resultAttribute) {
					var lonlat = new OpenLayers.LonLat(clickPoint.x, clickPoint.y);
					var resolution = map.getResolution();
					// 平移地图中心点,便于显示弹出窗口
					var newLonlat = new OpenLayers.LonLat(lonlat.lon - resolution * 300, lonlat.lat - resolution * 200);
					map.setCenter(newLonlat);
					
					// 弹出属性显示窗口
					var html = formatPopupHtml(resultAttribute);
					openAttInfoPopup(lonlat, html);
					
					var hwtk = eval('(' + "OpenLayers.Geometry.fromWKT(\"" + resultAttribute["geom"] + "\")" + ')');
					highLightGeom(hwtk);
				}
			} else {
				// do nothing
			}
			closeMask();
		},
		error : function(jqXHR, textStatus) {
			closeMask();
			var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
			if (sessionOvertime == 'sessionOvertime') {
				sessionTimeout();
			}
		}
	});
}

/**
 * 查询结果列表点击事件处理方法
 * 
 * @param viewName 数据库视图名称
 * @param gid 元素ID
 */
function getFeatureInfoById(viewName, gid) {
	var param = {};
	param.viewName = viewName;
	param.gid = gid;
	if (viewName != "" && gid != "") {
		$.ajax({
			async : false,
			type : "POST",
			url : projectName + "/layerFeature/getFeatureById",
			data : param,
			dataType : 'json',
			success : function(data) {
				var features = eval(data);
				if (features.length > 0) {
					var attributes = features[0];
					var geoStr = attributes["geom"];
					var wtk = eval('(' + "OpenLayers.Geometry.fromWKT(\"" + geoStr + "\")" + ')');
					var lonlat = getGeomPopupCenter(geoStr);
					highLightGeom(wtk);
					var resolution = map.getResolution();
					// 平移地图中心点,便于显示弹出窗口
					var newLonlat = new OpenLayers.LonLat(lonlat.lon - resolution * 300, lonlat.lat - resolution * 200);
					map.setCenter(newLonlat);
				}
			},
			error : function(jqXHR, textStatus) {
				closeMask();
				var sessionOvertime = jqXHR.responseText.replace(/^\"|\"$/g, '');
				if (sessionOvertime == 'sessionOvertime') {
					sessionTimeout();
				}
			}
		});
	}
}