package com.neunn.ruma.dao;

import java.util.List;

import com.neunn.ruma.common.persistence.annotation.MybatisDao;
import com.neunn.ruma.entity.RoleRightsEntity;

@MybatisDao
public interface RoleRightsDao {
    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * role_rights_info
     *
     * @mbggenerated Wed May 27 11:14:57 CST 2015
     */
    int deleteByPrimaryKey(String id);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * role_rights_info
     *
     * @mbggenerated Wed May 27 11:14:57 CST 2015
     */
    int insert(RoleRightsEntity record);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * role_rights_info
     *
     * @mbggenerated Wed May 27 11:14:57 CST 2015
     */
    int insertSelective(RoleRightsEntity record);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * role_rights_info
     *
     * @mbggenerated Wed May 27 11:14:57 CST 2015
     */
    RoleRightsEntity selectByPrimaryKey(String id);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * role_rights_info
     *
     * @mbggenerated Wed May 27 11:14:57 CST 2015
     */
    int updateByPrimaryKeySelective(RoleRightsEntity record);

    /**
     * This method was generated by MyBatis Generator. This method corresponds to the database table
     * role_rights_info
     *
     * @mbggenerated Wed May 27 11:14:57 CST 2015
     */
    int updateByPrimaryKey(RoleRightsEntity record);

    List<RoleRightsEntity> selectByRoleId(String roleId);

    int delete(RoleRightsEntity record);

    int deleteByModuleId(String moduleId);
}
