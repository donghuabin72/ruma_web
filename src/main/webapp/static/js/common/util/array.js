/*
 * 数组操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 遍历数组或对象
 * 
 * @param objects 待遍历对象
 * @param fn 操作函数（第一个参数为对象成员或数组索引，第二个参数为对应变量值）
 */
function foreach(objects, fn) {
	$.each(objects, fn);
}

/**
 * 根据制定的规则过滤数组
 * 
 * @param objects 待过滤数组
 * @param fn 过滤函数（第一个参数为当前元素，第二个参数而元素索引值）
 * @param invert 设置为false或未设置，则返回数组中过滤函数返回 true元素,设置为true，则返回过滤函数中返回 false元素集。
 */
function grep(objects, fn, invert) {
	return $.grep(objects, fn, invert);
}

/**
 * 将类数组对象转换为数组对象。
 * 
 * @param objects 类数组对象
 * @returns 数组对象
 */
function makeArray(objects) {
	return $.makeArray(objects);
}

/**
 * 在指定数组中查找是否存在特定的元素值
 * 
 * @param value 元素值
 * @param array 数组对象
 * @param fromIndex 开始索引值，默认值为0
 * @returns 索引值
 */
function searchArray(value, array, fromIndex) {
	return $.inArray(value, array, fromIndex);
}

/**
 * 数组排序
 * 
 * @param array 待排序数组
 * @param fn 排序函数（返回值大于0交换位置，反之则不）
 */
function sort(array, fn) {
	return array.sort(fn);
}

/**
* 删除数组中某个元素
* 
* @param array 待处理数组
* @param index 索引
*/
function removeElement(array, index) {
	if (index >= 0 && index < array.length) {
		for (var i = index; i < array.length; i++) {
			array[i] = array[i + 1];
		}
		array.length = array.length - 1;
	}
	return array;
}
