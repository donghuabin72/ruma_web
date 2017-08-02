package com.neunn.ruma.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
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
import com.neunn.ruma.entity.ModuleCondition;
import com.neunn.ruma.entity.ModuleEntity;
import com.neunn.ruma.entity.RoleRightsEntity;
import com.neunn.ruma.entity.TreeNode;
import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.entity.UserRoleEntity;
import com.neunn.ruma.service.ModuleService;
import com.neunn.ruma.service.RoleRightsService;
import com.neunn.ruma.service.UserRoleService;
import com.neunn.ruma.utils.UserUtils;


/**
 * <p>
 * Class : com.neunn.system.rights.controller.ModuleController
 * <p>
 * Descdription: 模块信息处理请求响应实现类
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
@RequestMapping("/sys/module")
public class ModuleController extends BaseController {

    /**
     * 模块信息处理服务实现类
     */
    @Autowired
    private ModuleService moduleService = null;

    /**
     * 角色权限信息处理服务实现类
     */
    @Autowired
    private RoleRightsService roleRightsService = null;

    /**
     * 用户角色信息处理服务实现类
     */
    @Autowired
    private UserRoleService userRoleService = null;

    /**
     * 模块信息查询请求响应方法
     * 
     * @return 模块信息列表
     */
    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Object getModules() {
        ModuleCondition<ModuleEntity> page = new ModuleCondition<ModuleEntity>();
        if ("-1".equals(getRequest().getParameter("length"))) {
            page.setPageSize(10);
        } else {
            page.setPageSize(Integer.parseInt(getRequest().getParameter("length")));
        }
        page.setOffset(Integer.valueOf(getRequest().getParameter("start")));
        page.setSortColumn(getRequest().getParameter("columns[" + getRequest().getParameter("order[0][column]") + "][data]"));
        page.setSortOrder(getRequest().getParameter("order[0][dir]"));
        page.setSearchColumn("a.name");
        page.setSearchColumnType(Page.COLUMN_TYPE_STRING);
        try {
			page.setSearchValue("%" + new String(getRequest().getParameter("search[value]").getBytes("iso-8859-1"),"UTF-8")+ "%");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
        page.setSearchValueOp(" ilike ");
        PageData moduleInfos = moduleService.getModules(page);
        int draw = Integer.parseInt(getRequest().getParameter("draw") == null ? "0" : getRequest().getParameter("draw"));
        moduleInfos.setDraw(draw + 1);
        return moduleInfos;
    }

    /**
     * 根据模块ID查询模块信息请求响应方法
     * 
     * @param moduleId 模块ID
     * @return 模块信息
     */
    @RequestMapping(method = RequestMethod.GET, value = "{moduleId}")
    @ResponseBody
    public Object getModuleById(@PathVariable("moduleId") String moduleId) {
        ModuleEntity moduleInfo = moduleService.getModuleById(moduleId);
        return moduleInfo;
    }

    /**
     * 根据角色ID查询系统可以分配的权限信息请求响应方法
     * 
     * @param roleId 角色ID
     * @param moduleId 模块ID
     * @return 权限信息列表
     */
    @RequestMapping(method = RequestMethod.GET, value = "/role/{roleId}/{moduleId}")
    @ResponseBody
    public Object getSysModulesByRoleId(@PathVariable("roleId") String roleId, @PathVariable("moduleId") String moduleId) {
        // 获得角色的权限信息
        List<RoleRightsEntity> roleRightsInfos = roleRightsService.getRoleRightsByRoleId(roleId);
        // 获得当前模块的子模块信息
        List<ModuleEntity> sysRightsInfos = null;
        if ("null".equals(moduleId)) {
            sysRightsInfos = moduleService.getModulesByParentId(null);

        } else {
            sysRightsInfos = moduleService.getModulesByParentId(moduleId);
        }

        List<TreeNode> result = new ArrayList<TreeNode>();
        Boolean[] bresult = new Boolean[sysRightsInfos.size()];
        for(int i = 0;i<sysRightsInfos.size();i++){
        	bresult[i] = true; 
        	filterChildrenList(sysRightsInfos.get(i),roleRightsInfos,bresult,i);
        }

        for(int j = 0;j<bresult.length;j++){
        	if(!bresult[j]){
                TreeNode childNode = new TreeNode();
                childNode.setId(sysRightsInfos.get(j).getId());
                childNode.setText(sysRightsInfos.get(j).getName());
                List<ModuleEntity> tempOrgInfos = moduleService.getModulesByParentId(sysRightsInfos.get(j).getId());
                if (tempOrgInfos.size() > 0) {
                    childNode.setChildren(true);
                } else {
                    childNode.setChildren(false);
                }
                result.add(childNode);
        	}
        	
        }
        return result;
    }
    
    
    /**
     * 过滤是否已经选择的权限
     */
    public void filterChildrenList(ModuleEntity minfo , List<RoleRightsEntity> roleRightsInfos,Boolean[] bresult ,int i){
		if(beInList(minfo.getId(),roleRightsInfos)){
			List<ModuleEntity> tempOrgInfos = moduleService.getModulesByParentId(minfo.getId());
			if(tempOrgInfos.size()>0){
				for(ModuleEntity m : tempOrgInfos){
					filterChildrenList(m,roleRightsInfos,bresult,i);
				}
			}
		}else{
			bresult[i] = false;
		}
    }
    
    /**
     * 判断当前节点是否在右侧的树
     */
    public boolean beInList(String id ,List<RoleRightsEntity> roleRightsInfos){
    	for(RoleRightsEntity rinfo : roleRightsInfos){
    		if(id.equals(rinfo.getModuleId())){
    			return true;
    		}
    	}
    	return false;
    	
    }
    

    /**
     * 获得登录用户当前模块未授权的子模块ID
     * 
     * @param moduleId 当前模块ID
     * @return 子模块ID
     */
    @RequestMapping(method = RequestMethod.GET, value = "/unauth/{moduleId}")
    @ResponseBody
    public Object getUnauthModules(@PathVariable("moduleId") String moduleId) {
        UserEntity loginUserInfo = UserUtils.getUser();
        List<UserRoleEntity> userRoleInfos = userRoleService.getUserRolesByUserId(loginUserInfo.getUsername());
        List<ModuleEntity> userRightsTree = new ArrayList<ModuleEntity>();
        for (UserRoleEntity userRoleInfo : userRoleInfos) {
            // 获得角色的权限信息
            List<RoleRightsEntity> roleRightsInfos = roleRightsService.getRoleRightsByRoleId(userRoleInfo.getRoleId());
            for (RoleRightsEntity temp : roleRightsInfos) {
                List<ModuleEntity> moduleTree = moduleService.getRightsTreeByModuleId(temp.getModuleId());
                for (ModuleEntity moduleInfo : moduleTree) {
                    if (!userRightsTree.contains(moduleInfo)) {
                        userRightsTree.add(moduleInfo);
                    }
                }
            }
        }

        List<ModuleEntity> result = new ArrayList<ModuleEntity>();
        List<ModuleEntity> subModuleInfos = moduleService.getModulesByParentId(moduleId);
        for (ModuleEntity subModuleInfo : subModuleInfos) {
            boolean unAuthFlag = true;
            for (ModuleEntity userRightsNode : userRightsTree) {
                if (subModuleInfo.getId().equals(userRightsNode.getId())) {
                    unAuthFlag = false;
                    break;
                }
            }
            if (unAuthFlag) {
                result.add(subModuleInfo);
            }
        }
        return result;
    }

    /**
     * 模块信息创建请求响应方法
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public void createModule() {
        ModuleEntity moduleInfo = new ModuleEntity();
        moduleInfo.setId(getRequest().getParameter("moduleId"));
        String url = getRequest().getParameter("url");
        if (url != null && !url.equals("")) {
            moduleInfo.setRequestUrl(url);
        }
        String method = getRequest().getParameter("method");
        if (method != null && !method.equals("")) {
            moduleInfo.setRequestMethod(method);
        }
        moduleInfo.setName(getRequest().getParameter("name"));
        String parentId = getRequest().getParameter("parentId");
        if (parentId != null && !parentId.equals("")) {
            moduleInfo.setParentId(parentId);
        }
        String description = getRequest().getParameter("description");
        if (description != null && !description.equals("")) {
            moduleInfo.setDescription(description);
        }
        moduleService.insertModule(moduleInfo);
    }

    /**
     * 模块信息删除请求响应方法
     * 
     * @param moduleId 模块ID
     */
    @RequestMapping(method = RequestMethod.DELETE, value = "{moduleId}")
    @ResponseBody
    public void deleteModule(@PathVariable("moduleId") String moduleId) {
    	String[] ids = moduleId.split("@");
    	for(String id : ids){
    		if("".equals(id))
    			continue;
            moduleService.deleteModule(id);
            roleRightsService.deleteRoleRightsByModuleId(id);
    	}

    }
    @RequestMapping(method = RequestMethod.GET,value = "/validate/{parameter}")
    @ResponseBody
    public Object validate(@PathVariable("parameter") String parameter){
   	    Map<String,String>  json = new HashMap<String,String>();
    	String[] parameters =  parameter.split("@");
    	String id = parameters[0];
    	String parentId = null;
    	if(parameters.length>1)
    	 parentId = parameters[1];
    	
    	if(id.equals(parentId)){
    		json.put("flag", "-1");
    		return json;
    	}
    	List<ModuleEntity> list = new ArrayList<ModuleEntity>();
    	moduleService.queryChildrenByPrimaryKey(id,parentId,list);

    	if(list.size()>0)
    		json.put("flag", "1");
    	else
    		json.put("flag", "0");
    	return json;
    }

    /**
     * 模块信息更新请求响应方法
     */
    @RequestMapping(method = RequestMethod.PUT)
    @ResponseBody
    public void updateModule() {
        String paramString = "";
        Map<String, String> parameterMap = new HashMap<String, String>();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader((ServletInputStream) getRequest().getInputStream()));
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
        ModuleEntity moduleInfo = new ModuleEntity();
        moduleInfo.setId(parameterMap.get("moduleId"));
        moduleInfo.setRequestUrl(parameterMap.get("url"));
        moduleInfo.setRequestMethod(parameterMap.get("method"));
        moduleInfo.setName(parameterMap.get("name"));
        moduleInfo.setParentId(parameterMap.get("parentId"));
        moduleInfo.setDescription(parameterMap.get("description"));
        moduleService.updateModule(moduleInfo);
    }

}
