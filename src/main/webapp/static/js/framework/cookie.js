function setCookie(name, value){
	var Days = 30;
			//if(typeof(days)=="undefined"||isNaN(days))
				//Days=parseInt(days.toString());
		     //此 cookie 将被保存 30 天 -1为浏览器关闭　　
	var exp = new Date();    
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires="+exp.toGMTString()+";path=/";	
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr != null) return unescape(arr[2]); return null;
}
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() -24*60*60*1000);
	var cval=getCookie(name);
	if(cval!=null){
		document.cookie = name + "="+ escape (cval) + ";expires="+exp.toGMTString()+";path=/";
	}
//	document.cookie = "";
}