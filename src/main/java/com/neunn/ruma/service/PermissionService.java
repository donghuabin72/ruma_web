/**
 * @项目名称: ruma-web
 * @文件名称: UserServiceImpl.java
 * @Date: 2016年2月24日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.service;

import org.apache.shiro.authz.Permission;
import org.springframework.beans.factory.InitializingBean;

import com.neunn.ruma.common.service.BaseService;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年2月24日
 * @since 1.0
 */
public class PermissionService extends BaseService implements InitializingBean {

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年2月24日
     * @param permission
     * @return
     * @since 1.0
     */
    public Permission createPermission(Permission permission) {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年2月24日
     * @param permissionId
     * @since 1.0
     */
    public void deletePermission(Long permissionId) {
        // TODO Auto-generated method stub

    }

    /**
     * FIXME 删除本行替换为方法的描述信息
     * 
     * @author Frank
     * @date 2016年3月4日 
     * @throws Exception
     * @since 1.0
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        // TODO Auto-generated method stub
        
    }

}
