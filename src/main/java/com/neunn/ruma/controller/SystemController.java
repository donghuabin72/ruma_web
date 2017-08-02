/**
 * @项目名称: ruma-web
 * @文件名称: SystemController.java
 * @Date: 2016年3月7日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.controller;

import java.util.HashMap;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.neunn.ruma.common.config.Global;
import com.neunn.ruma.common.web.BaseController;
import com.neunn.ruma.utils.ObjectUtils;
import com.neunn.ruma.utils.UserUtils;
import com.neunn.ruma.utils.mapper.JsonMapper;

/**
 * 系统服务controller
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年3月7日
 * @since 1.0
 */
@Controller
@RequestMapping(value = "/sys")
public class SystemController extends BaseController {

    @RequestMapping(value = "/index")
    public String login(HttpServletRequest request, HttpServletResponse response) {
        if("管理员".equals(UserUtils.getUser().getRoleName())){
            return "modules/sys/index";    
        }else{
            return "modules/sys/main";
        }
    }

    @RequestMapping(value = "/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        //退出
        SecurityUtils.getSubject().logout();
        return "modules/sys/login";
    }

    /**
     * 获取当前登录用户的信息
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年3月8日
     * @param request
     * @param response
     * @return
     * @since 1.0
     */
    @RequestMapping(value = "/getLoginUser", method = RequestMethod.GET)
    @ResponseBody
    public String getLoginUser(HttpServletRequest request, HttpServletResponse response) {
        Map<String, String> resultMap = new HashMap<String, String>();
        try {
            resultMap.put(Global.MSG, JsonMapper.toJsonString(UserUtils.getUser()));
            resultMap.put(Global.STATUS, Global.SUCCESS);
        } catch (Exception e) {
            resultMap.put(Global.MSG, Global.getConfig("system.info.error"));
            resultMap.put(Global.STATUS, Global.FAIL);
            logger.error("系统获取信息异常", e);
        }
        return renderString(response, resultMap);
    }

    /**
     * 获取系统设置的常量
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年3月8日
     * @param request
     * @param response
     * @return
     * @since 1.0
     */
    @RequestMapping(value = "/getGlobalConfig", method = RequestMethod.GET)
    @ResponseBody
    public String getGlobalConfig(HttpServletRequest request, HttpServletResponse response) {
        Map<String, String> resultMap = new HashMap<String, String>();
        try {
            Object globalConfig = "";
            String config = request.getParameter("config");
            globalConfig = Global.getConst(config);
            if (ObjectUtils.isEmpty(globalConfig)) {
                globalConfig = Global.getConfig(config);
            }
            resultMap.put(Global.MSG, String.valueOf(globalConfig));
            resultMap.put(Global.STATUS, Global.SUCCESS);
        } catch (Exception e) {
            resultMap.put(Global.MSG, Global.getConfig("system.info.error"));
            resultMap.put(Global.STATUS, Global.FAIL);
            logger.error("系统获取信息异常", e);
        }
        return renderString(response, resultMap);
    }
}
