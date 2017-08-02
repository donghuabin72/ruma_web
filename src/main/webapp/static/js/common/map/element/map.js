/*
 * 地图交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */

//代理服务配置
OpenLayers.ProxyHost = projectName + "/cgi/proxy.cgi?url=";

/**
 * 地图显示初始化方法
 */
function initMap() {
	// 1.加载地图
	/*
	 * 设定地图显示范围
	 */
	var leftBottom = new OpenLayers.LonLat(leftBottomLon, leftBottomLat);
	var rightTop = new OpenLayers.LonLat(rightTopLon, rightTopLat);

	leftBottom.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
	rightTop.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
	var restrictedExtent = new OpenLayers.Bounds(leftBottom.lon, leftBottom.lat, rightTop.lon, rightTop.lat);

	// 创建地图显示对象
	map = new OpenLayers.Map("neunn_map", {
		controls : [ new OpenLayers.Control.Navigation({
			handleRightClicks : true,
			zoomWheelEnabled : true
		}) ],
		projection : "EPSG:900913",
		displayProjection : "EPSG:4326",
		units : "m",
		//restrictedExtent : restrictedExtent,
		numZoomLevels: maxLevel
		
	});

	// 加载地图图层
	map.addLayers([ baseVector, baseRaster, searchResultLayer, highLightLayer, measureLayer, searchConditionLayer,selectVector ]);

	/*
	 * 加载地图控制器
	 */
	// 加载绘制区域控制器
	map.addControls([ rectangleControl, polygonControl ]);
	// 加载测量控制器
	map.addControls([ disMeasureTool, areaMeasureTool ]);
	// 加载鹰眼控制器
	map.addControl(new OpenLayers.Control.NEOverviewMap());
	// 加载比例尺控制器
	var scale = $('#scale')[0];
	map.addControl(new OpenLayers.Control.Scale(scale));
	// 加载坐标显示控制器
	var coordinate = $('#coordinate')[0];
	map.addControl(new OpenLayers.Control.MousePosition({
		element : coordinate
	}));

	// 设置地图中心点坐标
	var centerPoint = new OpenLayers.LonLat(centerLon, centerLat);
	map.setCenter(centerPoint.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), initLevel);
	// 添加比例尺变化监听事件
	map.events.register("zoomend", this, refreshMeaure);
	// 添加鼠标移动坐标格式化监听事件
	map.events.register("mousemove", map, formatPosition);
	// 加载业务数据图层层级样式数据
	getLayerLevelStyles();
	// 加载业务数据图层样式数据
	getLayerStyles();

	// 2.加载左边数据显示表格
	getLayerInfos();
	onLayersTableClick();

	// 3.获取登录用户信息并显示
	 showUserInfo();
	
	// 4.设置模块初始显示样式
	setModelTabStyle();
	
	//selectVetor图层监听
	for ( var key in selectControls) {
		var control = selectControls[key];
		map.addControl(control);
		control.activate();
	}
}

/**
 * 鼠标移动格式化显示坐标实现方法
 */
function formatPosition() {
	var value = $('#coordinate').html();
	var result = formatDegree(value);
	$('#coordinateDFM').html(result[0] + ',' + result[1]);
	$("#coordinateDFM").show();
}

/**
 * 比例尺变化时，重绘测量图形
 */
function refreshMeaure(obj) {
	disMeasureTool.redrawLine();
	
	//修改selectVector图层Index值,使其保持在最上层
	changeSelectVectorIndex();
}

/**
 * 查询结果自适应（全景）显示
 */
function overallView() {
	// 如果是条件查询且未进行过全景显示
	if (queryType == 0 && panorama == "undo") {
		map.events.unregister("moveend", map, searchFeaturesByCondition);
		panorama = "doing";
		showAllFeatures();
	} else {
		// 如果是空间查询或者是条件查询且显示过全景
		if (panBounds) {
			// 如果已经显示过全景
			map.zoomToExtent(panBounds, false);
		} else {
			// 如果是空间查询
			var bound = searchResultLayer.getDataExtent();
			if (bound) {
				map.zoomToExtent(bound, false);
			}
		}
	}
}

