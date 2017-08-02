<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/include/common.jsp"%>
<head>
<title>共通工程系统管理</title>
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jquery.js"></script> 
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/jquery.dataTables.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/NUIjs/bootstrap-dropdown.js"></script> 

<!-- add by donghb  -->
<!-- <script type="text/javascript" src="<%= ctxStatic%>/js/framework/jquery.dataTables.js"></script> -->
<script type="text/javascript" src="<%= ctxStatic%>/js/framework/bootstrap.min.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/system/index.js"></script>	
<script type="text/javascript" src="<%= ctxStatic%>/js/common/system/common.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/system/home.js"></script>
<script type="text/javascript" src="<%= ctxStatic%>/js/common/global/const.js" ></script>
<script type='text/javascript' src='<%= ctxStatic%>/js/framework/md5.js'></script>
<script type='text/javascript' src='<%= ctxStatic%>/js/framework/artDialog.js'></script>
<script type='text/javascript' src="<%= ctxStatic%>/js/common/map/element/dialog.js"></script>
<!-- add end -->


 
<!--重置样式表-->
<link href="<%= ctxStatic%>/css/NUI/reset.css" rel="stylesheet">
<!-- 图标字体 -->
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/eFont.css" />
<!-- 主框架样式表  上导航，侧导航-->
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/NUI/mainnav-css/mainnav.css" />
<link rel="stylesheet" type="text/css" href="<%= ctxStatic%>/css/common/system/findex.css" />
<link rel='stylesheet' type='text/css' href="<%= ctxStatic%>/css/common/map/fmap.css">
<link rel='stylesheet' type='text/css' href='<%= ctxStatic%>/css/common/map/uedcss.css' />
<link rel='stylesheet' type='text/css' href='<%= ctxStatic%>/css/framework/artDialog.css' /> 

</head>
<body class="nifty-ready" style="padding: 0px;">

	<div id="container" class="effect mainnav-lg">
		<header class="" id="navbar">
			<div id="navbar-container" class="boxed">
				<div class="navbar-content">
					<ul class="nav navbar-top-links pull-left">


						<li class="tgl-menu-btn"><a class="mainnav-toggle" href="#">
								<i class="icon-menu f16"></i>
						</a></li>
					</ul>
				</div>

				<div class="navbar-header">
					<span class="custom-brand-text">共通开发框架</span>
				</div>

				<ul class="nav-user pull-right" style="margin-top: 0px;">
					<li class="dropdown" id="accountmenu"><a
						class="dropdown-toggle" data-toggle="dropdown" href="#"
						style="border: 0;"><label id="uName"></label><b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a href="javascript:showPasswordMaintainDiv();"><span
									class="icon-https f16"></span>密码修改</a></li>
							<li><a href="javascript:logout();"><span
									class="icon-exit f16"></span>退出账号</a></li>
						</ul></li>
				</ul>
			</div>
		</header>

		<!--------------修改密码 模态窗口 开始----------------------->
		<div id="loginmodal-modify-pwd" class="loginmodal lm500"
			style="display: none;">
			<h1>
				修改密码<a class="icon-clear text-666 pull-right close"
					id="modify-pwd-div"></a>
			</h1>
			<div class="forg-add" style="padding: 10px">
				<p id="errorMessage" class="errorInfo"></p>
				<table class="dataTable">
					<tr>
						<td class="w30 text-right">用户名：</td>
						<td><input id="loginId" type="text" readonly="true"></input></td>
					</tr>
					<tr>
						<td class=" text-right">原始密码：</td>
						<td><input id="pwdHid" type="hidden" value="" /> <input
							id="pwd" type="password" placeholder="输入原始密码..."></input></td>
					</tr>
					<tr>
						<td class=" text-right" style="vertical-align: top">密码：</td>
						<td><input id="pwd1" type="password" placeholder="输入新密码..."></input></td>
					</tr>
					<tr>
						<td class=" text-right" style="vertical-align: top">再次确认：</td>
						<td><input id="pwd2" type="password" placeholder="再次输入密码..."></input></td>
					</tr>
					<tr>
						<td></td>
						<td><a
							class="custom-btn custom-btn-default custom-btn-square form-btn"
							id="modify-pwd-cancelDiv">取消</a> <a
							class="custom-btn custom-btn-info custom-btn-square form-btn"
							onClick="updateUserPass();">保存</a></td>
					</tr>
				</table>
			</div>
		</div>


		<div class="boxed">
			<div id="content-container">
				<div id="page-content">
					<div class="content" id="iframepage"></div>
				</div>
			</div>
			<nav id="mainnav-container">
				<div id="mainnav">
					<div id="mainnav-menu-wrap">
						<div class="nano has-scrollbar">
							<div style="right: -17px;" tabindex="0" class="nano-content">
								<ul id="mainnav-menu" class="list-group">
									<li><a id="user"
										href="javascript:loadPage('user', 'user.jsp');"> <i
											class="icon-user f16"></i> <span class="menu-title">用户管理</span>
									</a></li>
									<li><a id="role"
										href="javascript:loadPage('role', 'role.jsp');"> <i
											class="icon-users-02 f16"></i> <span class="menu-title">角色管理</span>

									</a></li>
									<li><a id="module"
										href="javascript:loadPage('module', 'module.jsp');"> <i
											class="icon-now-widgets f16"></i> <span class="menu-title">模块管理</span>

									</a></li>
								</ul>

							</div>

						</div>
					</div>
				</div>
			</nav>
		</div>

	</div>

	<!--导航脚本 勿删-->

	<script src="<%=ctxStatic%>/js/NUIjs/bootstrap.js"></script>
	<script src="<%=ctxStatic%>/js/NUIjs/nifty.js"></script>
	<input id="moduleId" type="hidden" value="system">
</body>
</html>