/**
 * @项目名称: ruma-web
 * @文件名称: MyRealm.java
 * @Date: 2016年2月23日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.realm;

import java.util.Set;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.service.UserService;

/**
 * shiro鉴权授权
 * 
 * @author Frank
 * @date 2016年2月23日
 * @since 1.0
 */
@Transactional
public class MyRealm extends AuthorizingRealm {

    @Autowired
    private UserService userService;


    /**
     * 获取授权信息
     * 
     * @author Frank
     * @date 2016年2月23日
     * @param principals
     * @return
     * @since 1.0
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String username = (String) principals.fromRealm(getName()).iterator().next();
        UserEntity user = userService.findByUsername(username);
        if (user != null) {
            //权限信息，包含用户角色和权限
            SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
            Set<String> roles = userService.findRoles(username);
            info.setRoles(roles);
            Set<String> permissions = userService.findPermissions(username);
            info.addStringPermissions(permissions);
            return info;
        }
        return null;
    }

    /**
     * 登录鉴权
     * 
     * @author Frank
     * @date 2016年2月23日
     * @param token
     * @return
     * @throws AuthenticationException
     * @since 1.0
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken)
            throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        UserEntity user = userService.findByUsername(token.getUsername());
        if (user != null) {
            // 交给AuthenticatingRealm使用CredentialsMatcher进行密码匹配，如果觉得人家的不好可以在此判断或自定义实现
            return new SimpleAuthenticationInfo(user.getUsername(), user.getPasswd(), getName());
        }
        return null;
    }



}
