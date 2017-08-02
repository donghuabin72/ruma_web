/**
 * 系统信息
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年3月7日
 */
$.mySystemFun = {
	// 获取当前登录用户信息
	getLoginUser : function() {
		var loginUserInfo;
		$.ajax({
					type : "get",
					url : basePath + "/sys/getLoginUser",
					async : false,// 取消异步
					success : function(data) {
						if (data.status == 'success') {
							loginUserInfo = JSON.parse(data.msg);
						}
					}
				});
		return loginUserInfo;
	},
	// 获取系统全局配置信息
	globalConfig : function(config) {
		var returenValue;
		var parameter = new Object();
		parameter.config = config;
		$.ajax({
					type : "get",
					url : basePath + "/sys/getGlobalConfig",
					data : parameter,
					async : false,// 取消异步
					success : function(data) {
						if (data.status == 'success') {
							returenValue = data.msg;
						}
					}
				});
		return returenValue;
	},
	//get请求参数转码
	encodeGetUrlParam:function(param){
		//示例："a=1232334fdfva&b=中国人" 转码后为YT0xMjMyMzM0ZmRmdmEmYj3kuK3lm73kuro=，到后台用工具类即可解析
	    return $.base64('encode', param);
	},
	//get请求参数解码
	decodeGetUrlParam:function(param){
		//示例：YT0xMjMyMzM0ZmRmdmEmYj3kuK3lm73kuro= 转码后为"a=1232334fdfva&b=中国人" ，到后台用工具类即可解析
	    return $.base64().decode(param);
	}
}
