package com.neunn.ruma.entity;

import java.io.Serializable;

import com.neunn.ruma.common.bean.PageCondition;

/**
 * <p>
 * Class : com.neunn.system.rights.bean.ModuleInfoCondition
 * <p>
 * Descdription: 模块信息查询条件保存实现类
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
public class ModuleCondition<T> extends PageCondition<T> implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3022252947308893810L;

    private String id;

    private String name;

    private String parentId;
    
    private String requestUrl;
    
    private String requestMethod;

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

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public String getRequestMethod() {
        return requestMethod;
    }

    public void setRequestMethod(String requestMethod) {
        this.requestMethod = requestMethod;
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