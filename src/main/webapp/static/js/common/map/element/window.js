/*
 * 窗口缩放实现方法
 * Copyright 2013-2015 Neunn, Inc.
 */
window.onresize = function() {
	setParentPageSize();
};

/**
 * 浏览器窗口大小改变时，画面分辨率调整
 */
function setParentPageSize() {
	var pageWidth = parseInt(document.body.offsetWidth);
	var pageHeight = parseInt(document.body.offsetHeight);

	if (pageHeight < 550) {
		// 屏幕高度小于500px，隐藏工具栏
		$("#operateTools").hide();
	} else {
		// 屏幕高度大于等于500px，隐藏工具栏
		$("#operateTools").show();
	}
	if (pageWidth <= 775) {
		// 关键字查询条件DIV
		$("#conditionSearchDiv").hide();
		// 空间查询条件DIV
		$("#polygonSearchDiv").hide();
		// 图层名称查询条件输入框
		$("#layerQueryText").hide();
		// 查询结果显示DIV
		$("#layerItemListDiv").hide();
		// 图层查询结果显示DIV
		$("#layerListDiv").hide();
		// 图层列表折叠显示DIV
		$("#collapseLayerListDiv").hide();
		// 查询结果折叠显示DIV
		$("#collapseLayerItemListDiv").hide();

		$("#minBanner").hide();
		$("#maxBanner").hide();
	} else {
		if (pageType == 0) {
			$("#collapseLayerItemListDiv").hide();
			$("#layerItemListDiv").hide();
			$("#collapseLayerListDiv").hide();
			$("#layerListDiv").show();
		} else if (pageType == 1) {
			$("#collapseLayerListDiv").hide();
			$("#layerListDiv").hide();
			$("#collapseLayerItemListDiv").hide();
			$("#layerItemListDiv").show();
		} else if (pageType == 2) {
			$("#collapseLayerListDiv").hide();
			$("#layerListDiv").hide();
			$("#collapseLayerItemListDiv").hide();
			$("#layerItemListDiv").hide();
			// 隐藏结果列表和图层列表
			if (queryType == 0) {
				$("#conditionSearchDiv").show();
			} else if (queryType == 1) {
				$("#polygonSearchDiv").show();
			} else {
				// do nothing
			}
			if (775 < pageWidth && pageWidth <= 1478) {
				$("#maxBanner").hide();
				$("#minBanner").show();
				$('#seaLogo').src = projectName + '/img/common/logo_mini.png';
			} else if (pageWidth > 1478) {
				$("#maxBanner").show();
				$("#minBanner").hide();
				$('#seaLogo').src = projectName + '/img/common/logo.png';
			}
		} else {
			// do nothing
		}
		$("#layerQueryText").show();
	}
}