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
public class RoleCondition<T> extends PageCondition<T> implements Serializable {
    /** 
     * FIXME 删除本行替换为字段描述 
     * @author Frank
     * @date 2016年3月11日 
     */
    private static final long serialVersionUID = 6271981839283690189L;

    private String id;

    private String name;

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
