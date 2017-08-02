package com.neunn.ruma.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neunn.ruma.dao.ModuleDao;
import com.neunn.ruma.entity.ModuleEntity;
import com.neunn.ruma.entity.TreeNode;
import com.neunn.ruma.utils.UserUtils;

/**
 * <p>
 * Class : com.neunn.tree.service.TreeService
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
@Service
public class TreeService {


    /**
     * 系统权限信息访问对象
     */
    @Autowired
    private ModuleDao moduleDao = null;

    /**
     * 获得组织机构的树形机构
     * 
     * @param parentId 父节点ID
     * @return 组织机构树形结构
     */
//    public List<TreeNode> getSubOrgNodesById(String parentId,String id) {
//        List<TreeNode> result = new ArrayList<TreeNode>();
//        List<OrgInfo> childerOrgs = null;
//        List<OrgInfo> list = new ArrayList<OrgInfo>();
//        if(id != null){
//            queryOrgChildrenByPrimaryKey(id,list);
//            list.add(orgDao.selectByPrimaryKey(id));
//        }
//        if ("null".equals(parentId)) {
//            childerOrgs = orgDao.selectByParentId(null);
//        } else {
//            childerOrgs = orgDao.selectByParentId(parentId);
//        }
//        childerOrgs.removeAll(list);
//        for (OrgInfo temp : childerOrgs) {
//            TreeNode childNode = new TreeNode();
//            childNode.setId(temp.getId());
//            childNode.setText(temp.getName());
//            List<OrgInfo> tempOrgInfos = orgDao.selectByParentId(temp.getId());
//            tempOrgInfos.removeAll(list);
//            if (tempOrgInfos.size() > 0) {
//                childNode.setChildren(true);
//            } else {
//                childNode.setChildren(false);
//            }
//            result.add(childNode);
//        }
//        return result;
//    }

    /**
     * 获得系统权限的树形机构
     * 
     * @param parentId 父节点ID
     * @param ismodules 是否只获取菜单 true 是，false 不是
     * @param isrole 是否增加角色权限过滤 true 是 ， false 不是
     * @return 系统权限树形结构
     */
    public List<TreeNode> getSubModuleNodesById(String parentId,String id,boolean ismodules,boolean isrole) {
        List<TreeNode> result = new ArrayList<TreeNode>();
        List<ModuleEntity> childerModules = null;
        List<ModuleEntity> list = new ArrayList<ModuleEntity>();
        if(id != null){
            queryModuleChildrenByPrimaryKey(id,list);
            list.add(moduleDao.selectByPrimaryKey(id));	
        }
        Map<String, Object> map  = new HashMap<String, Object>();
        map.put("userid", UserUtils.getUser().getUsername());
        if ("null".equals(parentId)) {
            map.put("parentId", null);
            map.put("ismodules", ismodules);
            map.put("isrole", isrole);
            childerModules = moduleDao.selectByParentId(map);
        } else {
            map.put("parentId", parentId);
            map.put("ismodules", ismodules);
            map.put("isrole", isrole);
    		childerModules = moduleDao.selectByParentId(map);
        }
        childerModules.removeAll(list);
        for (ModuleEntity temp : childerModules) {
            map.put("parentId", temp.getId());
            map.put("ismodules", ismodules);
            map.put("isrole", isrole);
            TreeNode childNode = new TreeNode();
            childNode.setId(temp.getId());
            childNode.setText(temp.getName());
            List<ModuleEntity> tempModuleEntitys = moduleDao.selectByParentId(map);
            tempModuleEntitys.removeAll(list);
            if (tempModuleEntitys.size() > 0) {
                childNode.setChildren(true);
            } else {
                childNode.setChildren(false);
                childNode.setA_attr(temp.getRequestUrl());
            }
            result.add(childNode);
        }
        return result;
    }
    
    public void queryModuleChildrenByPrimaryKey(String id,List<ModuleEntity> mlist){
        Map<String, Object> map  = new HashMap<String, Object>();
        map.put("parentId", id);
        map.put("ismodules", false);
        List<ModuleEntity> list = moduleDao.selectByParentId(map);
    	for(ModuleEntity temp : list){
    		mlist.add(temp);
    		queryModuleChildrenByPrimaryKey(temp.getId(),mlist);
    	}
    }
    
//    public void queryOrgChildrenByPrimaryKey(String id,List<OrgInfo> mlist){
//    	List<OrgInfo> list = orgDao.selectByParentId(id);
//    	for(OrgInfo temp : list){
//    		mlist.add(temp);
//    		queryOrgChildrenByPrimaryKey(temp.getId(),mlist);
//    	}
//    }

}
