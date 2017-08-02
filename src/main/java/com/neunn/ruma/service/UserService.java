/**
 * @项目名称: ruma-web
 * @文件名称: UserService.java
 * @Date: 2016年2月29日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neunn.ruma.common.bean.Page;
import com.neunn.ruma.common.bean.PageData;
import com.neunn.ruma.common.service.BaseService;
import com.neunn.ruma.dao.UserDao;
import com.neunn.ruma.dao.UserRoleDao;
import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.entity.UserRoleEntity;

/**
 * 用户管理Service
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月29日
 * @since 1.0
 */
@Service
public class UserService extends BaseService implements InitializingBean {

    @Autowired
    public UserDao userDao;

    @Autowired
    public UserRoleDao userRoleDao;

    @Override
    public void afterPropertiesSet() throws Exception {

    }

    public List<UserEntity> findAllUser(UserEntity user) {
        return userDao.findAll(user);
    }

    public UserEntity findUser(UserEntity user) {
        return userDao.findOne(user);
    }

    public PageData getUsers(Page<?> condition) {
        List<UserEntity> userList = userDao.selectByCondition(condition);
        for (UserEntity userInfo : userList) {
            List<UserRoleEntity> userRoleInfos = userRoleDao.selectByUserId(userInfo.getUsername());
            String userRoleNames = "";
            for (int i = 0; i < userRoleInfos.size(); i++) {
                if (i == userRoleInfos.size() - 1) {
                    userRoleNames = userRoleNames + userRoleInfos.get(i).getRoleName();
                } else {
                    userRoleNames = userRoleNames + userRoleInfos.get(i).getRoleName() + ",";
                }
            }
            userInfo.setRoleName(userRoleNames);
        }
        PageData result = new PageData();
        result.setData(userList);
        result.setRecordsFiltered(condition.getTotalRecord());
        result.setRecordsTotal(condition.getTotalRecord());
        return result;
    }

    /**
     * 根据用户ID查询用户信息
     * 
     * @param userId 用户ID
     * @return 用户信息
     */
    public UserEntity getUserById(String userId) {
        return userDao.selectByPrimaryKey(userId);
    }

    /**
     * 插入用户信息
     * 
     * @param userInfo 用户信息
     * @return 处理结果
     */
    @Transactional(readOnly = false)
    public int insertUser(UserEntity userInfo) {
        return userDao.insertSelective(userInfo);
    }

    /**
     * 根据用户ID删除用户信息
     * 
     * @param userId 用户ID
     * @return 删除结果
     */
    @Transactional(readOnly = false)
    public int deleteUser(String userId) {
        return userDao.deleteByPrimaryKey(userId);
    }

    /**
     * 根据用户ID更新用户信息
     * 
     * @param userInfo 用户信息
     * @return 更新结果
     */
    @Transactional(readOnly = false)
    public int updateUser(UserEntity userInfo) {
        return userDao.updateByPrimaryKeySelective(userInfo);
    }

    /**
     * 根据部门ID删除用户信息
     * 
     * @param orgId 部门ID
     * @return 删除结果
     */
    public int deleteUserByOrgId(String orgId) {
        return userDao.deleteByOrgId(orgId);
    }


    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年2月24日
     * @param username
     * @return
     * @since 1.0
     */
    public UserEntity findByUsername(String username) {
        return userDao.findOne(username);
    }

    /**
     * 查询该用户的所有角色
     * 
     * @author Frank
     * @date 2016年2月24日
     * @param username
     * @return
     * @since 1.0
     */
    public Set<String> findRoles(String username) {
        return userDao.selectUserRoles(username);
    }

    /**
     * 查询该用户的所有权限
     * 
     * @author Frank
     * @date 2016年2月24日
     * @param username
     * @return
     * @since 1.0
     */
    public Set<String> findPermissions(String username) {
        return userDao.selectUserPermissions(username);
    }

    /**
     * 冻结账户
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年3月7日
     * @param user
     * @since 1.0
     */
    @Transactional(readOnly = false)
    public int lockUser(UserEntity user) {
        return userDao.lockUser(user);
    }
}
