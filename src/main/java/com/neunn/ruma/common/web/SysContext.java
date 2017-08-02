/**
 * @项目名称: ruma-web
 * @文件名称: SysContext.java
 * @Date: 2016年3月8日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月8日
 * @since 1.0
 */
public class SysContext {
    /**
     * 当前线程用户请求对象
     */
    private static ThreadLocal<HttpServletRequest> requestLocal =
            new ThreadLocal<HttpServletRequest>();

    /**
     * 当前线程用户响应对象
     */
    private static ThreadLocal<HttpServletResponse> responseLocal =
            new ThreadLocal<HttpServletResponse>();

    /**
     * 获得用户请求对象
     * 
     * @return 用户请求对象
     */
    public static HttpServletRequest getRequest() {
        return requestLocal.get();
    }

    /**
     * 设置用户请求对象
     * 
     * @param request 用户请求对象
     */
    public static void setRequest(HttpServletRequest request) {
        requestLocal.set(request);
    }

    /**
     * 获得用户响应对象
     * 
     * @return 用户响应对象
     */
    public static HttpServletResponse getResponse() {
        return responseLocal.get();
    }

    /**
     * 设置用户响应对象
     * 
     * @param response 用户响应对象
     */
    public static void setResponse(HttpServletResponse response) {
        responseLocal.set(response);
    }

    /**
     * 获得服务器会话对象
     * 
     * @return 服务器会话对象
     */
    public static HttpSession getSession() {
        return requestLocal.get().getSession();
    }
}
