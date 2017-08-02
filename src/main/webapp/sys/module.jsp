<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/include/common.jsp"%>
<head>
<title>模块管理-共通工程系统管理</title>

<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/eFont.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/nui.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/select.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/fcommon.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/common/system/forg.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/common/system/frole.css" />

<!--模态窗口-->
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/leanModal.css">
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jquery.dataTables.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/NUIjs/jquery.leanModal.min.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/NUIjs/selector.js"></script>

<!-- add by donghb -->
<link rel="stylesheet" href="<%= ctxStatic%>/css/framework/jstree.css" />
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jstree.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/system/module.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/util/string.js"></script>
<!-- add end -->


 
</head>
<body>

				<!--------------新增模板 模态窗口 开始----------------------->
				<div id="loginmodal-add" class="loginmodal lm500" style="display:none;">
					<h1><span></span><a class="icon-clear text-666 pull-right close" id="closeDiv"></a></h1>
					<div class="forg-add" style="padding:10px">
<!-- 						<p id="errorMessage" class="errorInfo"></p> -->
						<table class="dataTable">
							<tr>
								<td class="w30 text-right"><span class="text-red">*</span>ID：</td>
								<td><input type="text" id="moduleId"></td>	
							</tr>
							<tr>
								<td class="w30 text-right">请求URL</td>
								<td><input id="url" type="text"></td>	
							</tr>
							<tr>
								<td class="w30 text-right">请求方式</td>
								<td>
									<dl class="m-select" id="ServiceNon">
										<dt>
											<input class="text-select" type="text" id="selectItem" value="请选择"  />
										</dt>
										<dd>
											<input type="hidden" id="method">
										</dd>
									</dl>
								</td>	
							</tr>
							<tr>
								<td class="w30 text-right"><span class="text-red">*</span>名称：</td>
								<td>
									<input id="name" type="text">
								</td>	
							</tr>
							<tr>
								<td class="w30 text-right" style="vertical-align:top; padding-top:15px">父模块：</td>
								<td><input type="text" id="parentModuleName" onclick="showParentModule()">
								<input id="parentModuleId" type="hidden">
								<div id="parentModuleTree" style="width:80%;margin-top:10px"></div></td>	
							</tr>
							<tr>
								<td class="w30 text-right">描述：</td>
								<td><textarea id="description" rows="4"></textarea></td>	
							</tr>
							<tr>
								<td class="w30 text-right"></td>
								<td class="text-red"><label id="validateMessage"></label></td>	
							</tr>
							<tr>
								<td></td>
								<td>
									<a class="custom-btn custom-btn-default custom-btn-square form-btn close" id="addCancelDiv">取消</a>
									<a class="custom-btn custom-btn-info custom-btn-square form-btn" onclick="operateModule();">保存</a>
								</td>	
							</tr>
							<input id="operate" type="hidden">
						</table>
					</div>					
				</div>
				<!--------------删除模板 模态窗口 开始----------------------->
				<div id="loginmodal-del" class="confirm loginmodal lm500" style="display:none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							
							<tr>
								<td class="warning-txt"><span class="icon-info text-red f48"></span>您是否要删除模板?</td>	
							</tr>
							<tr>
								<td>
									<a class="custom-btn custom-btn-default custom-btn-square form-btn close" id="delCancelDiv">取消</a>
									<a class="custom-btn custom-btn-danger custom-btn-square form-btn" onclick="deleteModule();">删除</a>
								</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-prompt" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span>请选择要删除模板</td>	
							</tr>
						</table>
					</div>
				</div>

				<div id="del-success" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-checkmark text-green f48"></span>模板删除成功</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-failure" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-cancel text-red f48"></span>模板删除失败</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-prompt" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span>请选择要删除的模板</td>	
							</tr>
						</table>
					</div>
				</div>

				<div id="moduleProcess" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span><p id="moduleTableProcess"></p></td>	
							</tr>
						</table>
					</div>
				</div>
	<div class="box-fluid task_main ng-scope bbg" id="main">
		<div class="row">
			<div class="col-12" style="margin:0">
				<ol class="breadcrumb">
					<li class="text-999">您所在的位置：</li>
					<li class="active" id="currentPosition">模块管理</li> 
				</ol>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12" id="addModule" style="display: none;">
				<span class="pull-right">
				 <a class="custom-btn custom-btn-success custom-btn-square" id="modaltrigger-add" onclick="showCreateDiv();"> <span class="icon-add"></span>新增模块</a>
				 <a class="custom-btn custom-btn-danger custom-btn-square" id="modaltrigger-del" onclick="showDeleteConfirm();"> <span class="icon-remove"></span>删除模块</a>
				</span>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<table class="cell-border dataTable hover stripe" id="moduleTable">
					<thead>
						<tr>
							<th class="text-left w5"><input type="checkbox" id="allcb"/></th>
							<th class="text-left ">ID</th>
							<th class="text-left ">名称</th>
							<th class="text-left ">按钮</th>
							<th class="text-left ">描述</th>
							<th class="text-left ">父模板</th>
							<th class="text-left ">请求URL</th>
							<th class="text-left ">请求类型</th>
							<th class="text-left">操作</th>
						</tr>
					</thead>
				</table>

			</div>
		</div>

	</div>
	<div class="row">
		<div class="col-md-12">
			<!-- 占位-勿删 -->
		</div>
	</div>
	<input id="moduleId" type="hidden" value="org">
</body>
</html>