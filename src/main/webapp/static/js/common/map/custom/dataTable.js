$.fn.NEDataTable = function(opts) {
	var options = {
		paging : true,
		searching : true,
		"bSort" : false,
		sPaginationType : 'extStyleLF',
		"language" : {
			"zeroRecords" : "未查询到任何记录",
			"infoEmpty" : "没有满足条件的记录",
		},
		"lengthChange" : false,
		"iDisplayLength" : 10,
		"sDom" : "t<'actions'>p"
	};
	$.extend(options, opts);
	return $(this).dataTable(options);
};

/* 格式化列表元素 */
function formatCell(td, rowData, firstItemDataIndex, mapListTitle) {
	var html = "";
	for ( var item in firstItemDataIndex) {
		if (item == mapListTitle) {
			html = "<br>"
					+ "<span style='font-size:14px;width:250px;padding-bottom:10px;padding-top:-10px;float:left;display:block;line-height:32px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>"
					+ "<lable title='" + rowData[firstItemDataIndex[item]] + "'>" + rowData[firstItemDataIndex[item]] + "</lable>" + "</span>" + "<br>" + html;
		} else {
			html += "<span style='width:100px;float:left;display:block;line-height:18px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>"
					+ "<lable title='" + item + "'>" + item + "</lable>：" + "</span>" + "<p title='" + rowData[firstItemDataIndex[item]]
					+ "' style='width:150px;line-height:18px;float:left;display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>"
					+ rowData[firstItemDataIndex[item]] + "&nbsp;" + "</p><br>";
		}
	}
	html += "<span style='display:none;' " + ">" + rowData[rowData.length - 2] + "</span>";
	html += "<span style='display:none;' " + ">" + rowData[rowData.length - 1] + "</span>";
	$(td).html(html);
}

function getTotalHtml(sumObj) {
	var html = "";
	for ( var item in sumObj) {
		html += "<span style='display: inline-block;'>" + item + "：</span>" + sumObj[item] + "<br>";
	}
	return html;
}

function createTotalRow(id, sumObj) {
	var tbody = document.getElementById(id).children[1];
	var tr = document.createElement('tr');
	var tr_count = tbody.getElementsByTagName("tr").length;
	var className_last = tbody.getElementsByTagName("tr")[tr_count - 1].className;
	if (className_last == "odd") {
		tr.className = "even";
	} else {
		tr.className = "odd";
	}
	tr.setAttribute("role", "row");
	var td = document.createElement('td');
	td.innerHTML = getTotalHtml(sumObj);
	tr.appendChild(td);
	tbody.appendChild(tr);
}

/**
 * 设置分页样式
 */
function setPageStyle(t) {
	var tableName = t.selector.substr(1);
	var htmlPage = '<select onchange="changePage(\'' + tableName + '\' , this.options[this.options.selectedIndex].value)">';
	var currentPage = t.fnPagingInfo().iPage;
	var totalPage = t.fnPagingInfo().iTotalPages;
	for (var iPageNum = 1; iPageNum <= totalPage; iPageNum++) {// 拼接翻页下拉
		if (iPageNum == currentPage) {
			htmlPage += '<option value ="' + iPageNum + '" selected>' + iPageNum + '</option>';
		} else {
			htmlPage += '<option value ="' + iPageNum + '">' + iPageNum + '</option>';
		}
	}
	htmlPage += '</select>';
	$('#' + tableName + '_paginate').find(".navigationLabel .pageIndex").html(htmlPage);
	$('#' + tableName + '_paginate').find(".navigationLabel .totalPages").text(t.fnPagingInfo().iTotalPages);
	if (totalPage == 0) {// 控制只有一页时是否显示
		$('#' + tableName + '_paginate').hide();
	} else if (totalPage >= 1) {
		$('#' + tableName + '_paginate').show();
	}
}

// 设置结果列表的高度
function setTableSize(id) {
	// 设置横向滚动条
	$("#" + id).width("99%");
	var dataTablesScrollBody = $("div.dataTables_scrollBody");
	if (dataTablesScrollBody.length != 0) {
		dataTablesScrollBody.style.width = "350";
	}
	// 当查询列表高度低于400时缩短列表高度
	var dataTablesScrollClass = $("div.dataTables_scroll");
	console.log(dataTablesScrollClass);
	var height = dataTablesScrollClass[0].children[1].children[0].clientHeight;// datatable中数据的高度
	if (height < 400) {
		dataTablesScrollClass[0].children[1].style.height = height + 5;
	} else if (height >= 400) {
		dataTablesScrollClass[0].children[1].style.height = 400;
	}
}

/**
 * 翻页
 * 
 * @param id 表格标识符
 * @param page 页码
 */
function changePage(id, page) {
	$('#' + id).dataTable().fnPageChange(page - 1);
}