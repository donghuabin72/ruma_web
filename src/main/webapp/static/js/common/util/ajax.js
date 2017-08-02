/*
 * ajax请求操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 提交GET方式的用户请求
 * 
 * @param url 请求url
 * @param sync 同步标志位
 * @param success 成功回调函数success(data, textStatus, jqXHR)
 * @param error 失败回调函数error(jqXHR, textStatus, errorThrown)
 */
function sendGetRequest(url, sync, success, error) {
	$.ajax({
		url : url,
		async : sync,
		type : 'GET',
		success : success,
		error : error
	});
}

/**
 * 提交POST方式的用户请求
 * 
 * @param url 请求url
 * @param sync 同步标志位
 * @param success 成功回调函数success(data, textStatus, jqXHR)
 * @param error 失败回调函数error(jqXHR, textStatus, errorThrown)
 */
function sendPostRequest(url, sync, data, success, error) {
	$.ajax({
		url : url,
		async : sync,
		type : 'POST',
		data : data,
		success : success,
		error : error
	});
}

/**
 * 提交POST方式的用户请求
 * 
 * @param url 请求url
 * @param sync 同步标志位
 * @param success 成功回调函数success(data, textStatus, jqXHR)
 * @param error 失败回调函数error(jqXHR, textStatus, errorThrown)
 */
function sendPutRequest(url, sync, data, success, error) {
	$.ajax({
		url : url,
		async : sync,
		type : 'PUT',
		data : data,
		success : success,
		error : error
	});
}

/**
 * 提交DELETE方式的用户请求
 * 
 * @param url 请求url
 * @param sync 同步标志位
 * @param success 成功回调函数success(data, textStatus, jqXHR)
 * @param error 失败回调函数error(jqXHR, textStatus, errorThrown)
 */
function sendDeleteRequest(url, sync, data, success, error) {
	$.ajax({
		url : url,
		async : sync,
		type : 'DELETE ',
		data : data,
		success : success,
		error : error
	});
}

/**
 * 指定文档元素加载html（支持代码和路径）
 * 
 * @param element 加载html的文档元素
 * @param page html代码/html,jsp文件路径
 */
function loadPage(element, page) {
	element.load(page);
}

/**
 * 获得请求返回的json对象
 * 
 * @param url 用户请求url
 * @param data 传递参数
 * @param fn 回调函数
 */
function getJSON(url, data, fn) {
	$.getJSON(url, data, fn);
}
