/*
 * 字符串操作封装实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
/**
 * 判断输入字符串是否全为数字
 * 
 * @param str 输入字符串
 * @returns 判断结果
 */
function checkNum(str) {
	var pattern = /^[\d.]+$/i;
	if (pattern.test(str)) {
		return false;
	} else {
		return true;
	}
}

/**
 * 全角转半角
 * 
 * @param value 待格式化的字符串
 * @returns 格式化好的字符串
 */
function CtoH(value) {
	if (value == '' || value == undefined) {
		return '';
	}
	var str = value;
	var result = "";
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) == 12288) {
			result += String.fromCharCode(str.charCodeAt(i) - 12256);
			continue;
		}
		if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
			result += String.fromCharCode(str.charCodeAt(i) - 65248);
		} else {
			result += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return result;
}

/**
 * 替换模糊查询的关键字%和_
 * 
 * @param str 待格式化的sql文
 * @returns 替换后的sql文
 */
function replaceSqlKey(str) {
	var reg = /^[%_']+$/;
	if (reg.test(str))
		return str.replace('%', '/%').replace('_', '/_');
	return str;
}

/**
 * 判断输入字符串（除去开始和结尾空格）是否为空串
 * 
 * @param str 输入字符串
 * @returns 判断结果(true:为空、false:不为空)
 */
function checkIsNull(str) {
	str = str.replace(/(^\s*)|(\s*$)/g, "");
	if (str.length > 0) {
		return false;
	} else {
		return true;
	}
}

/**
 * 判断输入字符串长度是否大于指定值
 * 
 * @param str 输入字符串
 * @param length
 * @returns 判断结果(true:大于、false:小于等于)
 */
function checkLen(str, length) {
	if (str.length > length) {
		return true;
	} else {
		return false;
	}
}

/**
 * 判断输入字符串是否存在非字母、数字和下划线的字符
 * 
 * @param str 输入字符串
 * @returns 判断结果(true:存在、false:不存在)
 */
function checkSpecial(str) {
	var reg = /^[a-zA-Z0-9_]+$/g;
	if (CtoH(str).match(reg) == null) {
		return true;
	} else {
		return false;
	}
}

/**
 * 判断输入字符串中是否包含单引号
 * 
 * @param str 输入字符串
 * @returns 判断结果(true:存在、false:不存在)
 */
function checkSingleQuotes(str) {
	if (CtoH(str).indexOf("'") != -1) {
		alertMsg("请不要输入\"单引号\"", 0);
		return true;
	} else {
		return false;
	}
}