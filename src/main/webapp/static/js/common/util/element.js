/*
 * 文档元素操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 根据当前文档元素的jquery对象
 * 
 * @returns 文档元素jquery对象
 */
function getCurrent() {
	return $(this);
}

/**
 * 根据当前文档元素的html对象
 * 
 * @returns 文档元素html对象
 */
function getCurrentHtml() {
	return this;
}

/**
 * 根据当前文档元素ID以及子孙文档元素ID获得子孙文档元素对象集合
 * 
 * @param curKey 文档元素ID
 * @param desKey 子孙文档元素ID
 * @returns 子孙文档元素对象集合
 */
function getDescendant(curKey, desKey) {
	return $(curKey + " " + desKey);
}

/**
 * 根据当前文档元素ID以及子文档元素ID获得子文档元素对象集合
 * 
 * @param curKey 文档元素ID
 * @param chdKey 子文档元素ID
 * @returns 子文档元素对象集合
 */
function getChild(curKey, chdKey) {
	return $(curKey + " > " + chdKey);
}

/**
 * 根据当前文档元素ID以及兄弟文档元素ID获得兄弟文档元素对象集合
 * 
 * @param curKey 文档元素ID
 * @param broKey 兄弟文档元素ID
 * @returns 兄弟文档元素对象集合
 */
function getNext(curKey, broKey) {
	return $(curKey + " + " + broKey);
}

/**
 * 根据当前文档元素ID以及兄弟文档元素ID获得兄弟文档元素对象集合
 * 
 * @param curKey 文档元素ID
 * @param broKey 兄弟文档元素ID
 * @returns 兄弟文档元素对象集合
 */
function getNextAll(curKey, broKey) {
	return $(curKey + " ~ " + broKey);
}


/**
 * 根据文档元素ID获得文档元素对象
 * 
 * @param id 文档元素ID
 * @returns 文档元素对象
 */
function getById(id) {
	return $("#" + id);
}

/**
 * 根据文档元素标签名称获得文档元素对象
 * 
 * @param name 文档元素标签名称
 * @returns 文档元素对象
 */
function getByName(name) {
	return $(name);
}

/**
 * 根据文档元素CSS类名获得文档元素对象
 * 
 * @param name 文档元素CSS类名
 * @returns 文档元素对象
 */
function getByClass(className) {
	return $("." + className);
}

/**
 * 隐藏文档元素
 * 
 * @param element 文档元素对象
 */
function hide(element) {
	return element.hide();
}

/**
 * 显示文档元素
 * 
 * @param element 文档元素对象
 */
function show(element) {
	return element.show();
}