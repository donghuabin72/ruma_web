/**
 * @项目名称: ruma-web
 * @文件名称: UserUtils.java
 * @Date: 2016年3月3日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.UnavailableSecurityManagerException;
import org.apache.shiro.session.InvalidSessionException;
import org.apache.shiro.subject.Subject;

import com.neunn.ruma.common.config.Global;
import com.neunn.ruma.dao.UserDao;
import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.utils.cache.CacheUtils;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月3日
 * @since 1.0
 */
public class UserUtils {
    private static UserDao userDao = SpringContextHolder.getBean(UserDao.class);

    /**
     * 获取当前用户
     * 
     * @return 取不到返回 new User()
     */
    public static UserEntity getUser() {
        String principal = getPrincipal();
        if (principal != null) {
            UserEntity user = get(principal);
            if (user != null) {
                return user;
            }
            return new UserEntity();
        }
        // 如果没有登录，则返回实例化空的User对象。
        return new UserEntity();
    }

    /**
     * 根据ID获取用户
     * 
     * @param id
     * @return 取不到返回null
     */
    public static UserEntity get(String username) {
        UserEntity user = CacheUtils.getInstance().getObject(Global.USER_CACHE + username, UserEntity.class);
        if (user == null) {
            user = userDao.findOne(username);
            if (user == null) {
                return null;
            }
            CacheUtils.getInstance().setObject(Global.USER_CACHE + user.getUsername(), user, 0);
        }
        return user;
    }

    /**
     * 获取当前登录者对象
     */
    public static String getPrincipal() {
        try {
            Subject subject = SecurityUtils.getSubject();
            String principal = (String) subject.getPrincipal();
            if (principal != null) {
                return principal;
            }
            //          subject.logout();
        } catch (UnavailableSecurityManagerException e) {

        } catch (InvalidSessionException e) {

        }
        return null;
    }
    
    public static Object getCache(String key, Object defaultValue) {
        
        return null;
    }
}
