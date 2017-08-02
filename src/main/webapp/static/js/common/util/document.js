/*
 * 文档操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 获得指定文档元素的html代码
 * 
 * @param element 文档元素
 * @returns html代码
 */
function getHtml(element) {
	return element.html();
}

/**
 * 设置指定文档元素的html代码
 * 
 * @param element 文档元素
 * @param code html代码
 */
function setHtml(element, code) {
	element.html(code);
}

/**
 * 设置指定文档元素的html代码
 * 
 * @param element 文档元素
 * @param fn html代码生成函数（第一个参数为集合索引位置，第二个参数为原有html值。）
 */
function setHtmlByFn(element, fn) {
	element.html(fn);
}

/**
 * 获得指定文档元素的显示文本
 * 
 * @param element 文档元素
 * @returns 显示文本
 */
function getText(element) {
	return element.text();
}

/**
 * 设置指定文档元素的显示文本
 * 
 * @param element 文档元素
 * @param content 显示文本
 */
function setText(element, content) {
	element.text(content);
}

/**
 * 设置指定文档元素的显示文本
 * 
 * @param element 文档元素
 * @param fn 显示文本生成函数（第一个参数为集合索引位置，第二个参数为原有显示文本。）
 */
function setTextByFn(element, fn) {
	element.text(fn);
}

/**
 * 获得指定文档元素的value值
 * 
 * @param element 文档元素
 * @returns 显示文本
 */
function getValue(element) {
	return element.val();
}

/**
 * 设置指定文档元素的value值
 * 
 * @param element 文档元素
 * @param value value值
 */
function setValue(element, value) {
	element.val(value);
}

/**
 * 设置指定文档元素的value值
 * 
 * @param element 文档元素
 * @param fn 显示文本生成函数（第一个参数为集合索引位置，第二个参数为原有value值。）
 */
function setValueByFn(element, fn) {
	element.val(fn);
}