/**
 * 地图缩小
 */
function zoomOut() {
	map.zoomOut();
}

/**
 * 地图放大
 */
function zoomIn() {
	map.zoomIn();
}

/**
 * 空间查询处理完成回调函数
 * 
 * @param event 查询处理事件
 */
function polygonDrawComplete(event) {
	var feature = event.feature;
	var geo = feature.geometry;
	rectangleControl.deactivate();
	polygonControl.deactivate();
	searchFeaturesByPolygon(geo);
}

/**
 * 地图/影像切换按钮鼠标移入移出改变样式
 */
function changeStyle(flag) {
	if (flag) {
		$("#controlTextbg").css("background-color", "rgb(131, 161, 255)");
		$("#controlTextbg").css("opacity", "1");
	} else {
		$("#controlTextbg").css("background-color", "rgb(128, 128, 128)");
		$("#controlTextbg").css("opacity", "0.5");
	}
}

/**
 * 影像/地图切换
 */
function switchLayers() {
	if ($("#controlText").html() == "地图") {
		$("#controlText").html("影像");
		$("#viewChange").attr("title","显示影像地图");
		map.removeLayer(baseRaster, true);
		map.addLayer(baseVector); 
		map.setBaseLayer(baseVector);
		$("#viewChange").attr("src","../../img/common/view-image.png");
		//$(".layerSwitcherImg").css("background", "url('../../img/common/mapctrls2d0.gif') no-repeat scroll 0px -177px transparent");
	} else {
		$("#controlText").html("地图");
		$("#viewChange").attr("title","显示普通地图");
		map.removeLayer(baseVector, true);
		map.addLayer(baseRaster);
		map.setBaseLayer(baseRaster);
		$("#viewChange").attr("src","../../img/common/view-map.png");
		//$(".layerSwitcherImg").css("background", "url('../../img/common/mapctrls2d0.gif') no-repeat scroll 0px -221px transparent");
	}
}

/**
 * 点击区域查询按钮处理方法（显示空间查询画面）
 */
function showSpaceSearchPage() {
	// 设定查询类别:空间查询
	queryType = 0;
	// 设定当前模式:查询画面
	pageType = 2;
	// 清除地图图层（仅保留基础图层）
	clearMapWithBaseLayer();
	// 判断是否有选中的业务图层
	if (selectedBusLayers.isEmpty()) {
		alertMsg("请选择一个可查询图层再进行查询！", 0);
		return false;
	} else {
		var length = selectedBusLayers.size();
		for (var i = 0; i < length; i++) {
			var key = selectedBusLayers.keys[i];
			var keyObj = selectedBusLayers.get(key);
			loadSpaceLayerList("typeListSpace", {key : keyObj.name});
			if (i == 0) {
				$("#defaultTypeSpace").html(keyObj.name + "<span class='caret'></span><span style='display:none'>" + keyObj.id + "," + keyObj.maxZoom + "</span>");
			}
		}
	}
	// 图层查询结果显示表格
	$("#layerListDiv").hide();
	// 关键字查询条件显示DIV
	$("#conditionSearchDiv").hide();
	// 关键字查询结果显示表格
	$('#layerItemListDiv').hide();
	// 关键字查询缩略显示DIV
	$('#collapseLayerListDiv').hide();
	// 空间范围查询条件显示DIV
	$("#polygonSearchDiv").show();
}

/**
 * 加载空间查询画面图层下拉列表
 * 
 * @param id 下拉列表控件ID
 * @param layers 选中图层信息列表
 */
function loadSpaceLayerList(id, layers) {
	for ( var layer in layers) {
		$("#" + id).append(
				"<li><a tabindex='-1'>" + layers[layer] + "</a></li>");
	}
}

