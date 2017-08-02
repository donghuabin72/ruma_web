/**
 * @项目名称: ruma-web
 * @文件名称: UserController.java
 * @Date: 2016年2月17日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.controller;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletInputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.neunn.ruma.common.bean.Page;
import com.neunn.ruma.common.bean.PageData;
import com.neunn.ruma.common.web.BaseController;
import com.neunn.ruma.entity.UserCondition;
import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.entity.UserRoleEntity;
import com.neunn.ruma.service.UserRoleService;
import com.neunn.ruma.service.UserService;
import com.neunn.ruma.utils.MD5Util;
import com.neunn.ruma.utils.UserUtils;

/**
 * 用户管理Controller
 * 
 * @author Frank
 * @date 2016年2月17日
 * @since 1.0
 */
@Controller
@RequestMapping(value = "/sys/user")
public class UserController extends BaseController {

    @Autowired
    public UserService userService;

    /**
     * 角色信息处理服务实现类
     */
    @Autowired
    private UserRoleService userRoleService = null;

    /**
     * 根据用户ID查询用户信息请求响应方法
     * 
     * @param userId 用户ID
     * @return 用户信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "self")
    @ResponseBody
    public Object getLoginUser() {
        UserEntity loginUser = UserUtils.getUser();
        UserEntity userInfo = userService.getUserById(loginUser.getUsername());
        return userInfo;
    }


    /**
     * 用户信息查询请求响应方法
     * 
     * @return 用户信息列表
     */
    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Object getUsers() {
        UserCondition<UserEntity> page = new UserCondition<UserEntity>();
        if ("-1".equals(getRequest().getParameter("length"))) {
            page.setPageSize(10);
        } else {
            page.setPageSize(Integer.parseInt(getRequest().getParameter("length")));
        }
        page.setOffset(Integer.valueOf(getRequest().getParameter("start")));
        page.setSearchColumn("user_info.id");
        page.setSearchColumnType(Page.COLUMN_TYPE_STRING);
        page.setSortColumn(getRequest().getParameter(
                "columns[" + getRequest().getParameter("order[0][column]") + "][data]"));
        page.setSortOrder(getRequest().getParameter("order[0][dir]"));
        page.setSearchValue("%" + getRequest().getParameter("search[value]") + "%");
        page.setSearchValueOp(" ilike ");
        PageData userInfos = userService.getUsers(page);
        int draw = Integer.parseInt(getRequest().getParameter("draw") == null ? "0"
                : getRequest().getParameter("draw"));
        userInfos.setDraw(draw + 1);
        return userInfos;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/org/{orgId}")
    @ResponseBody
    public Object getUsersByOrgId(@PathVariable("orgId") String orgId) {
        UserCondition<UserEntity> page = new UserCondition<UserEntity>();
        if ("-1".equals(getRequest().getParameter("length"))) {
            page.setPageSize(10);
        } else {
            page.setPageSize(Integer.parseInt(getRequest().getParameter("length")));
        }
        page.setOffset(Integer.valueOf(getRequest().getParameter("start")));
        page.setSearchColumn("org_id,user_info.id");
        page.setSearchColumnType(Page.COLUMN_TYPE_STRING + "," + Page.COLUMN_TYPE_STRING);
        page.setSortColumn(getRequest().getParameter(
                "columns[" + getRequest().getParameter("order[0][column]") + "][data]"));
        page.setSortOrder(getRequest().getParameter("order[0][dir]"));
        page.setSearchValue(orgId + ",%" + getRequest().getParameter("search[value]") + "%");
        page.setSearchValueOp(" = , ilike ");
        PageData userInfos = userService.getUsers(page);
        int draw = Integer.parseInt(getRequest().getParameter("draw") == null ? "0"
                : getRequest().getParameter("draw"));
        userInfos.setDraw(draw + 1);
        return userInfos;
    }

    /**
     * 根据用户ID查询用户信息请求响应方法
     * 
     * @param userId 用户ID
     * @return 用户信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "{userId}")
    @ResponseBody
    public Object getUserById(@PathVariable("userId") String userId) {
        UserEntity userInfo = userService.getUserById(userId);
        return userInfo;
    }

    /**
     * 用户信息创建请求响应方法
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public Object createUser() {
        UserEntity userInfo = new UserEntity();
        userInfo.setUsername(getRequest().getParameter("id"));
        userInfo.setName(getRequest().getParameter("name"));
        userInfo.setPasswd(getRequest().getParameter("passwd"));
        userInfo.setOrgId(getRequest().getParameter("orgId"));
        String email = getRequest().getParameter("email");
        if (email != null && !email.equals("")) {
            userInfo.setEmail(email);
        }
        String tel = getRequest().getParameter("tel");
        if (tel != null && !tel.equals("")) {
            userInfo.setTel(tel);
        }
        Map<String, String> json = new HashMap<String, String>();
        //校验  hely 2016-03-17 增加校验 start
        Map<String, Object> validateMap  = beanValidatorStr(userInfo);
        if(!(Boolean)validateMap.get("isvalidate")){
            json.put("flag", "failed");
            json.put("validateMsg", String.valueOf(validateMap.get("msg")));
            return json;
        }
      //校验  hely 2016-03-17 增加校验  end
        int result = userService.insertUser(userInfo);
        
        if (result == 0) {
            json.put("flag", "failed");
        } else {
            json.put("flag", "succeed");
        }
        return json;
    }

    /**
     * 用户信息删除请求响应方法
     * 
     * @param userId 用户ID
     */
    @RequestMapping(method = RequestMethod.DELETE, value = "{userId}")
    @ResponseBody
    public Object deleteUser(@PathVariable("userId") String userId) {
        boolean sucess = true;
        Map<String, String> json = new HashMap<String, String>();
        if ("".equals(userId) || null == userId) {
            json.put("flag", "failed");
            return json;
        }
        String[] ids = userId.split("@");
        for (String id : ids) {
            if ("".equals(id) || null == id)
                continue;
            int result = userService.deleteUser(id);
            if (result == 0) {
                sucess = false;
            }
            List<UserRoleEntity> userRoleInfos = userRoleService.getUserRolesByUserId(id);
            for (UserRoleEntity userRoleInfo : userRoleInfos) {
                result = userRoleService.deleteUserRole(userRoleInfo);
                if (result == 0) {
                    sucess = false;
                }
            }
        }
        if (sucess) {
            json.put("flag", "succeed");
        } else {
            json.put("flag", "failed");
        }
        return json;
    }

    /**
     * 用户信息更新请求响应方法
     */
    @RequestMapping(method = RequestMethod.PUT)
    @ResponseBody
    public Object updateUser() {
        String paramString = "";
        Map<String, String> parameterMap = new HashMap<String, String>();
        try {
            BufferedReader br = new BufferedReader(
                    new InputStreamReader((ServletInputStream) getRequest().getInputStream()));
            String line = null;
            StringBuilder sb = new StringBuilder();
            while ((line = br.readLine()) != null) {
                sb.append(URLDecoder.decode(line, "UTF-8"));
            }
            paramString = sb.toString();
        } catch (IOException e) {
            // do nothing
            e.printStackTrace();
        }
        String[] params = paramString.split("&");
        for (String param : params) {
            String[] temp = param.split("=");
            if (temp.length == 2) {
                parameterMap.put(temp[0], temp[1]);
            } else {
                parameterMap.put(temp[0], "");
            }
        }
        UserEntity userInfo = new UserEntity();
        userInfo.setUsername(parameterMap.get("id"));
        userInfo.setName(parameterMap.get("name"));
        if (null != parameterMap.get("passwd"))
            userInfo.setPasswd(parameterMap.get("passwd"));
        userInfo.setOrgId(parameterMap.get("orgId"));
        userInfo.setEmail(parameterMap.get("email"));
        userInfo.setTel(parameterMap.get("tel"));
        int result = userService.updateUser(userInfo);
        Map<String, String> json = new HashMap<String, String>();
        if (result == 0) {
            json.put("flag", "failed");
        } else {
            json.put("flag", "succeed");
        }
        return json;
    }


    /**
     * 重置用户密码
     * 
     * @param userId 用户ID
     */
    @RequestMapping(method = RequestMethod.GET, value = "/reset/{userId}")
    @ResponseBody
    public void resetUserPassById(@PathVariable("userId") String userId) {
        if ("".equals(userId) || null == userId) {
            try {
                getResponse().setStatus(500);
                getResponse().getWriter().print("重置用户代码失败");
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }
        boolean success = true;
        String[] ids = userId.split("@");
        UserEntity userInfo = null;
        int result = 0;
        for (String id : ids) {
            if ("".equals(id))
                continue;
            userInfo = new UserEntity();
            userInfo.setUsername(id);
            userInfo.setPasswd(MD5Util.md5s32("123456"));
            result = userService.updateUser(userInfo);
            if (result == 0) {
                success = false;
                //              break;
            }

        }
        if (!success) {
            try {
                getResponse().setStatus(500);
                getResponse().getWriter().print("重置用户代码失败");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

}
