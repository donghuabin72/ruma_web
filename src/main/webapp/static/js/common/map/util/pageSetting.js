/*
 * 画面配置信息处理实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 通过属性键值查询另外一个属性的值
 * 
 * @param pageSetting 画面配置信息
 * @param searchAttr 查询属性键值
 * @param searchValue 查询属性值
 * @param resultAttr 结果属性键值
 * @returns 结果属性值
 */
function getAttribute(pageSetting, searchAttr, searchValue, resultAttr) {
	for ( var item in pageSetting) {
		if (pageSetting[item][attribute1] == attributeValue) {
			return pageSetting[item][attribute2];
		}
	}
}

/**
 * 生成openlayer关键字查询字符串
 * 
 * @param tableName 数据库表名
 * @param tableObj 画面显示配置信息
 * @returns openlayer查询字符串
 */
function formatCondition(tableName, tableObj) {
	// 构造xml格式的文件
	var xml = new OpenLayers.Format.XML();
	var filters = [];
	for ( var item in tableObj) {
		var colNameList = tableObj[item];
		for (var i = 0; i < colNameList.length; i++) {
			var value = replaceSqlKey($("#" + colNameList[i]).val());
			if (value == "") {
				continue;
			}
			if (item == "like") {
				filters.push(new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.LIKE,// 模糊查询（通配符：*/#/!）
					property : tableName + ":" + colNameList[i],
					value : "*" + value + "*"
				}));
			} else if (item == "equal") {
				filters.push(new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.EQUAL_TO, // 精确查询
					property : tableName + ":" + colNameList[i],
					value : value
				}));
			} else if (item == "between") {
				var min_value = $("#min_" + colNameList[i]).val();
				var max_value = $("#max_" + colNameList[i]).val();
				if (min_value == "" && max_value == "") {
					break;
				} else if (min_value == "") {
					filters.push(new OpenLayers.Filter.Comparison({
						type : OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
						property : tableName + ":" + colNameList[i],
						value : max_value
					}));
				} else if (max_value == "") {
					filters.push(new OpenLayers.Filter.Comparison({
						type : OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
						property : tableName + ":" + colNameList[i],
						value : min_value
					}));
				} else {
					filters.push(new OpenLayers.Filter.Comparison({// 比较操作符
						type : OpenLayers.Filter.Comparison.BETWEEN,
						property : tableName + ":" + colNameList[i],
						lowerBoundary : $("#min_" + colNameList[i]).val(),
						upperBoundary : $("#max_" + colNameList[i]).val()
					}));
				}
			}
		}
	}

	// 添加地图当前范围作为查询条件
	if (panorama != "doing") {
		var geometry = map.getExtent();
		filters.push(new OpenLayers.Filter.Spatial({
			type : OpenLayers.Filter.Spatial.INTERSECTS,
			value : geometry,
			projection : 'EPSG:3857'
		}));
	}

	var filter = new OpenLayers.Filter.Logical({// 逻辑操作符
		type : OpenLayers.Filter.Logical.AND,
		filters : filters
	});
	var filterWriter = new OpenLayers.Format.Filter.v1_0_0();
	return xml.write(filterWriter.write(filter));
}

/**
 * 生成openlayer空间查询字符串
 * 
 * @param geometry 几何形状
 * @param tableName 表名
 * @param colName 列名
 * @returns openlayer空间查询字符串
 */
function formatSpatial(geometry, tableName, colName) {
	var xml = new OpenLayers.Format.XML(); // 构造xml格式的文件
	var filters = [];
	filters.push(new OpenLayers.Filter.Spatial({
		type : OpenLayers.Filter.Spatial.INTERSECTS, // 相交
		value : geometry,
		projection : "EPSG:3857",
		property : tableName + ":" + colName
	}));
	var filter = new OpenLayers.Filter.Logical({// 逻辑操作符
		type : OpenLayers.Filter.Logical.AND,
		filters : filters
	});
	var filterWriter = new OpenLayers.Format.Filter.v1_0_0();
	return xml.write(filterWriter.write(filter));
}

/**
 * 生成数据库查询sql条件
 * 
 * @param tableObj 查询条件字段名
 * @returns sql文
 */