/**
 * 点击关键字查询按钮处理方法（显示关键字查询画面）
 */
function showConditionSearchPage() {
	// 设定查询类别:关键字查询查询
	queryType = 1;
	// 设定当前模式:查询画面
	pageType = 2;
	// 清除地图图层（仅保留基础图层）
	clearMapWithBaseLayer();
	var checkMark = initConditionSearchPage();
	if (checkMark) {
		// 图层查询结果显示表格
		$("#layerListDiv").hide();
		// 关键字查询条件显示DIV
		$("#conditionSearchDiv").show();
		// 关键字查询结果显示表格
		$('#layerItemListDiv').hide();
		// 关键字查询缩略显示DIV
		$('#collapseLayerListDiv').hide();
		// 空间范围查询条件显示DIV
		$("#polygonSearchDiv").hide();

	}
}

/**
 * 显示全部查询结果数据
 */
function showAllFeatures() {
	var zoomObj = $("#defaultTypeCondition span:hidden").html().split(",")[1];
	if (panorama == "doing") {
		if (dataTable) {
			var totalPages = dataTable.fnPagingInfo().iTotalPages;
			if (totalPages > 50) {
				artDialog({
					content : '数据量大,全景显示很慢,是否缩放到全景范围?',
					lock : true,
				}, function() {
					searchFeaturesByCondition();
				}, function() {
					panorama = "undo";
					return;
				});
			} else {
				searchFeaturesByCondition();
			}
		}
	} else {
		if (zoomObj != null) {
			var zoom = zoomObj.trim();
			if (map.getZoom() < zoom) {
				return;
			}
		}
		searchFeaturesByCondition();
	}
}

/**
 * 点击属性查询按钮处理方法（显示属性查询光标、绑定属性查询事件）
 */
function showAttSearchPage() {
	// 清除测算内容
	disMeasureTool.clearAllFeatures();
	// 关闭控制器
	closeAllControls();
	// 关闭属性查询窗口
	closeAttInfoPopup();
	if (flagAttInfo == 1) {
		map.events.register("click", map, showInfoWfsDefine);
	} else {
		if (selectedBusLayers.size() > 0 || selectedBaseLayers.size() > 0) {
			map.events.register("click", map, showInfoWmsDefine);
		} else {
			alertMsg("请勾选需要查看的图层!", 0);
			return;
		}
	}
	//map.div.style.cursor = "url('../../img/common/btn_mouse.png'),default";
	//map.layerContainerDiv.style.cursor = "url('../../img/common/btn_mouse.png'),default";
}

/**
 * 关闭地图控制器
 */
function closeAllControls() {
	// 关闭图层属性查看控制器
	map.events.unregister("click", map, showInfoWmsDefine);
	map.events.unregister("click", map, showInfoWfsDefine);

	// 空间查询控制器
	rectangleControl.deactivate();
	polygonControl.deactivate();

	// 测量控制器
	areaMeasureTool.deactivate();
	disMeasureTool.deactivate();
}

/**
 * 清除属性查看弹出窗口、高亮显示、绑定事件和鼠标样式
 */
function cancleAttrInfo() {
	// 清除高亮显示
	highLightLayer.removeAllFeatures();
	// 关闭弹出窗口
	closeAttInfoPopup();
	// 恢复鼠标样式
	map.div.style.cursor = "";
	map.layerContainerDiv.style.cursor = "";
}

/**
 * 图层查询结果显示
 * 
 * @param req 用户请求
 */
