/**
 * @项目名称: ruma-web
 * @文件名称: LoggingInterceptor.java
 * @Date: 2016年3月3日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.interceptors;

import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.NamedThreadLocal;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.neunn.ruma.common.web.SysContext;
import com.neunn.ruma.dao.LoggingDao;
import com.neunn.ruma.entity.LogEntity;
import com.neunn.ruma.utils.DateUtils;
import com.neunn.ruma.utils.SpringContextHolder;
import com.neunn.ruma.utils.StringUtils;

/**
 * 谁什么时间掉调用了什么接口
 * 
 * @author Frank
 * @date 2016年3月3日
 * @since 1.0
 */
public class LoggingInterceptor implements HandlerInterceptor {

    private static final ThreadLocal<Long> startTimeThreadLocal =
            new NamedThreadLocal<Long>("ThreadLocal StartTime");

    /**
     * 日志对象
     */
    protected Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * 
     */
    private LoggingDao loggingDao = SpringContextHolder.getBean(LoggingDao.class);
    
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
        SysContext.setRequest(request);;
        SysContext.setResponse(response); 
        if (logger.isDebugEnabled()) {
            long beginTime = System.currentTimeMillis();//1、开始时间  
            startTimeThreadLocal.set(beginTime); //线程绑定变量（该数据只有当前请求的线程可见）  
            logger.debug("开始计时: {}  URI: {}",
                    new SimpleDateFormat("hh:mm:ss.SSS").format(beginTime),
                    request.getRequestURI());
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
        if (modelAndView != null) {
            logger.info("ViewName: " + modelAndView.getViewName());
        }

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
//        UserEntity user = UserUtils.getUser();
//        if (user != null && user.getUsername() != null) {
            LogEntity log = new LogEntity();
            log.setType(ex == null ? LogEntity.TYPE_ACCESS : LogEntity.TYPE_EXCEPTION);
            log.setRemoteAddr(StringUtils.getRemoteAddr(request));
            log.setUserAgent(request.getHeader("user-agent"));
            log.setRequestUri(request.getRequestURI());
            log.setParams(request.getParameterMap());
            log.setMethod(request.getMethod());
            log.preInsert();
            loggingDao.saveLog(log);
//        }
        // 打印JVM信息。
        if (logger.isDebugEnabled()) {
            long beginTime = startTimeThreadLocal.get();//得到线程绑定的局部变量（开始时间）  
            long endTime = System.currentTimeMillis(); //2、结束时间  
            logger.debug(
                    "计时结束：{}  耗时：{}  URI: {}  最大内存: {}m  已分配内存: {}m  已分配内存中的剩余空间: {}m  最大可用内存: {}m",
                    new SimpleDateFormat("hh:mm:ss.SSS").format(endTime),
                    DateUtils.formatDateTime(endTime - beginTime), request.getRequestURI(),
                    Runtime.getRuntime().maxMemory() / 1024 / 1024,
                    Runtime.getRuntime().totalMemory() / 1024 / 1024,
                    Runtime.getRuntime().freeMemory() / 1024 / 1024,
                    (Runtime.getRuntime().maxMemory() - Runtime.getRuntime().totalMemory()
                            + Runtime.getRuntime().freeMemory()) / 1024 / 1024);
        }
    }

}
