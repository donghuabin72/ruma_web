/*
 * json数据操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 将JSON对象转化为JSON字符
 * 
 * @param jsonObj JSON对象
 */
function getString(jsonObj) {
	jsonObj.toJSONString();
}

/**
 * 由JSON字符串转换为JSON对象
 * 
 * @param jsonString JSON字符串
 */
function getJson(jsonString) {
	jsonString.parseJSON();
	
}

