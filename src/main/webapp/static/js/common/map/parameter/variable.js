/*
 * 全局变量定义实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
// 地图服务类型(0:wms查看、1:wfs查看)
var serviceType = 0;

// 查询类型(0:空间区域检索、1:条件检索)
var queryType = -1;

// 属性查看方式标志位（0:wms查看、1:wfs查看）
var flagAttInfo = 0;

// 画面显示类型（0:图层列表;1:结果列表;2:查询界面）
var pageType = 0;

// 地图对象
var map = null;

// 查询结果数据显示表格对象
var dataTable = null;

// 数据显示标题项目名称
var mapListTitle = "";

// 查询项目列表
var conditionItem = new HashMap();

// 首页显示项目列表
var firstItem = new HashMap();

// 详细信息项目
var detailItem = new HashMap();

// 合计项目列表
var sumItem = new HashMap();

// 隐藏项目列表
var hiddenData = new HashMap();

// 显示项目列表
var showData = new HashMap();

// 记录属性查看图层名称（wfs方式）
var searchTableName = "";

// 画面配置信息
var pageSettingInfo = [];

// 业务图层显示样式信息
var busLayerStyles = [];

// 业务图层分级显示样式信息
var busLayerLevelStyles = [];

// 全景显示标志位(undo:未做全景显示,doing:全景显示进行中,done:完成全景显示)
var panorama = "undo";
// 全景显示范围
var panBounds = null;

// 选择全部图层信息
var selectedLayers = new HashMap();

// 选择的业务图层信息
var selectedBusLayers = new HashMap();

// 选择的基础图层信息
var selectedBaseLayers = new HashMap();

// 业务模块编号
var modelId = 1;
