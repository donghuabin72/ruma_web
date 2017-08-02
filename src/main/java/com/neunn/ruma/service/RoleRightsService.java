package com.neunn.ruma.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neunn.ruma.dao.ModuleDao;
import com.neunn.ruma.dao.RoleRightsDao;
import com.neunn.ruma.entity.ModuleEntity;
import com.neunn.ruma.entity.RoleRightsEntity;

/**
 * <p>
 * Class : com.neunn.system.rights.service.RoleRightsService
 * <p>
 * Descdription: 角色权限信息处理服务实现类
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
public class RoleRightsService {

    /**
     * 角色权限信息访问对象
     */
    @Autowired
    private RoleRightsDao roleRightsDao = null;
    
    @Autowired
    private ModuleDao moduleInfoDao = null;

    /**
     * 根据角色ID查询角色权限信息
     * 
     * @param roleId 角色ID
     * @return 角色权限信息列表
     */
    public List<RoleRightsEntity> getRoleRightsByRoleId(String roleId) {
        return roleRightsDao.selectByRoleId(roleId);
    }
    
    /**
     * 插入角色权限信息
     * 
     * @param roleRightsInfo 角色权限信息
     * @return 处理结果
     */
    public int insertRoleRights(RoleRightsEntity roleRightsInfo) {
        return roleRightsDao.insertSelective(roleRightsInfo);
    }

    /**
     * 删除角色权限信息
     * 
     * @param roleRightsInfo 角色权限信息
     * @return 删除结果
     */
    public int deleteRoleRights(RoleRightsEntity roleRightsInfo) {
        return roleRightsDao.delete(roleRightsInfo);
    }
    
    /**
     * 删除角色权限信息
     * 
     * @param moduleId 模块ID
     * @return 删除结果
     */
    public int deleteRoleRightsByModuleId(String moduleId) {
        return roleRightsDao.deleteByModuleId(moduleId);
    }
    
    public List<ModuleEntity> filter(String roleId){
    	List<RoleRightsEntity> list = roleRightsDao.selectByRoleId(roleId);
    	Map<String, List<ModuleEntity>> map = new HashMap<String, List<ModuleEntity>>();
    	List<ModuleEntity> temp = null;
    	for(RoleRightsEntity rinfo : list){
    		String mId = rinfo.getModuleId();
    		ModuleEntity minfo = moduleInfoDao.selectByPrimaryKey(mId);
    		String pId = minfo.getParentId();
    		if(map.get(pId)==null){
    			temp = new ArrayList<ModuleEntity>();
    			temp.add(minfo);
    			map.put(pId, temp);
    		}else{
    			map.get(pId).add(minfo);
    		}
    	}
    	
       List<ModuleEntity> result = new ArrayList<ModuleEntity>();
	   for (Map.Entry<String, List<ModuleEntity>> entry : map.entrySet()) {
		    String key = entry.getKey().toString();
		    List<ModuleEntity> value = entry.getValue();
		    getChildren(key,value,result);
		   }
    	return result;
    }
    
    public void getChildren(String pId,List<ModuleEntity> value,List<ModuleEntity> result){
        Map<String, Object> map  = new HashMap<String, Object>();
        map.put("parentId", pId);
        map.put("ismodules", false);
	    if(moduleInfoDao.selectByParentId(map).size()==value.size()){
	    	result.addAll(value);
	    	ModuleEntity tempModule = moduleInfoDao.selectByPrimaryKey(pId);
	    	result.add(tempModule);
	    	getChildren(tempModule.getParentId(),moduleInfoDao.selectByParentId(map),result);
	    }
    }

}
