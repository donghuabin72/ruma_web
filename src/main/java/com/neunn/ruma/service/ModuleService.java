package com.neunn.ruma.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neunn.ruma.common.bean.Page;
import com.neunn.ruma.common.bean.PageData;
import com.neunn.ruma.dao.ModuleDao;
import com.neunn.ruma.entity.ModuleEntity;

/**
 * <p>
 * Class : com.neunn.system.rights.service.ModuleService
 * <p>
 * Descdription: 模块信息处理服务实现类
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
@Transactional(readOnly = false)
public class ModuleService {

    /**
     * 模块信息访问对象
     */
    @Autowired
    private ModuleDao moduleDao = null;

    /**
     * 根据查询条件分页查询模块信息列表
     * 
     * @param condition 模块信息查询条件
     * @return 模块信息列表
     */
    public PageData getModules(Page<?> condition) {
        List<ModuleEntity> roleList = moduleDao.selectByCondition(condition);
        PageData result = new PageData();
        result.setData(roleList);
        result.setRecordsFiltered(condition.getTotalRecord());
        result.setRecordsTotal(condition.getTotalRecord());
        return result;
    }

    /**
     * 根据模块ID查询模块信息
     * 
     * @param moduleId 模块ID
     * @return 模块信息
     */
    public ModuleEntity getModuleById(String moduleId) {
        return moduleDao.selectByPrimaryKey(moduleId);
    }

    /**
     * 根据角色ID查询系统可以分配的权限信息请求响应方法
     * 
     * @param roleId 角色ID
     * @return 权限信息列表
     */
    public List<ModuleEntity> getModulesByRoleId(String roleId) {
        return moduleDao.selectByRoleId(roleId);
    }

    /**
     * 根据模块ID查询子模块信息请求响应方法
     * 
     * @param parentId 模块ID
     * @return 子模块信息列表
     */
    public List<ModuleEntity> getModulesByParentId(String parentId) {
        Map<String, Object> map  = new HashMap<String, Object>();
        map.put("parentId", parentId);
        map.put("ismodules", false);
        return moduleDao.selectByParentId(map);
    }

    /**
     * 根据模块ID查询角色权限信息树结构
     * 
     * @param moduleId 模块ID
     * @return 角色权限信息树结构
     */
    public List<ModuleEntity> getRightsTreeByModuleId(String moduleId) {
        return moduleDao.selectRightsTreeByModuleId(moduleId);
    }

    /**
     * 插入模块信息
     * 
     * @param moduleInfo 模块信息
     * @return 处理结果
     */
    public int insertModule(ModuleEntity moduleInfo) {
        return moduleDao.insertSelective(moduleInfo);
    }

    /**
     * 根据模块ID删除模块信息
     * 
     * @param moduleId 模块ID
     * @return 删除结果
     */
    public int deleteModule(String moduleId) {
        return moduleDao.deleteByPrimaryKey(moduleId);
    }

    /**
     * 根据模块ID更新模块信息
     * 
     * @param moduleInfo 模块信息
     * @return 更新结果
     */
    public int updateModule(ModuleEntity moduleInfo) {
        return moduleDao.updateByPrimaryKeySelective(moduleInfo);
    }

    public void queryChildrenByPrimaryKey(String id, String parentId, List<ModuleEntity> mlist) {
        Map<String, Object> map  = new HashMap<String, Object>();
        map.put("parentId", id);
        map.put("ismodules", false);
        List<ModuleEntity> list = moduleDao.selectByParentId(map);
        for (ModuleEntity temp : list) {
            if (temp.getId().equals(parentId)) {
                mlist.add(temp);
                break;
            }
            queryChildrenByPrimaryKey(temp.getId(), parentId, mlist);
        }
    }

}
