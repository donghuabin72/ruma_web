/**
 *@项目名称: ruma-web
 *@文件名称: UserRoleController.java
 *@Date: 2016年3月10日
 *@Copyright: 2016-2016 www.neunn.com  All rights reserved.
 *注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.neunn.ruma.common.web.BaseController;
import com.neunn.ruma.entity.UserRoleEntity;
import com.neunn.ruma.service.RoleService;
import com.neunn.ruma.service.UserRoleService;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月10日 
 * @since 1.0
 */
@Controller
@RequestMapping("/sys/userRole")
public class UserRoleController extends BaseController{


    /**
     * 用户角色信息处理服务实现类
     */
    @Autowired
    private UserRoleService userRoleService = null;
    @Autowired
    private RoleService roleService = null;

    /**
     * 根据用户ID查询用户角色信息请求响应方法
     * 
     * @param userId 用户ID
     * @return 用户角色信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "{userId}")
    @ResponseBody
    public Object getUserRolesByUserId(@PathVariable("userId") String userId) {
        List<UserRoleEntity> userRoleInfos = userRoleService.getUserRolesByUserId(userId);
        return userRoleInfos;
    }
    
    /**
     * 根据用户ID查询用户角色信息请求响应方法
     * 
     * @param userId 用户ID
     * @return 用户角色信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "/role/{roleId}")
    @ResponseBody
    public Object getUserRolesByRoleId(@PathVariable("roleId") String roleId) {
        List<String> roleNameList = new ArrayList<String>();
        String [] ids = roleId.split("@");
        for(String id : ids){
            if("".equals(id))
                continue;
            List<UserRoleEntity> userRoleInfos = userRoleService.getUserRolesByRoleId(id);
            if(userRoleInfos.size()>0)
                roleNameList.add(roleService.getRoleById(id).getName());
        }
        return roleNameList;
    }

    /**
     * 用户角色信息创建请求响应方法
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public void createUserRole() {
        String userId = getRequest().getParameter("userId");
        UserRoleEntity userRoleInfo = new UserRoleEntity();
        userRoleInfo.setUserId(userId);
        userRoleService.deleteUserRole(userRoleInfo);
        
        String[] roleIds = getRequest().getParameter("roleId").split(",");
        for (String roleId : roleIds) {
            userRoleInfo = new UserRoleEntity();
            userRoleInfo.setId(UUID.randomUUID().toString());
            userRoleInfo.setRoleId(roleId);
            userRoleInfo.setUserId(userId);
            userRoleService.insertUserRole(userRoleInfo);
        }
    }

    /**
     * 用户角色信息删除请求响应方法
     * 
     * @param userId 用户ID
     */
    @RequestMapping(method = RequestMethod.POST, value = "delete")
    @ResponseBody
    public void deleteUserRole(@PathVariable("userId") String userId) {
        UserRoleEntity userRoleInfo = new UserRoleEntity();
        userRoleInfo.setRoleId(getRequest().getParameter("roleId"));
        userRoleInfo.setUserId(getRequest().getParameter("userId"));
        userRoleService.deleteUserRole(userRoleInfo);
    }

}
