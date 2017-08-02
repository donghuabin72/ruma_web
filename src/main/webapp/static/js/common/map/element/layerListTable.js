/*
 * 图层数据显示表格交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 显示图层查询结果
 */
function showLayerList() {
	$("#layerListDiv").show();
	$('#collapseLayerListDiv').hide();
	$('#layerItemListDiv').hide();
	$('#collapseLayerItemListDiv').hide();
	$("#conditionSearchDiv").hide();
	$("#polygonSearchDiv").hide();
}

/**
 * 调整图层结果表格单元格显示样式
 * 
 * @param td 列元素对象
 * @param rowData 行数据
 */
function formatLayerListCell(td, rowData) {
	var value = rowData["name"].replace("<font color='red'>", "").replace("</font>", "");
	var html = "<input name='checkbox_" + rowData["id"] + "' id='checkbox_" + rowData["id"] + "' value = '" + value + "' type='checkbox'/> &nbsp; &nbsp; &nbsp"
			+ rowData["name"];
	html += "<input type='hidden' id='url_" + rowData["id"] + "' value = '" + rowData["serviceKey"] + "' />";
	html += "<input type='hidden' id='max_" + rowData["id"] + "' value = '" + rowData["maxLevel"] + "' />";
	html += "<input type='hidden' id='type_" + rowData["id"] + "' value = '" + rowData["geoType"] + "' />";
	html = "<span title='" + rowData["remarks"]
			+ "' style='width:300px;float:left;display:block;line-height:36px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>" + html
			+ "</span>";
	$(td).html(html);
}

/**
 * 图层列表记录选中和取消处理方法
 * 
 * @param flag 操作类别（true:选中、false:取消）
 * @param id 记录多选框ID
 */
function checkBoxAction(flag, layerInfo) {
	flagAttInfo = 0;
	var name = layerInfo.name;
	var serviceKey = layerInfo.serviceKey;
	if (flag) {
		// checkBox选中处理
		if (serviceKey.indexOf(geoServerLayerPrefix) == -1) {
/*			var mine = new OpenLayers.Layer.WMTS({
				name : name,
				url : serviceKey,
				//layer : "raster",
				layer : "20140831_terrainclassification",
				style : "default",
				matrixSet : "EPSG:900913",
				matrixIds : matrixIds,
				format : "image/png",
				isBaseLayer : false
			});*/
			var matrixIds = new Array(maxLevel);
			for (var i = 0; i <= maxLevel; ++i) {
				matrixIds[i] = "EPSG:900913:" + i;
			}
			var mine = new OpenLayers.Layer.WMTS({
				name : "地物分类",
				url : "http://10.20.0.123:8080/NeunnTiles/service/wmts/WMTSCapabilities",
				layer : "20130707_terrainclassification",
				style : "default",
				matrixSet : "EPSG:900913",
				matrixIds: matrixIds,
				format : "image/jpg",
				isBaseLayer : false
			});

			map.addLayer(mine);
			mine.setZIndex(201);
		} else {
			var wmsLayer = new OpenLayers.Layer.WMS(serviceKey, wmsUrl, {
				// TODO 测试代码
				layers : 'area:' + serviceKey.replace("test", "v"),
				transparent : true,
				projection : 'EPSG:900913',
				format : 'image/png'
			}, {
				tileSize : new OpenLayers.Size(256, 256),
				isBaseLayer : false
			});
			map.addLayer(wmsLayer);
			panBounds = getLayerNativeBound(serviceKey);
			addMarkers(serviceKey);//add by donghb
		}
	} else {
		// checkBox取消处理
		if (serviceKey.indexOf(geoServerLayerPrefix) == -1) {
			removeLayer(name);
		} else {
			deleteFeaturesByLayerName(serviceKey);
			removeLayer(serviceKey);
			highLightLayer.removeAllFeatures();
			closeAttInfoPopup();
		}
	}
	sortLayers();
}