function searchFeaturesOnComplete(req) {
	searchConditionLayer.destroyFeatures();
	// openlayers的GML解析器（如果使用wfs1.1.0，则需要增加如下参数：{xy:false}更改x，y坐标的读取顺序）
	var resTest = req.responseText;
	var gmlParse = new OpenLayers.Format.GML();
	var features = gmlParse.read(resTest);
	var featureAttributes = [];
	if (features.length > 0) {
		searchResultLayer.destroyFeatures();
		// 高亮显示
		for ( var feat in features) {
			var feature = features[feat];
			// 高亮显示
			if (feature.geometry != null) {
				switch (feature.geometry.CLASS_NAME) {
				case "OpenLayers.Geometry.MultiPolygon": {
					var polygon = feature.geometry;
					var tableName = feature.attributes.viewname;
					var styleObj = getLayerStyle(tableName);
					var polygonStyle = resultSymbolizers.Polygon;
					polygonStyle.strokeWidth = styleObj.lineWidth;
					polygonStyle.strokeOpacity = styleObj.polygonOpacity;
					polygonStyle.strokeColor = styleObj.lineColor;
					polygonStyle.fillColor = styleObj.polygonColor;
					polygonStyle.strokeDashstyle = styleObj.lineStyle;

					var fillColor = getLayerLevelStyle(tableName, feature.attributes.styleflag);
					if (fillColor != null) {
						polygonStyle.fillColor = fillColor;
					}
					var vec = new OpenLayers.Feature.Vector(polygon, feature.attributes, polygonStyle);
					searchResultLayer.addFeatures([ vec ]);
					break;
				}
				case "OpenLayers.Geometry.Point": {
					// 经度纬度是相反的，所以需要重新构建
					var polygon = feature.geometry;
					var tableName = feature.attributes.viewname;

					var imageName = getLayerLevelStyle(tableName, feature.attributes.styleflag);
					if (imageName == null) {
						imageName = tableName.substr(7, tableName.length) + ".png";
					}
					var pointStyle = resultSymbolizers.Point;
					pointStyle.externalGraphic = "../../img/drawingIcon/" + imageName;
					var imageUrl = "../../img/drawingIcon/" + imageName;
					feature.attributes["images"] = imageUrl;
					var vec = new OpenLayers.Feature.Vector(polygon, feature.attributes, pointStyle);
					searchResultLayer.addFeatures([ vec ]);
					break;
				}
				case "OpenLayers.Geometry.MultiLineString": {
					var polygon = feature.geometry;
					var tableName = feature.attributes.viewname;
					var styleObj = getLayerStyle(tableName);

					var lineStyle = resultSymbolizers.Line;
					lineStyle.strokeWidth = 2;
					lineStyle.strokeColor = styleObj.lineColor;
					lineStyle.strokeDashstyle = styleObj.lineStyle;
					var vec = new OpenLayers.Feature.Vector(polygon, feature.attributes, lineStyle);
					searchResultLayer.addFeatures([ vec ]);
					break;
				}
				case "OpenLayers.Geometry.LineString": {
					var polygon = feature.geometry;
					var tableName = feature.attributes.viewname;
					var styleObj = getLayerStyle(tableName);

					var lineStyle = resultSymbolizers.Line;
					lineStyle.strokeWidth = styleObj.lineWidth;
					lineStyle.strokeOpacity = styleObj.polygonOpacity;
					lineStyle.strokeColor = styleObj.lineColor;
					lineStyle.fillColor = styleObj.polygonColor;
					lineStyle.strokeDashstyle = styleObj.lineStyle;
					var vec = new OpenLayers.Feature.Vector(polygon, feature.attributes, lineStyle);
					searchResultLayer.addFeatures([ vec ]);
					break;
				}
				case "OpenLayers.Geometry.Polygon": {
					var polygon = feature.geometry.components[0];
					var tableName = feature.attributes.viewname;
					var styleObj = getLayerStyle(tableName);

					var polygonStyle = resultSymbolizers.Polygon;
					polygonStyle.strokeWidth = styleObj.lineWidth;
					polygonStyle.strokeOpacity = styleObj.polygonOpacity;
					polygonStyle.strokeColor = styleObj.lineColor;
					polygonStyle.fillColor = styleObj.polygonColor;
					polygonStyle.strokeDashstyle = styleObj.lineStyle;

					var fillColor = getLayerLevelStyle(tableName, feature.attributes.styleflag);
					if (fillColor != null) {
						polygonStyle.fillColor = fillColor;
					}
					var vec = new OpenLayers.Feature.Vector(polygon, feature.attributes, polygonStyle);
					searchResultLayer.addFeatures([ vec ]);
				}
				}
				featureAttributes.push(feature.attributes);
			}
		}

		// 设置最大显示范围，防止显示全部查询结果时地图显示过小
		suitBound();

		// 显示查询结果列表
		if (queryType == 0) {
			showResultDataTable(featureAttributes);
		}
	} else {
		// do nothing
	}
	searchResultLayer.setZIndex(400);
}

