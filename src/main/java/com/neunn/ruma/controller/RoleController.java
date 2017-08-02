/**
 * @项目名称: ruma-web
 * @文件名称: RoleController.java
 * @Date: 2016年2月17日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
import com.neunn.ruma.entity.RoleCondition;
import com.neunn.ruma.entity.RoleEntity;
import com.neunn.ruma.service.RoleService;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年2月17日
 * @since 1.0
 */
@Controller
@RequestMapping(value = "/sys/role")
public class RoleController extends BaseController {


    /**
     * 角色信息处理服务实现类
     */
    @Autowired
    private RoleService roleService = null;

    /**
     * 根据角色ID查询角色信息请求响应方法
     * 
     * @param roleId 角色ID
     * @return 角色信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "{roleId}")
    @ResponseBody
    public Object getRoleById(@PathVariable("roleId") String roleId) {
        RoleEntity RoleEntity = roleService.getRoleById(roleId);
        return RoleEntity;
    }

    /**
     * 根据角色名称查询角色信息请求响应方法
     * 
     * @param roleName 角色名称
     * @return 角色信息列表
     */
    @RequestMapping(method = RequestMethod.GET, value = "/getRoleByName/{roleName}")
    @ResponseBody
    public Object getRoleByName(@PathVariable("roleName") String roleName)
            throws UnsupportedEncodingException {
        List<RoleEntity> RoleEntitys =
                roleService.getRoleByName(new String(roleName.getBytes("iso-8859-1"), "UTF-8"));
        return RoleEntitys;

    }

    @RequestMapping(method = RequestMethod.GET, value = "/updateValidate")
    @ResponseBody
    public Object updateValidate() throws UnsupportedEncodingException {
        String name = new String(getRequest().getParameter("name").getBytes("iso-8859-1"), "UTF-8");
        List<RoleEntity> RoleEntitys = roleService.getRoleByName(name);
        String id = getRequest().getParameter("id");
        RoleEntity rinfo = null;
        for (RoleEntity info : RoleEntitys) {
            if (info.getName().equals(name) && !id.equals(info.getId())) {
                rinfo = info;
                break;
            }
        }
        return rinfo;
    }

    /**
     * 角色信息查询请求响应方法
     * 
     * @return 角色信息列表
     */
    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Object getRoles() {
        RoleCondition<RoleEntity> page = new RoleCondition<RoleEntity>();
        if ("-1".equals(getRequest().getParameter("length"))) {
            page.setPageSize(10);
        } else {
            page.setPageSize(Integer.parseInt(getRequest().getParameter("length")));
        }
        page.setOffset(Integer.valueOf(getRequest().getParameter("start")));
        page.setSearchColumn("name");
        page.setSearchColumnType(Page.COLUMN_TYPE_STRING);
        page.setSortColumn(getRequest().getParameter(
                "columns[" + getRequest().getParameter("order[0][column]") + "][data]"));
        page.setSortOrder(getRequest().getParameter("order[0][dir]"));
        try {
            page.setSearchValue("%"
                    + new String(getRequest().getParameter("search[value]").getBytes("iso-8859-1"),
                            "UTF-8")
                    + "%");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        page.setSearchValueOp(" ilike ");
        PageData RoleEntitys = roleService.getRoles(page);
        int draw = Integer.parseInt(getRequest().getParameter("draw") == null ? "0"
                : getRequest().getParameter("draw"));
        RoleEntitys.setDraw(draw + 1);
        return RoleEntitys;
    }

    /**
     * 角色信息创建请求响应方法
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public void createRole() {
        RoleEntity RoleEntity = new RoleEntity();
        RoleEntity.setId(UUID.randomUUID().toString());
        RoleEntity.setName(getRequest().getParameter("name"));
        String description = getRequest().getParameter("description");
        if (description != null && !description.equals("")) {
            RoleEntity.setDescription(description);
        }
        roleService.insertRole(RoleEntity);
    }

    /**
     * 角色信息删除请求响应方法
     * 
     * @param roleId 角色ID
     */
    @RequestMapping(method = RequestMethod.DELETE, value = "{roleId}")
    @ResponseBody
    public void deleteRole(@PathVariable("roleId") String roleId) {
        String[] ids = roleId.split("@");
        for (String id : ids) {
            if ("".equals(id))
                continue;
            roleService.deleteRole(id);
        }

    }

    /**
     * 角色信息更新请求响应方法
     */
    @RequestMapping(method = RequestMethod.PUT)
    @ResponseBody
    public void updateRole() {
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
        RoleEntity RoleEntity = new RoleEntity();
        RoleEntity.setId(parameterMap.get("id"));
        RoleEntity.setName(parameterMap.get("name"));
        RoleEntity.setDescription(parameterMap.get("description"));
        roleService.updateRole(RoleEntity);
    }

    /**
     * 根据用户ID查询系统可以分配的角色信息请求响应方法
     * 
     * @param userId 用户ID
     * @return 角色信息列表
     */
    @RequestMapping(method = RequestMethod.GET, value = "/user/{userId}")
    @ResponseBody
    public Object getSysRolesByUserId(@PathVariable("userId") String userId) {
        List<RoleEntity> RoleEntitys = roleService.getRolesByUserId(userId);
        return RoleEntitys;
    }

}
