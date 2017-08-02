/*
 * 将度转换成为度分秒
 */
function formatDegree(value) {
	var str = value.split(",");
	var result = {};
	for (var i = 0; i < str.length; i++) {
		var degree = Math.floor(str[i]);// 度
		var minute = Math.floor((str[i] - degree) * 60);// 分
		var second = Math.round((str[i] - degree) * 3600 % 60);// 秒
		result[i] = degree + '°' + minute + '\'' + second + '"';
	}
	return result;
}