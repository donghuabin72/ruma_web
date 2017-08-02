function hideUnauthElement() {
	var moduleId = $("#moduleId").val();
	$.ajax({
		url : "../../../module/unauth/" + moduleId,
		async : true,
		type : 'GET',
		success : function(data, textStatus) {
			// 画面按钮隐藏
			var modules = eval("(" + data + ")");
			$.each(modules, function(index, module) {
				// $("#" + module.id).hide();
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
			var path = jqXHR.responseText.replace(/^\"|\"$/g, '');
			window.location.href = path;
		}
	});
}