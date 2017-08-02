/*
 * openlayer弹出窗口实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 弹出属性信息显示窗口
 * 
 * @param lonlat 地图点击经纬度对象
 * @param html 弹出窗口画面html
 */
function openAttInfoPopup(lonlat, html) {
	closeAttInfoPopup();
	var popup = new OpenLayers.Popup.CSSFramedCloud("featureInfo", lonlat, new OpenLayers.Size(100, 200), html, null,
			true, onAttInfoPopupClose);
	map.addPopup(popup, false);
}

/**
 * 生成弹出窗口的html代码
 * 
 * @param element 地图点击经纬度对象
 */
function formatPopupHtml(element) {
	// TODO 测试代码，发布删除
	console.log(element);
	return "<div class='' style='width:520px' ><table width='500' border='0' cellspacing='0' cellpadding='0'/* class='ued_atttable'*/><tr><td><p title='案件编号' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>案件编号：</td><td><p title='（2011）005' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>（2011）005</p></td><td colspan='2' rowspan='7'><img src='../../img/test/data.png' style='width:240px;height:172px;'/></td></tr><tr><td><p title='违法行为' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>违法行为：</td><td><p title='大连南部海域老偏岛海洋生态自然保护区内，未经批准擅自修筑建筑设施' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>大连南部海域老偏岛海洋生态自然保护区内，未经批准擅自修筑建筑设施</p></td></tr><tr><td><p title='案发时间' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>案发时间：</td><td><p title='2011-03-11' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>2011-03-11</p></td></tr><tr><td><p title='案件来源' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>案件来源：</td><td><p title='群众举报' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>群众举报</p></td></tr><tr><td><p title='违法行为当事人' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>违法行为当事人：</td><td><p title='大连瑞德水产有限公司、法定代表人：刘树奇' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>大连瑞德水产有限公司、法定代表人：刘树奇</p></td></tr><tr><td><p title='违法行为发生地' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>违法行为发生地：</td><td><p title='大连高新技术产业园老偏岛' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>大连高新技术产业园老偏岛</p></td></tr><tr><td><p title='行政处罚机关' style='width:75px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>行政处罚机关：</td><td><p title='大连市海洋渔业局' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>大连市海洋渔业局</p></td></tr><tr><td><p title='行政处罚决定' style='width:70px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>行政处罚决定：</p></td><td><p title='责令自《行政处罚决定书》下达之日起二十日内拆除建筑设施' style='width:140px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>责令自《行政处罚决定书》下达之日起二十日内拆除建筑设施</p></td><td><p title='行政处罚决定书下发日期' style='width:85px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>行政处罚决定书下发日期：</p></td><td><p title='2011-06-16' style='width:150px;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:24px;margin:0 0 0 10px;font-size:12px;'>2011-06-16</p></td></tr></table></div>";
}

/**
 * 关闭属性信息弹出窗口
 */
function closeAttInfoPopup() {
	for (var p = 0; p < map.popups.length; p++) {
		var pop = map.popups[p];
		if (pop != null && pop.id == "featureInfo") {
			map.removePopup(pop);
		}
	}
}

/**
 * 关闭弹出窗口时清除高亮显示
 * 
 * @param event 关闭事件
 */
function onAttInfoPopupClose(event) {
	this.hide();
	// 清除高亮显示图层内容
	highLightLayer.setZIndex(0);//add by donghb
	highLightLayer.destroyFeatures();
}