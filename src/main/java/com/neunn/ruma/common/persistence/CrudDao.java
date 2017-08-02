/**
 * @项目名称: ruma-web
 * @文件名称: CrudDao.java
 * @Date: 2016年2月25日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.persistence;

import java.util.List;


/**
 * DAO共通基础类实现
 * 
 * @author Frank
 * @date 2016年2月25日
 * @since 1.0
 */
public interface CrudDao<T>  extends BaseDao  {


    /**
     * 获取单条数据
     * 
     * @param id
     * @return
     */
    public T findOne(String id);

    /**
     * 获取单条数据
     * 
     * @param entity
     * @return
     */
    public T findOne(T entity);


    /**
     * 查询所有数据列表
     * 
     * @param entity
     * @return
     */
    public List<T> findAll(T entity);


    /**
     * 插入数据
     * 
     * @param entity
     * @return
     */
    public int insert(T entity);

    /**
     * 更新数据
     * 
     * @param entity
     * @return
     */
    public int update(T entity);


    /**
     * 删除数据（一般为逻辑删除，更新del_flag字段为1）
     * 
     * @param entity
     * @return
     */
    public int delete(T entity);


}
