/**
 * Copyright ® 2015 东软集团 政府事业部 版权所有。
 */

package com.neunn.ruma.entity;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * Class : com.neunn.tree.bean.TreeNode
 * <p>
 * Descdription: 类功能描述
 * 
 * @author 赵广志-zhaogz@neunn.com
 * @version 1.0.0
 *          <p>
 *          --------------------------------------------------------------<br>
 *          修改履历：<br>
 *          <li>2015年6月4日，zhaogz@neunn.com，创建文件；<br>
 *          --------------------------------------------------------------<br>
 *          </p>
 */
public class TreeNode {

    private String id = null;

    private String icon = null;

    private String data = null;

    private Map<String, String> state = new HashMap<String, String>();

    private String type = "default";

    private String text = null;

    private String li_attr = null;

    private String a_attr = null;

    private boolean children = false;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Map<String, String> getState() {
        return state;
    }

    public void setState(Map<String, String> state) {
        this.state = state;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getLi_attr() {
        return li_attr;
    }

    public void setLi_attr(String li_attr) {
        this.li_attr = li_attr;
    }

    public String getA_attr() {
        return a_attr;
    }

    public void setA_attr(String a_attr) {
        this.a_attr = a_attr;
    }

    public boolean getChildren() {
        return children;
    }

    public void setChildren(boolean children) {
        this.children = children;
    }
}
