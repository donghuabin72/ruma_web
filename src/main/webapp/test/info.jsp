<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/common.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<shiro:hasPermission name="person-student-add">
    <input type="button" value="增加">
</shiro:hasPermission>

<shiro:hasPermission name="person-student-delete">
<input type="button" value="删除">
</shiro:hasPermission>

<shiro:hasPermission name="person-student-import">
<input type="button" value="导入">
</shiro:hasPermission>

<shiro:hasPermission name="person-student-export">
<input type="button" value="导出">
</shiro:hasPermission>
</body>
</html>