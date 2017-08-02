/**
 * @项目名称: ruma-web
 * @文件名称: XSSInterceptor.java
 * @Date: 2016年3月3日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.interceptors;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.neunn.ruma.common.security.XSSHttpRequestWrapper;
import com.neunn.ruma.common.security.XSSSecurityCon;
import com.neunn.ruma.common.security.XSSSecurityConfig;
import com.neunn.ruma.common.security.XSSSecurityManager;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月3日
 * @since 1.0
 */
public class XSSInterceptor implements HandlerInterceptor {

    /**
     * @author Frank
     * @date 2016年3月3日
     */
    public XSSInterceptor(Resource xssConfigPath) {
        XSSSecurityManager.init(xssConfigPath);
    }

    /**
     * 日志对象
     */
    protected Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年3月3日
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
        // 判断是否使用HTTP  
        checkRequestResponse(request, response);
        // 转型  
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        // http信息封装类  
        XSSHttpRequestWrapper xssRequest = new XSSHttpRequestWrapper(httpRequest);

        // 对request信息进行封装并进行校验工作，若校验失败（含非法字符），根据配置信息进行日志记录和请求中断处理  
        if (xssRequest.validateParameter(httpResponse)) {
            if (XSSSecurityConfig.IS_LOG) {
                // 记录攻击访问日志  
                // 可使用数据库、日志、文件等方式  
                logger.debug("有xss攻击");
            }
            if (XSSSecurityConfig.IS_CHAIN) {
                httpRequest.getRequestDispatcher(XSSSecurityCon.FILTER_ERROR_PAGE)
                        .forward(httpRequest, httpResponse);
                return false;
            }
        }
        return true;
    }

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年3月3日
     * @param request
     * @param response
     * @param handler
     * @param modelAndView
     * @throws Exception
     * @since 1.0
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        // TODO Auto-generated method stub

    }

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年3月3日
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @throws Exception
     * @since 1.0
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
            Object handler, Exception ex) throws Exception {
        // TODO Auto-generated method stub

    }

    /**
     * 判断Request ,Response 类型
     * 
     * @param request ServletRequest
     * @param response ServletResponse
     * @throws ServletException
     */
    private void checkRequestResponse(ServletRequest request, ServletResponse response)
            throws ServletException {
        if (!(request instanceof HttpServletRequest)) {
            throw new ServletException("Can only process HttpServletRequest");

        }
        if (!(response instanceof HttpServletResponse)) {
            throw new ServletException("Can only process HttpServletResponse");
        }
    }

}
