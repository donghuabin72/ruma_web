package com.neunn.ruma.common.exception.handler;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import com.neunn.ruma.common.exception.ApplicationException;
import com.neunn.ruma.common.exception.RTException;
import com.neunn.ruma.common.exception.SystemException;

/**
 * <p>
 * Class : com.neunn.base.exception.handler.ExceptionHandler
 * <p>
 * Descdription: 异常处理实现类
 * 
 * @author 赵广志-zhaogz@neunn.com
 * @version 1.0.0
 *          <p>
 *          --------------------------------------------------------------<br>
 *          修改履历：<br>
 *          <li>2014年7月7日，zhaogz@neunn.com，创建文件；<br>
 *          --------------------------------------------------------------<br>
 *          </p>
 */
@Component
public class ExceptionHandler implements HandlerExceptionResolver {

    /**
     * 异常处理实现方法
     * 
     * @param request 用户请求
     * @param response 用户响应
     * @param handler 异常处理对象
     * @param exception 发生异常
     * @return 跳转路径
     * @see org.springframework.web.servlet.HandlerExceptionResolver#resolveException(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse, java.lang.Object, java.lang.Exception)
     */
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response,
            Object handler, Exception exception) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("exception", exception);

        final String errortitle = "Error";
        WebApplicationContext context = WebApplicationContextUtils
                .getRequiredWebApplicationContext(request.getSession().getServletContext());
        if (exception instanceof ApplicationException) {
            ApplicationException appException = (ApplicationException) exception;
            model.put("errortitle", errortitle);
            String message = context.getMessage(appException.getMessageKey(),
                    appException.getParam(), Locale.CHINA);
            model.put("message", message);
        } else if (exception instanceof SystemException) {
            SystemException sysException = (SystemException) exception;
            model.put("errortitle", errortitle);
            String message = context.getMessage(sysException.getMessageKey(),
                    sysException.getParam(), Locale.CHINA);
            model.put("message", message);
        } else if (exception instanceof RTException) {
            RTException rtException = (RTException) exception;
            model.put("errortitle", errortitle);
            String message = context.getMessage(rtException.getMessageKey(), rtException.getParam(),
                    Locale.CHINA);
            model.put("message", message);
        } else {
            model.put("errortitle", errortitle);
            ResourceBundle bundle = ResourceBundle.getBundle("message", Locale.getDefault());
            String message = bundle.getString("system.info.error");
            model.put("message", message);
        }
        return new ModelAndView("error", model);
    }

}
