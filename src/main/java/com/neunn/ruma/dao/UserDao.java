/**
 * @项目名称: ruma-web
 * @文件名称: UserHandler.java
 * @Date: 2016年2月17日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.dao;

import java.util.List;
import java.util.Set;

import com.neunn.ruma.common.bean.Page;
import com.neunn.ruma.common.persistence.CrudDao;
import com.neunn.ruma.common.persistence.annotation.MybatisDao;
import com.neunn.ruma.entity.UserEntity;

/**
 * 用户管理Dao
 * 
 * @author Frank
 * @date 2016年2月17日
 * @since 1.0
 */
@MybatisDao
public interface UserDao extends CrudDao<UserEntity> {

    /**
     * 冻结账户
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年3月7日
     * @param user
     * @return
     * @since 1.0
     */
    int lockUser(UserEntity user);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * user_info
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    int deleteByPrimaryKey(String id);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * user_info
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    int insert(UserEntity record);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * user_info
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    int insertSelective(UserEntity record);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * user_info
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    UserEntity selectByPrimaryKey(String id);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * user_info
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    int updateByPrimaryKeySelective(UserEntity record);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * user_info
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    int updateByPrimaryKey(UserEntity record);

    List<UserEntity> selectByCondition(Page<?> condition);
    
    Set<String> selectUserRoles(String userId);
    Set<String> selectUserPermissions(String userId);

    int deleteByOrgId(String orgId);

}