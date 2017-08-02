/*
 * 测量控件交互实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 点击距离测量按钮实现方法
 */
function measureDistance() {
	cancleAttrInfo();
	closeAllControls();
	disMeasureTool.activate();
}

/**
 * 点击面积测量按钮实现方法
 */
function measureArea() {
	cancleAttrInfo();
	closeAllControls();
	areaMeasureTool.activate();
}