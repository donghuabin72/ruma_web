/**
 * @项目名称: ruma-web
 * @文件名称: UserRoleService.java
 * @Date: 2016年3月8日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neunn.ruma.dao.UserRoleDao;
import com.neunn.ruma.entity.UserRoleEntity;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月8日
 * @since 1.0
 */
@Service
public class UserRoleService {


    /**
     * 用户角色信息访问对象
     */
    @Autowired
    private UserRoleDao userRoleDao = null;

    /**
     * 根据用户ID查询用户角色信息
     * 
     * @param userId 用户ID
     * @return 用户角色信息列表
     */
    public List<UserRoleEntity> getUserRolesByUserId(String userId) {
        return userRoleDao.selectByUserId(userId);
    }

    /**
     * 根据角色ID查询用户角色信息
     * 
     * @param roleId 角色ID
     * @return 用户角色信息列表
     */
    public List<UserRoleEntity> getUserRolesByRoleId(String roleId) {
        return userRoleDao.selectByRoleId(roleId);
    }

    /**
     * 插入用户角色信息
     * 
     * @param UserRoleEntity 用户角色信息
     * @return 处理结果
     */
    @Transactional(readOnly=false)
    public int insertUserRole(UserRoleEntity UserRoleEntity) {
        return userRoleDao.insertSelective(UserRoleEntity);
    }

    /**
     * 删除用户角色信息
     * 
     * @param UserRoleEntity 用户角色信息
     * @return 删除结果
     */
    @Transactional(readOnly=false)
    public int deleteUserRole(UserRoleEntity UserRoleEntity) {
        return userRoleDao.delete(UserRoleEntity);
    }


}
