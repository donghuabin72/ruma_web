package com.neunn.ruma.entity;

import java.io.Serializable;

import com.neunn.ruma.common.bean.PageCondition;

/**
 * <p>
 * Class : com.neunn.system.user.bean.UserInfoCondition
 * <p>
 * Descdription: 用户信息查询条件保存实现类
 *
 * @author 赵广志-zhaogz@neunn.com
 * @version 1.0.0
 *          <p>
 *          --------------------------------------------------------------<br>
 *          修改履历：<br>
 *          <li>2015年5月27日，zhaogz@neunn.com，创建文件；<br>
 *          --------------------------------------------------------------<br>
 *          </p>
 */
public class UserCondition<T> extends PageCondition<T> implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8220392011352850401L;

    private String id;

    private String name;

    private String orgId;

    private String email;

    private String tel;

    private String creatUser;

    private String modifyUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getCreatUser() {
        return creatUser;
    }

    public void setCreatUser(String creatUser) {
        this.creatUser = creatUser;
    }

    public String getModifyUser() {
        return modifyUser;
    }

    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

}
