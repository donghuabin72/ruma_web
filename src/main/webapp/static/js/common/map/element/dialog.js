/*
 * 画面弹出对话框定义实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
//蒙版弹出窗口
var maskDialog;

// 超时提示信息窗口
var timeOutDialog;

/**
 * 右下角提示窗口实现方法
 */
artDialog.notice = function(options) {
	var opt = options || {}, api, aConfig, hide, wrap, top, duration = 800;
	var config = {
		id : 'Notice',
		left : '100%',
		top : '100%',
		fixed : true,
		drag : false,
		resize : false,
		follow : null,
		lock : false,
		init : function(here) {
			api = this;
			aConfig = api.config;
			wrap = api.DOM.wrap;
			top = parseInt(wrap[0].style.top);
			hide = top + wrap[0].offsetHeight;
			wrap.css('top', hide + 'px').animate({
				top : top + 'px'
			}, duration, function() {
				opt.init && opt.init.call(api, here);
			});
		},
		close : function(here) {
			wrap.animate({
				top : hide + 'px'
			}, duration, function() {
				opt.close && opt.close.call(this, here);
				aConfig.close = $.noop;
				api.close();
			});
			return false;
		}
	};
	for ( var i in opt) {
		if (config[i] === undefined)
			config[i] = opt[i];
	}
	return artDialog(config);
};

/**
 * 弹出蒙版提示框
 * 
 * @param msg 显示消息
 */
function popupMask(msg) {
	if (maskDialog != undefined) {
		maskDialog.close();
	}
	maskDialog = art.dialog();
	maskDialog.content(msg).lock();
}

/**
 * 关闭蒙版提示框
 */
function closeMask() {
	maskDialog.close();
}

/**
 * 弹出消息提示框（右下角）
 * 
 * @param msg 显示消息
 * @param type 类型（0:警告、1:成功）
 */
function alertMsg(msg, type) {
	if (type == 0) {
		art.dialog.notice({
			title : '提示',
			width : 220,
			content : msg,
			icon : 'warning',
			time : 4
		});
	} else {
		art.dialog.notice({
			title : '提示',
			width : 220,
			content : msg,
			icon : 'succeed',
			time : 4
		});
	}
}

/**
 * 超时提示消息
 */
function sessionTimeout() {
	if (timeOutDialog != undefined) {
		timeOutDialog.close();
	}
	timeOutDialog = art.dialog({
		title : '提示',
		content : '登陆超时，请重新登陆.',
		icon : 'warning',
		esc : true,
		ok : function() {
			window.location = projectName;
		}
	});
}