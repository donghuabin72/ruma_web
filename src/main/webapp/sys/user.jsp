<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/common.jsp"%>
<%
    String orgId = request.getParameter("orgId");
%>
<!DOCTYPE html>
<html>
<head>
<title>角色管理-共通工程系统管理</title>

<link rel="stylesheet" type="text/css" href="<%=ctxStatic%>/css/NUI/eFont.css" />
<link rel="stylesheet" type="text/css" href="<%=ctxStatic%>/css/NUI/nui.css" />

<link rel="stylesheet" type="text/css" href="<%=ctxStatic%>/css/NUI/fcommon.css" />
<link rel="stylesheet" type="text/css" href="<%=ctxStatic%>/css/common/system/forg.css" />
<link rel="stylesheet" type="text/css" href="<%=ctxStatic%>/css/common/system/frole.css" />

<!--模态窗口-->
<link rel="stylesheet" type="text/css" href="<%=ctxStatic%>/css/NUI/leanModal.css">
<script type="text/javascript" src="<%=ctxStatic%>/js/NUIjs/jquery.leanModal.min.js"></script>

<!-- add by donghb -->
<link rel="stylesheet" href="<%=ctxStatic%>/css/framework/jstree.css" />
<script type="text/javascript" src="<%=ctxStatic%>/js/framework/md5.js"></script>
<script type="text/javascript" src="<%=ctxStatic%>/js/framework/jstree.js"></script>
<script type="text/javascript" src="<%=ctxStatic%>/js/common/system/user.js"></script>
<script type="text/javascript" src="<%=ctxStatic%>/js/common/util/string.js"></script>
<!-- add end -->


 
</head>
<body>

				<!--------------新增用户 模态窗口 开始----------------------->
				<div id="loginmodal-add" class="loginmodal lm500" style="display:none;">
					<h1><span></span><a class="icon-clear text-666 pull-right close" id="closeDiv"></a></h1>
					<div class="forg-add" style="padding:10px">
						<p id="errorMessage" class="errorInfo"></p>
						<table class="dataTable">
							<tr>
								<td class="w30 text-right"><span class="text-red">*</span>用户名：</td>
								<td><input type="text" id="userId"></td>	
							</tr>
							<tr>
								<td class="w30 text-right"><span class="text-red">*</span>密码：</td>
								<td><input id="password" type="password"></td>	
							</tr>
							<tr>
								<td class="w30 text-right"><span class="text-red">*</span>姓名：</td>
								<td><input type="text" id="userName"></td>	
							</tr>
							<tr>
								<td class="w30 text-right">邮件：</td>
								<td><input type="text" id="email" placeholder="example@*.com"></td>	
							</tr>
							<tr>
								<td class="w30 text-right">移动电话：</td>
								<td><input type="text" id="mobile"></td>	
							</tr>
							<tr>
								<td class="w30 text-right"></td>
								<td class="text-red"><label id="validateMessage"></label></td>	
							</tr>
							<tr>
								<td></td>
								<td>
									<a class="custom-btn custom-btn-default custom-btn-square form-btn close" id="addCancelDiv">取消</a>
									<a class="custom-btn custom-btn-info custom-btn-square form-btn" onclick="operateUser();">保存</a>
								</td>	
							</tr>
							<input id="operate" type="hidden">
						</table>
					</div>					
				</div>
				<!--------------删除用户 模态窗口 开始----------------------->
				<div id="loginmodal-del" class="confirm loginmodal lm500" style="display:none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							
							<tr>
								<td class="warning-txt"><span class="icon-info text-red f48"></span>您是否要删除该用户?</td>	
							</tr>
							<tr>
								<td>
									<a class="custom-btn custom-btn-default custom-btn-square form-btn close" id="delCancelDiv">取消</a>
									<a class="custom-btn custom-btn-danger custom-btn-square form-btn" onclick="deleteUser();">删除</a>
								</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-prompt" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span>请选择要删除的用户</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="reset-prompt" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="f48"></span>请选择要重置密码的用户</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-success" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-checkmark text-green f48"></span>用户删除成功</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="del-failure" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-cancel text-red f48"></span>用户删除失败</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="reset-success" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-checkmark text-green f48"></span>密码重置为"123456"</td>	
							</tr>
						</table>
					</div>
				</div>
				
				<div id="reset-failure" class="confirm loginmodal lm500" style="display: none;">					
					<div class="forg-add" style="padding:10px">
						<table class="dataTable">
							<tr>
								<td class="warning-txt"><span class="icon-cancel text-red f48"></span>重置密码失败</td>	
							</tr>
						</table>
					</div>
				</div>
	<!--------------重置密码  模态窗口 开始----------------------->
	<div id="loginmodal-resetpsw" class="confirm loginmodal lm500" style="display: none;">
		<div class="forg-add" style="padding: 10px">
			<table class="dataTable">

				<tr>
					<td class="warning-txt"><span class="icon-info text-red f48"></span>您是否要重置密码?</td>
				</tr>
				<tr>
					<td><a
						class="custom-btn custom-btn-default custom-btn-square form-btn close" id="resetDiv">取消</a>
						<a class="custom-btn custom-btn-danger custom-btn-square form-btn" onclick="resetUserPass();">确定</a>
					</td>
				</tr>
			</table>
		</div>

	</div>
	<!--------------重置密码  模态窗口 结束----------------------->				
	<!--------------分配角色  模态窗口 开始----------------------->
	<div id="loginmodal-set" class="loginmodal lm600" style="display: none;">	
		<h1>
			分配角色<a class="icon-clear text-666 pull-right close" id="roleDiv"></a>
		</h1>
		<div class="forg-add" style="padding: 10px">
			<table class="dataTable">
				<tr>
					<td class="w45">
						<div class="cnt-title">系统角色</div>
						<div class="cnt-list">
							<select multiple id="sysRoles" style="width:213px; overflow: hidden;font-size: 14px;border: 0; height:257px;"></select>
						</div>
					</td>
					<td class="w10 text-center">
						<p>
							<a class="custom-btn custom-btn-default custom-btn-square icon-angle-double-right" onclick="addRoles();"></a>
						</p>
						<p>
							<a class="custom-btn custom-btn-default custom-btn-square icon-angle-double-left" onclick="removeRoles();"></a>
						</p>
					</td>
					<td class="w45">
						<div class="cnt-title">分配角色</div>
						<div class="cnt-list">
							<select multiple id="userRoles" style="width:213px; overflow: hidden;font-size: 14px;border: 0; height:257px;"> </select>
	 								
						</div>
					</td>
				</tr>
				<tr>
					<td class="w30 text-right"></td>
					<td class="text-red"><label id="roleErrorMessage"></label></td>	
				</tr>
				<tr>
					<td class="text-center" colspan="3"><a
						class="custom-btn custom-btn-default custom-btn-square form-btn close" id="roleCancelDiv" id="">取消</a>
						<a class="custom-btn custom-btn-info custom-btn-square form-btn" onclick="operateUserRole();">保存</a>
					</td>
				</tr>
			</table>
		</div>
	</div>
	<!--------------分配角色  模态窗口 结束----------------------->
	
	
		<div id="orgProcess" class="confirm loginmodal lm500" style="display: none;">					
			<div class="forg-add" style="padding:10px">
				<table class="dataTable">
					<tr>
						<td class="warning-txt"><span class="f48"></span><p id="userTableProcess"></p></td>	
					</tr>
				</table>
			</div>
		</div>

	<div class="box-fluid task_main ng-scope bbg" id="main">
		<div class="row">
			<div class="col-12" style="margin:0">
				<ol class="breadcrumb">
					<li class="text-999">您所在的位置：</li>
					<li class="active" id="currentPosition">用户管理</li> 
				</ol>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12" id="addUser" style="display: none;">
				<span class="pull-right">
				 <a class="custom-btn custom-btn-success custom-btn-square" id="modaltrigger-add" onclick="showCreateDiv();"> <span class="icon-add"></span>新增用户</a>
				 <a class="custom-btn custom-btn-danger custom-btn-square" id="modaltrigger-del" onclick="showDeleteConfirm();"> <span class="icon-remove"></span>删除用户 </a>
			     <a class="custom-btn custom-btn-default custom-btn-square" id="modaltrigger-resetpsw" onclick="showResetConfirm();"> <span class="icon-lock-outline"></span>重置密码</a>
				</span>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<table class="cell-border dataTable hover stripe" id="userTable">
					<thead>
						<tr>
							<th class="text-left w5"><input type="checkbox" id="allcb"/></th>
							<th class="text-left ">用户名</th>
							<th class="text-left ">姓名</th>
							<th class="text-left ">邮件</th>
							<th class="text-left ">移动电话</th>
							<th class="text-left ">所属部门</th>
							<th class="text-left ">用户角色</th>
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
	<input id="searchOrgId" type="hidden" value="<%=orgId%>">
	<input id="moduleId" type="hidden" value="org">
</body>
</html>