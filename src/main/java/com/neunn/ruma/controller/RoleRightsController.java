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
import com.neunn.ruma.entity.ModuleEntity;
import com.neunn.ruma.entity.RoleRightsEntity;
import com.neunn.ruma.entity.TreeNode;
import com.neunn.ruma.service.ModuleService;
import com.neunn.ruma.service.RoleRightsService;

/**
 * <p>
 * Class : com.neunn.system.rights.controller.RoleRightsController
 * <p>
 * Descdription: 角色权限信息信息处理请求响应实现类
 * 
 * @author 赵广志-zhaogz@neunn.com
 * @version 1.0.0
 *          <p>
 *          --------------------------------------------------------------<br>
 *          修改履历：<br>
 *          <li>2015年5月28日，zhaogz@neunn.com，创建文件；<br>
 *          --------------------------------------------------------------<br>
 *          </p>
 */
@Controller
@RequestMapping("/sys/roleRights")
public class RoleRightsController extends BaseController {

    /**
     * 角色权限信息处理服务实现类
     */
    @Autowired
    private RoleRightsService roleRightsService = null;

    /**
     * 系统模块信息处理服务实现类
     */
    @Autowired
    private ModuleService moduleService = null;

    /**
     * 根据角色ID查询角色权限信息信息请求响应方法
     * 
     * @param roleId 角色ID
     * @return 角色权限信息信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "{roleId}/{moduleId}")
    @ResponseBody
    public Object getRoleRightsByRoleId(@PathVariable("roleId") String roleId,
            @PathVariable("moduleId") String moduleId) {
        // 获得角色的权限信息
        List<RoleRightsEntity> roleRightsInfos = roleRightsService.getRoleRightsByRoleId(roleId);
        List<ModuleEntity> roleRightsTree = new ArrayList<ModuleEntity>();
        for (RoleRightsEntity temp : roleRightsInfos) {
            List<ModuleEntity> moduleTree =
                    moduleService.getRightsTreeByModuleId(temp.getModuleId());
            for (ModuleEntity moduleInfo : moduleTree) {
                if (!roleRightsTree.contains(moduleInfo)) {
                    roleRightsTree.add(moduleInfo);
                }
            }
        }
        // 获得当前模块的子模块信息
        List<ModuleEntity> sysRightsInfos = null;
        if ("null".equals(moduleId)) {
            sysRightsInfos = moduleService.getModulesByParentId(null);
        } else {
            sysRightsInfos = moduleService.getModulesByParentId(moduleId);
        }

        List<TreeNode> result = new ArrayList<TreeNode>();
        for (ModuleEntity moduleTemp : sysRightsInfos) {
            for (ModuleEntity moduleInfoTemp : roleRightsTree) {
                if (moduleTemp.getId().equals(moduleInfoTemp.getId())) {
                    TreeNode childNode = new TreeNode();
                    childNode.setId(moduleTemp.getId());
                    childNode.setText(moduleTemp.getName());
                    List<ModuleEntity> tempOrgInfos =
                            moduleService.getModulesByParentId(moduleTemp.getId());
                    if (tempOrgInfos.size() > 0) {
                        childNode.setChildren(true);
                    } else {
                        childNode.setChildren(false);
                    }
                    result.add(childNode);
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 角色权限信息信息创建请求响应方法
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public void createUserRole() {
        String roleId = getRequest().getParameter("roleId");
        RoleRightsEntity roleRightsInfo = new RoleRightsEntity();
        roleRightsInfo.setRoleId(roleId);
        roleRightsService.deleteRoleRights(roleRightsInfo);

        String[] moduleIds = getRequest().getParameter("rights").split(",");
        for (String moduleId : moduleIds) {
            roleRightsInfo = new RoleRightsEntity();
            roleRightsInfo.setId(UUID.randomUUID().toString());
            roleRightsInfo.setRoleId(roleId);
            roleRightsInfo.setModuleId(moduleId);
            roleRightsService.insertRoleRights(roleRightsInfo);
        }
    }

    /**
     * 角色权限信息信息删除请求响应方法
     * 
     * @param roleId 角色ID
     */
    @RequestMapping(method = RequestMethod.POST, value = "delete")
    @ResponseBody
    public void deleteUserRole(@PathVariable("roleId") String roleId) {
        RoleRightsEntity roleRightsInfo = new RoleRightsEntity();
        roleRightsInfo.setRoleId(getRequest().getParameter("roleId"));
        roleRightsInfo.setModuleId(getRequest().getParameter("moduleId"));
        roleRightsService.deleteRoleRights(roleRightsInfo);
    }
}
