/**
 * 
 * @项目名称: ruma-web
 * @文件名称: UserServiceImpl.java
 * @Date: 2016年2月24日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.service;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neunn.ruma.common.bean.Page;
import com.neunn.ruma.common.bean.PageData;
import com.neunn.ruma.common.service.BaseService;
import com.neunn.ruma.dao.RoleDao;
import com.neunn.ruma.entity.RoleEntity;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年2月24日
 * @since 1.0
 */
@Service
@Transactional(readOnly = false)
public class RoleService extends BaseService implements InitializingBean {



    /**
     * 角色信息访问对象
     */
    @Autowired
    private RoleDao roleDao = null;

    /**
     * 根据查询条件分页查询角色信息列表
     * 
     * @param condition 角色信息查询条件
     * @return 角色信息列表
     */
    public PageData getRoles(Page<?> condition) {
        List<RoleEntity> roleList = roleDao.selectByCondition(condition);
        PageData result = new PageData();
        result.setData(roleList);
        result.setRecordsFiltered(condition.getTotalRecord());
        result.setRecordsTotal(condition.getTotalRecord());
        return result;
    }

    /**
     * 根据角色ID查询角色信息
     * 
     * @param roleId 角色ID
     * @return 角色信息
     */
    public RoleEntity getRoleById(String roleId) {
        return roleDao.selectByPrimaryKey(roleId);
    }

    /**
     * 根据角色ID查询角色信息
     * 
     * @param roleId 角色ID
     * @return 角色信息
     */
    public List<RoleEntity> getRoleByName(String roleName) {
        return roleDao.getRoleByName(roleName);
    }

    /**
     * 根据用户ID查询系统角色信息
     * 
     * @param userId 用户ID
     * @return 角色信息列表
     */
    public List<RoleEntity> getRolesByUserId(String userId) {
        return roleDao.selectByUserId(userId);
    }

    /**
     * 插入角色信息
     * 
     * @param RoleEntity 角色信息
     * @return 处理结果
     */
    @Transactional(readOnly = false)
    public int insertRole(RoleEntity RoleEntity) {
        return roleDao.insertSelective(RoleEntity);
    }

    /**
     * 根据角色ID删除角色信息
     * 
     * @param roleId 角色ID
     * @return 删除结果
     */
    @Transactional(readOnly = false)
    public int deleteRole(String roleId) {
        return roleDao.deleteByPrimaryKey(roleId);
    }

    /**
     * 根据角色ID更新角色信息
     * 
     * @param RoleEntity 角色信息
     * @return 更新结果
     */
    public int updateRole(RoleEntity RoleEntity) {
        return roleDao.updateByPrimaryKeySelective(RoleEntity);
    }

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年3月9日
     * @throws Exception
     * @since 1.0
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        // TODO Auto-generated method stub

    }

}
