
<%
   String ctx = request.getContextPath();
   String ctxStatic = ctx+"/static";
%>
<%@ taglib prefix="shiro" uri="/WEB-INF/tlds/shiros.tld"%>
<script type="text/javascript">var basePath = '<%= ctx%>', ctxStatic='<%= ctxStatic%>';</script>