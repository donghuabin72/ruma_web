/**
 * @项目名称: ruma-web
 * @文件名称: CrudService.java
 * @Date: 2016年2月29日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.neunn.ruma.common.persistence.CrudDao;

/**
 * Service基类
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月29日
 * @param <T>
 * @param <D>
 * @since 1.0
 */
@Transactional(readOnly = true)
public abstract class CrudService<D extends CrudDao<T>, T> extends BaseService {

    /**
     * 持久层对象
     */
    @Autowired
    protected D dao;

    /**
     * 获取单条数据
     * 
     * @param id
     * @return
     */
    public T get(String id) {
        return dao.findOne(id);
    }

    /**
     * 获取单条数据
     * 
     * @param entity
     * @return
     */
    public T get(T entity) {
        return dao.findOne(entity);
    }

    /**
     * 查询列表数据
     * 
     * @param entity
     * @return
     */
    public List<T> findList(T entity) {
        return dao.findAll(entity);
    }

    /**
     * 更新数据
     * 
     * @param entity
     */
    @Transactional(readOnly = false)
    public void update(T entity) {
        dao.update(entity);
    }

    /**
     * 插入数据
     * 
     * @param entity
     */
    @Transactional(readOnly = false)
    public void insert(T entity) {
        dao.insert(entity);
    }


    /**
     * 删除数据
     * 
     * @param entity
     */
    @Transactional(readOnly = false)
    public void delete(T entity) {
        dao.delete(entity);
    }

}
