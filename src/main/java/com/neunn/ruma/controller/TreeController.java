package com.neunn.ruma.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.neunn.ruma.common.web.BaseController;
import com.neunn.ruma.entity.TreeNode;
import com.neunn.ruma.service.TreeService;
import com.neunn.ruma.utils.mapper.JsonMapper;

/**
 * <p>
 * Class : com.neunn.tree.controller.TreeController
 * <p>
 * Descdription: 
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
@RequestMapping("/sys/tree")
public class TreeController extends BaseController {

    /**
     * 组织机构信息处理服务实现类
     */
    @Autowired
    private TreeService treeService = null;

    
    /**
     * 获得系统权限的树形机构
     *
     * @param parentId 父节点ID
     * @return 系统权限树形结构
     */
    @RequestMapping(method = RequestMethod.GET, value = "/module/{parentId}")
    @ResponseBody
    public Object getSubModuleNodesById(@PathVariable("parentId") String parentId) {
    	String [] info = parentId.split("@");
    	String id = null;
    	if(info.length>1)
    		id = info[1];
        return treeService.getSubModuleNodesById(info[0],id,true,false);
    }
    
    /**
     * 根据当前用户角色获得左侧菜单的树形机构
     *
     * @param parentId 父节点ID
     * @return 系统权限树形结构
     */
    @RequestMapping(method = RequestMethod.GET, value = "/role/module/{parentId}")
    @ResponseBody
    public Object getRoleSubModuleNodesById(@PathVariable("parentId") String parentId) {
        String [] info = parentId.split("@");
        String id = null;
        if(info.length>1)
            id = info[1];
        List<TreeNode> list = treeService.getSubModuleNodesById(info[0],id,true,true);
        String jsonString = JsonMapper.toJsonString(list);
        return jsonString;
    }
}