/**
 * 显示查询结果表格
 * 
 * @param featureAttributes 查询结果数据
 */
function showResultDataTable(featureAttributes) {
	// 查询结果表格数据
	var tableData = [];
	// 显示项目在返回数据的索引值
	var firstItemDataIndex = {};
	// 合计项目结果
	var totalObj = {};
	// 遍历返回结果数据（包含多条图层元素信息）
	for (var i = 0; i < featureAttributes.length; i++) {
		var rowData = [];
		// 遍历图层元素信息数据（包含多个字段值）
		for ( var key in featureAttributes[i]) {
			// 保存行数据
			rowData.push(featureAttributes[i][key]);
			// 获得首页显示项目在返回数据结构中的索引值
			if (i == 0) {
				var orderNo = 0;
				for ( var columnKey in firstItem.keys) {
					if (key === firstItem.get(firstItem.keys[columnKey])) {
						firstItemDataIndex[firstItem.keys[columnKey]] = orderNo;
					}
				}
				orderNo++;
			}
			// 计算合计结果
			for ( var item in sumItem.keys) {
				if (key === sumItem.get(sumItem.keys[item])) {
					if (totalObj[key] == undefined) {
						totalObj[key] = parseFloat(featureAttributes[i][key]);
					} else {
						totalObj[key] += parseFloat(featureAttributes[i][key]);
					}
				}
			}
		}
		tableData.push(rowData);
	}

	loadSearchResultTable(tableData, totalObj, firstItemDataIndex, mapListTitle);
}

function changeBanner(){
	var mainBanner = $("#mainBannerMax").is(":hidden");//长标题
	
	var pageWidth = parseInt(document.body.offsetWidth);
	if(pageWidth < 760 && mainBanner){		
		alertMsg("请在高分辨率或全屏下打开标题栏。");
	} else {
		if(mainBanner){
			$("#mainBannerMax").show();
			$("#maxBannerMax").hide();
			displayBannerFlag = 1;
		} else {
			$("#mainBannerMax").hide();
			$("#maxBannerMax").show();
			displayBannerFlag = 0;
		}
	}
}

/**
 * 选择区域描绘图形处理方法
 * 
 * @param type 区域描绘图形类型（rectangle:矩形、polygon:多边形）
 */
function switchControl(type) {
	var zoomObj = $("#defaultTypeSpace span:hidden").html().split(",")[1];
	if (zoomObj != null) {
		var zoom = zoomObj.trim();
		if (map.getZoom() < zoom) {
			artDialog({
				content : '图层当前比例尺不可查询,放大到可查询比例尺?',
				lock : false
			}, function() {
				map.zoomTo(zoom);
				disMeasureTool.clearAllFeatures();
				searchConditionLayer.removeAllFeatures();
				polygonControl.deactivate();
				rectangleControl.deactivate();
			}, function() {
				return;
			});
		} else {
			disMeasureTool.clearAllFeatures();
			searchConditionLayer.removeAllFeatures();
			polygonControl.deactivate();
			rectangleControl.deactivate();
			if (type == "rectangle") {
				rectangleControl.activate();
			} else if (type = "polygon") {
				polygonControl.activate();
			}
		}
	}
}
