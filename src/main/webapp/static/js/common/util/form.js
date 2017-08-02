/*
 * 表单操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 将表单内容序列化为JSON 对象(由一个对象数组组成的，其中每个对象包含
 * 两个键值对:name 参数和value参数)
 * 序列化范围：表单元素未被禁用，并且含有 name 属性
 * 
 * @param element 表单对象
 */
function serializeArray(element) {
	return element.serializeArray();
}

/**
 * 将表单内容序列化为URL 编码文本字符串
 * 序列化范围：表单元素未被禁用，并且含有 name 属性
 * 
 * @param element 表单对象
 */
function serialize(element) {
	return element.serialize();
}