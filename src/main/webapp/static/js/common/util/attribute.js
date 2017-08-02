/*
 * 属性操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 获得指定文档元素指定属性的值
 * 
 * @param element 文档元素
 * @param key 属性键值
 * @returns 属性值
 */
function getValue(element, key) {
	return element.attr(key);
}

/**
 * 获得指定文档元素布尔型属性的值
 * 
 * @param element 文档元素
 * @param key 属性键值
 * @returns 属性值
 */
function getBooleanValue(element, key) {
	return element.prop(key);
}

/**
 * 设置指定文档元素指定属性的值
 * 
 * @param element 文档元素
 * @param key 属性键值
 * @param value 属性值
 */
function setValue(element, key, value) {
	element.attr(key, value);
}

/**
 * 设置指定文档元素布尔型属性的值
 * 
 * @param element 文档元素（支持集合）
 * @param key 属性键值
 * @param value 属性值
 */
function setBooleanValue(element, key, value) {
	element.prop(key, value);
}

/**
 * 设置指定文档元素指定属性的值
 * 
 * @param element 文档元素
 * @param map 属性键值对
 */
function setValues(element, map) {
	element.attr(map);
}

/**
 * 设置指定文档元素指定属性的值
 * 
 * @param element 文档元素（支持集合）
 * @param map 属性键值对
 */
function setBooleanValues(element, map) {
	element.prop(map);
}

/**
 * 设置指定文档元素指定属性的值
 * 
 * @param element 文档元素
 * @param key 属性键值
 * @param fn 属性值生成函数（function(index, attr)第一个参数为当前元素的索引值，第二个参数为原先的属性值）
 */
function setValueByFn(element, key, fn) {
	element.attr(key, fn);
}

/**
 * 设置指定文档元素布尔型属性的值
 * 
 * @param element 文档元素
 * @param key 属性键值
 * @param fn 属性值生成函数（function(index, attr)第一个参数为当前元素的索引值，第二个参数为原先的属性值）
 */
function setBooleanValueByFn(element, key, fn) {
	element.prop(key, fn);
}

/**
 * 设置指定文档元素的CSS类名
 * 
 * @param element 文档元素（支持集合）
 * @param className CSS类名
 */
function setClass(element, className) {
	element.addClass(className);
}

/**
 * 设置指定文档元素的CSS类名
 * 
 * @param element 文档元素（支持集合）
 * @param fn 类名生成函数（function(index, class)第一个参数为这个集合索引值，第二个参数为原先class属性值。）
 */
function setClassByFn(element, fn) {
	element.addClass(fn);
}

/**
 * 删除指定文档元素的指定属性
 * 
 * @param element 文档元素
 * @param key 属性键值
 */
function removAttr(element, key) {
	element.removeAttr(key);
}

/**
 * 删除指定文档元素的指定布尔型属性
 * 
 * @param element 文档元素
 * @param key 属性键值
 */
function removProp(element, key) {
	element.removeProp(key);
}

/**
 * 删除指定文档元素的指定CSS类
 * 
 * @param element 文档元素
 * @param className CSS类名（为空时，删除匹配元素所有CSS类）
 */
function removClass(element, className) {
	element.removeClass(className);
}

/**
 * 删除指定文档元素的指定CSS类
 * 
 * @param element 文档元素
 * @param fn 类名生成函数（function(index, class)第一个参数为这个集合索引值，第二个参数为原先class属性值。）
 */
function removClassByFn(element, fn) {
	element.removeClass(fn);
}

