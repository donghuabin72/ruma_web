/**
 * @项目名称: ruma-web
 * @文件名称: MenuHandler.java
 * @Date: 2016年2月17日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.dao;

import com.neunn.ruma.common.persistence.annotation.MybatisDao;
import com.neunn.ruma.entity.LogEntity;

/**
 * 日志管理的数据库访问接口申请
 * 
 * @author Frank
 * @date 2016年2月17日
 * @since 1.0
 */
@MybatisDao
public interface LoggingDao {
    /**
     * 
     * 记录系统访问日志
     * 
     * @author Frank
     * @date 2016年3月3日
     * @return
     * @since 1.0
     */
    public int saveLog(LogEntity log);
}