function addMarkers(serviceKey){
//	var markName = "mk_"+serviceKey;
//	var markers = new OpenLayers.Layer.Markers(markName);
	//map.addLayer(markers);
	$.ajax({
		url : projectName + "/layerFeature/getFeatureByLayerName?layerName="+serviceKey,
		dataType : 'json',
		async : false,
		success : function(data) {
			if(data.length){
				for(var i=0;i<data.length;i++){
					var geom = data[i].geom;
					var wkt_c = new OpenLayers.Format.WKT();
					var feature = wkt_c.read(geom);
					var attributes = feature.attributes;
					attributes.viewname = serviceKey;
					attributes.geom = geom;
					var polygon = feature.geometry;
					var vec = new OpenLayers.Feature.Vector(polygon, feature.attributes, null);
					selectVector.addFeatures([ vec ]);
//					var x = feature.geometry.x;
//					var y = feature.geometry.y;
//					var pos =  new OpenLayers.LonLat(x, y);
//					var size = new OpenLayers.Size(28,30);
//					var icon = new OpenLayers.Icon('../../img/system/lucid.png', size);
//					var marker = new OpenLayers.Marker(pos,icon);
//					markers.addMarker(marker);
//					marker.events.register('mouseover',  marker,  onMakerMouseover);
//					marker.events.register('mouseout',  marker,  onMakerMouseout);
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
function onMakerMouseover(){
	showAttSearchPage();
}
function onMakerMouseout(){
	map.div.style.cursor = "";
	map.layerContainerDiv.style.cursor = "";
}
/**
 * 控制结果列表的显示与隐藏
 * 
 * @param flag 显示隐藏标志位（0:显示;1:隐藏）
 */
function switchLayerListTable(flag) {
	//var mapName = setModelName() + '模块';
	var mapName = setModelName() ;
	var lenSub = 0;
	if (modelId == 0) {
		// 选择的基础图层数量
		lenSub = selectedBaseLayers.size();
	} else {
		// 选择的业务图层数量
		lenSub = selectedBusLayers.size();
	}

	mapName = mapName + '（' + lenSub + "/" + $("#layerListTable").dataTable().fnPagingInfo().iTotal+ '）';
//	if (lenSub == 0) {
//		mapName = mapName + ' ,未选择图层。';
//	} else {
//		mapName = mapName + '（' + lenSub + "/" + $("#layerListTable").dataTable().fnPagingInfo().iTotal+ '）';
//	}
	if (flag == 0) {
		$("#collapseLayerListDiv").hide();
		$("#layerListDiv").show();
	} else {
		$("#layerListLabel").html(mapName);
		$("#collapseLayerListDiv").show();
		$("#layerListDiv").hide();
	}
}

/**
 * 图层查询结果表格绑定鼠标点击事件
 */
function onLayersTableClick() {
	$("#layerListTable tbody").on("click", "tr", function() {
		console.log("onLayersTableClick");
		// 变更当前行样式(选中->取消、取消->选中)
		$(this).toggleClass('selected');

		// 计算选中图层个数
		var tbody = $('#layerListTable tbody')[0].childNodes;
		var selectRowCount = 0;
		for (var i = 0; i < tbody.length; i++) {
			var className = tbody[i].attributes[1].value;
			if (className.indexOf('selected') > 0) {
				selectRowCount++;
			}
		}

		// 获得当前行多选框的name属性值
		var idRow = $(this).find("input[type='checkbox']").attr('name');
		var name = $("#" + idRow).attr('value');

		var keyId = "url_" + idRow.replace("checkbox_", "");
		var maxId = "max_" + idRow.replace("checkbox_", "");
		var geomTypeId = "type_" + idRow.replace("checkbox_", "");
		var key = $("#" + keyId).attr('value');
		var maxZoom = $("#" + maxId).attr('value');
		var geomType = $("#" + geomTypeId).attr('value');
		var obj = new layerInfo();
		obj.id = idRow;
		obj.name = name;
		obj.serviceKey = key;
		obj.maxZoom = maxZoom;
		obj.geomType = geomType;

		if ($(this).hasClass('selected')) {
			if (selectRowCount <= selectMax) {
				selectedLayers.put(idRow, obj);
				if (modelId == '0') {
					selectedBaseLayers.put(idRow, obj);
				} else {
					selectedBusLayers.put(idRow, obj);
				}
				$("#" + idRow).attr("checked", true);
				checkBoxAction(true, obj);
			} else {
				$("#" + idRow).attr("checked", false);
				$(this).toggleClass('selected');
				selectedBusLayers.remove(idRow);
				var msg = '最多显示' + selectMax + "个图层。";
				alertMsg(msg, 0);
			}
		} else {
			$("#" + idRow).attr("checked", false);
			selectedLayers.remove(idRow);
			if (modelId == '0') {
				selectedBaseLayers.remove(idRow);
			} else {
				selectedBusLayers.remove(idRow);
			}
			checkBoxAction(false, obj);
		}
	});
}