/*
 * geoserver矢量瓦片（业务数据）服务配置信息
 */
var geoserverPath = "http://10.20.0.222:8098";
var wmsUrl = geoserverPath + "/geoserver/wms";
var wfsUrl = geoserverPath + "/geoserver/wfs?";
var wmsInitFlag = true;
var wmsInitServiceName = "area:v_data_seaarea2014";

/*
 * 本地瓦片服务配置信息
 */
// 底图数据矢量瓦片发布地址
var tilesVectorServiceUrl = "http://10.20.0.222:8081/NeunnTiles";
// 底图数据影像瓦片发布地址
var tilesRasterServiceUrl = "http://10.20.0.222:8081/NeunnTiles";
// 用户数据矢量瓦片发布地址
var busTilesVectorServiceUrl = "http://10.20.0.222:8081/NeunnTiles";
// 用户数据影像瓦片发布地址
var busTilesRasterServiceUrl = "http://10.20.0.222:8081/NeunnTiles";

//地图显示初始级别
var initLevel = 9;

// 地图显示最大级别
var maxLevel = 18;

// 测量功能鼠标图标样式
var cursor = "../../img/cursor/ruler.cur";

/*
 * 地图显示文字汉化
 */
OpenLayers.INCHES_PER_UNIT["千米"] = OpenLayers.INCHES_PER_UNIT["km"];
OpenLayers.INCHES_PER_UNIT["米"] = OpenLayers.INCHES_PER_UNIT["m"];
OpenLayers.INCHES_PER_UNIT["英里"] = OpenLayers.INCHES_PER_UNIT["mi"];
OpenLayers.INCHES_PER_UNIT["英寸"] = OpenLayers.INCHES_PER_UNIT["ft"];

/*
 * 设置地图显示的边界范围
 */
// 左下点经度坐标
var leftBottomLon = 119.7;
// 左下点纬度坐标
var leftBottomLat = 37.5;
// 右上点经度坐标
var rightTopLon = 125;
// 右上点纬度坐标
var rightTopLat = 43;
// 中心点经度坐标
var centerLon = 121.5;
// 中心点纬度坐标
var centerLat = 39.5;