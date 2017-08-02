<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/include/common.jsp"%>
<head>
<title>角色管理-共通工程系统管理</title>

<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/eFont.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/nui.css" />

<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/fcommon.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/common/system/forg.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/common/system/frole.css" />
<!--模态窗口-->
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/leanModal.css">
<!-- add by donghb -->
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jquery.dataTables.js"></script>
<link rel="stylesheet" href="<%= ctxStatic%>/css/framework/jstree.css" />
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jstree.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/system/role.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/util/string.js"></script>
<!-- add end -->

 
</head>
<body>

				<!--------------新增角色 模态窗口 开始----------------------->
				<div id="loginmodal-add" class="loginmodal lm500" style="display:none;">
					<h1><span></span><a class="icon-clear text-666 pull-right close" id="closeDiv"></a></h1>
					<div class="forg-add" style="padding:10px">
						<p id="errorMessage" class="errorInfo"></p>
						<table class="dataTable">
							<tr>
								<td class="w30 text-right"><span class="text-red">*</span>角色名称：</td>
								<td><input id="name" type="text"></td>	
							</tr>
							<tr>
								<td class=" text-right" style="vertical-align:top">描述：</td>
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
									<a class="custom-btn custom-btn-info custom-btn-square form-btn" onclick="operateRole();">保存</a>
								</td>	
							</tr>
							<input id="roleId" type="hidden">
							<input id="operate" type="hidden">
						</table>
					</div>					
				</div>
				<!--------------删除角色 模态窗口 开始----------------------->
				<div id="loginmodal-del" class="confirm loginmodal lm500" style="display:none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							
							<tr>
								<td class="warning-txt"><span class="icon-info text-red f48"></span>您是否要删除角色？</p></td>	
							</tr>
							<tr>
								<td>
									<a class="custom-btn custom-btn-default custom-btn-square form-btn close" id="delCancelDiv">取消</a>
									<a class="custom-btn custom-btn-danger custom-btn-square form-btn" onclick="validation();">删除</a>
								</td>	
							</tr>
						</table>
					</div>
				</div>
				<div id="del-success" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-checkmark text-green f48"></span>删除角色成功</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-failure" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-cancel text-red f48"></span>删除角色失败</td>	
							</tr>
						</table>
					</div>
				</div>
				<div id="del-prompt" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span>请选择要删除的角色</td>	
							</tr>
						</table>
					</div>
				</div>
				<div id="validation-prompt" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span id="failedMessage"></span></td>	
							</tr>
						</table>
					</div>
				</div>
				<!--------------权限管理  模态窗口 开始----------------------->
				<div id="loginmodal-role" class="loginmodal lm700" style="display: none;">
					<h1>分配权限<a class="icon-clear text-666 pull-right close" id="roleCloseDiv"></a></h1>
					<div class="forg-add" style="padding:10px">
						<p id="roleErrorMessage" class="errorInfo"></p>
						<table class="dataTable">
							<tr>
								<td class="w45">
									<div class="title">系统权限</div>
									<div class="role-org" id="sysModuleTree">
										  
									</div>
								</td>
								<td class="w10 text-center">
									<a class="custom-btn custom-btn-default custom-btn-square icon-angle-double-right" onclick="addRoles();"></a>
									<a class="custom-btn custom-btn-default custom-btn-square icon-angle-double-left" onclick="removeRoles();"></a>
								</td>	
								<td class="w45">
									<div class="title">分配权限</div>
									<div class="role-org" id="roleModuleTree">
										 
									</div>
								</td>
							</tr>
							<tr>
								 
								<td colspan="3" class="text-center">
									<a class="custom-btn custom-btn-default custom-btn-square form-btn close" id="roleCancleDiv">取消</a>
									<a class="custom-btn custom-btn-info custom-btn-square form-btn" onclick="operateRoleRights();">保存</a>
								</td>	
							</tr>
						</table>
					</div>					
				</div>
				<!--------------模态窗口 开始 结束----------------------->
				
				<div id="roleProcess" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span><p id="roleTableProcess"></p></td>	
							</tr>
						</table>
					</div>
				</div>

	<div class="box-fluid task_main ng-scope bbg" id="main">
		<div class="row">
			<div class="col-12" style="margin:0">
				<ol class="breadcrumb">
					<li class="text-999">您所在的位置：</li>
					<li class="active">
						角色管理
					</li> 
				</ol>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12" id="addRole" style="display: none;">
				<span class="pull-right">
				 <a
					class="custom-btn custom-btn-success custom-btn-square" id="modaltrigger-add" onclick="showCreateDiv();"> <span
						class="icon-add"></span>新增角色
				</a>
				 <a class="custom-btn custom-btn-danger custom-btn-square" id="modaltrigger-del" onclick="showDeleteConfirm();"> <span
						class="icon-remove"></span>删除角色
				</a>
				</span>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<table class="cell-border dataTable hover stripe" id="roleTable">
					<thead>
						<tr>
							<th class="text-left w5"><input type="checkbox" id="allcb" /></th>
							<th class="text-left w25">角色名称</th>
							<th class="text-left w25">描述</th>
							<th class="text-left w25">操作</th>
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