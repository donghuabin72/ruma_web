/**
 *@项目名称: ruma-web
 *@文件名称: PermissionController.java
 *@Date: 2016年2月24日
 *@Copyright: 2016-2016 www.neunn.com  All rights reserved.
 *注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年2月24日 
 * @since 1.0
 */
public class PermissionController {
    
    @RequiresPermissions("user[admin:]")
    public String test(){
        return null;
    }
}
