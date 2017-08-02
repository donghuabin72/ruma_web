/**
 * @项目名称: ruma-web
 * @文件名称: WebInterceptor.java
 * @Date: 2016年3月9日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.neunn.ruma.common.web.SysContext;

/**
 * webmvc请求拦截器
 * 
 * @author Frank
 * @date 2016年3月9日
 * @since 1.0
 */
public class WebInterceptor extends HandlerInterceptorAdapter {


    /**
     * 将请求对象和相应对象绑定到本地线程对象上
     * 
     * @author Frank
     * @date 2016年3月9日
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     * @since 1.0
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
            Object handler) throws Exception {
        SysContext.setRequest(request);
        SysContext.setResponse(response);
        return super.preHandle(request, response, handler);
    }

}
