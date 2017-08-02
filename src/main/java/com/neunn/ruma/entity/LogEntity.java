/**
 * @项目名称: ruma-web
 * @文件名称: LogEntity.java
 * @Date: 2016年3月3日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.entity;

import java.util.Date;
import java.util.Map;

import com.neunn.ruma.common.persistence.DataEntity;
import com.neunn.ruma.utils.StringUtils;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月3日
 * @since 1.0
 */ 
public class LogEntity  extends DataEntity<LogEntity>{
    private static final long serialVersionUID = 1L;

    private String type; // 日志类型（1：接入日志；2：错误日志）

    private String title; // 日志标题

    private String remoteAddr; // 操作用户的IP地址

    private String requestUri; // 操作的URI

    private String method; // 操作的方式

    private String params; // 操作提交的数据

    private String userAgent; // 操作用户代理信息

    private String exception; // 异常信息

    private Date beginDate; // 开始日期

    private Date endDate; // 结束日期

    // 日志类型（1：接入日志；2：错误日志）
    public static final String TYPE_ACCESS = "1";

    public static final String TYPE_EXCEPTION = "2";

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRemoteAddr() {
        return remoteAddr;
    }

    public void setRemoteAddr(String remoteAddr) {
        this.remoteAddr = remoteAddr;
    }

    public String getRequestUri() {
        return requestUri;
    }

    public void setRequestUri(String requestUri) {
        this.requestUri = requestUri;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getParams() {
        return params;
    }
    

    /**
     * 设置请求参数
     * 
     * @param paramMap
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public void setParams(Map paramMap) {
        if (paramMap == null) {
            return;
        }
        StringBuilder params = new StringBuilder();
        for (Map.Entry<String, String[]> param : ((Map<String, String[]>) paramMap).entrySet()) {
            params.append(("".equals(params.toString()) ? "" : "&") + param.getKey() + "=");
            String paramValue = (param.getValue() != null && param.getValue().length > 0
                    ? param.getValue()[0] : "");
            params.append(StringUtils.abbr(
                    StringUtils.endsWithIgnoreCase(param.getKey(), "password") ? "" : paramValue,
                    100));
        }
        this.params = params.toString();
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getException() {
        return exception;
    }

    public void setException(String exception) {
        this.exception = exception;
    }

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }



}