function formatSqlParameter(tableObj) {
	var sqlWhere = "";
	for ( var item in tableObj) {
		var colNameList = tableObj[item];
		for (var i = 0; i < colNameList.length; i++) {
			var value = replaceSqlKey($("#" + colNameList[i]).val());

			if (value == "") {
				continue;
			}
			if (item == "like") {
				if (!checkSingleQuotes(value) || value == '') {
					sqlWhere += " and " + colNameList[i] + " like '%" + value + "%'";
				} else {
					sqlWhere += '{error}';
				}
			} else if (item == "equal") {
				if (!checkSingleQuotes(value) || value == '') {
					sqlWhere += " and " + colNameList[i] + "=" + "'" + value + "'";
				} else {
					sqlWhere += '{error}';
				}
			} else if (item == "between") {
				var min_value = $("#min_" + colNameList[i]).val();
				var max_value = $("#max_" + colNameList[i]).val();
				if ((checkNum(min_value) && min_value != '') || (checkNum(max_value) && max_value != '')) {
					sqlWhere += '{error}';
				}
				if (min_value != null && min_value.trim() != "") {
					sqlWhere += " and " + min_value + "<=" + colNameList[i];
				}
				if (max_value != null && max_value.trim() != "") {
					sqlWhere += " and " + colNameList[i] + "<=" + max_value;
				}
			}
		}
	}
	return sqlWhere;
}

/**
 * 解析画面配置信息
 * 
 * @param table 画面配置信息
 */
function parsePageSetting(table) {
	pageSettingInfo = eval(table);
	getQuery(pageSettingInfo);
	getFirstData(pageSettingInfo);
	getDetailData(pageSettingInfo);
	getSumItem(pageSettingInfo);
	getShowItem(pageSettingInfo);
	getHiddenItem(pageSettingInfo);
	getMapListTitle(pageSettingInfo);
}

/**
 * 获取查询条件项目
 * 
 * @param pageSetting 画面项目配置信息
 */
function getQuery(pageSetting) {
	conditionItem.clear();
	for ( var item in pageSetting) {
		if (pageSetting[item].isQuery == 'true') {
			var key = pageSetting[item].columnId;
			var value = pageSetting[item].type;
			conditionItem.put(key, value);
		}
	}
}

/**
 * 获取首页数据项目
 * 
 * @param pageSetting 画面项目配置信息
 */
function getFirstData(pageSetting) {
	firstItem.clear();
	for ( var item in pageSetting) {
		if (pageSetting[item].isFirst == 'true') {
			var key = pageSetting[item].columnName;
			var value = pageSetting[item].columnId;
			firstItem.put(key, value);
		}
	}
}

/**
 * 获取详细数据项目
 * 
 * @param pageSetting 画面项目配置信息
 * @returns 详细数据项目列表
 */
function getDetailData(pageSetting) {
	detailItem.clear();
	for ( var item in pageSetting) {
		if (pageSetting[item].hidden == 'false') {
			var key = pageSetting[item].columnId;
			var value = pageSetting[item].columnName;
			detailItem.put(key, value);
		}
	}
}

/**
 * 获取计算合计数据项目
 * 
 * @param pageSetting 画面项目配置信息
 */
function getSumItem(pageSetting) {
	sumItem.clear();
	for ( var item in pageSetting) {
		if (pageSetting[item].isSum == 'true') {
			var key = pageSetting[item].columnId;
			var value = pageSetting[item].columnName;
			sumItem.put(key, value);
		}
	}
}

/**
 * 获取数据显示标题项目名称
 * 
 * @param pageSetting 画面项目配置信息
 */
function getMapListTitle(pageSetting) {
	for ( var item in pageSetting) {
		if (pageSetting[item].hasOwnProperty('isTitle')) {
			if (pageSetting[item].isTitle == 'true') {
				mapListTitle = pageSetting[item].columnName;
				break;
			}
		}
	}
}

/**
 * 获取隐藏项目
 * 
 * @param pageSetting 画面项目配置信息
 */
function getHiddenItem(pageSetting) {
	hiddenData.clear();
	for ( var item in pageSetting) {
		if (pageSetting[item].hidden == 'true') {
			list.push(pageSetting[item].columnName);
			var key = pageSetting[item].columnId;
			var value = pageSetting[item].columnName;
			hiddenData.put(key, value);
		}
	}
}

/**
 * 获取显示项目
 * 
 * @param pageSetting 画面项目配置信息
 * @returns 显示项目列表
 */
function getShowItem(pageSetting) {
	showData.clear();
	for ( var item in pageSetting) {
		if (pageSetting[item].hidden == 'false') {
			var key = pageSetting[item].columnId;
			var value = pageSetting[item].columnName;
			showData.put(key, value);
		}
	}
}
