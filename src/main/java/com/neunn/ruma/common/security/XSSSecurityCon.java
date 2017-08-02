/**
 * @项目名称: ruma-web
 * @文件名称: XSSSecurityConf.java
 * @Date: 2016年3月3日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.security;

/**
 * FIXME 此处填写类的描述信息
 * 
 * @author Frank
 * @date 2016年3月3日
 * @since 1.0
 */
public class XSSSecurityCon {
    /**
     * 配置文件标签 isCheckHeader
     */
    public static String IS_CHECK_HEADER = "isCheckHeader";

    /**
     * 配置文件标签 isCheckParameter
     */
    public static String IS_CHECK_PARAMETER = "isCheckParameter";

    /**
     * 配置文件标签 isLog
     */
    public static String IS_LOG = "isLog";

    /**
     * 配置文件标签 isChain
     */
    public static String IS_CHAIN = "isChain";

    /**
     * 配置文件标签 replace
     */
    public static String REPLACE = "replace";

    /**
     * 配置文件标签 regexList
     */
    public static String REGEX_LIST = "regexList";

    /**
     * 替换非法字符的字符串
     */
    public static String REPLACEMENT = "";

    /**
     * FILTER_ERROR_PAGE:过滤后错误页面
     */
    public static String FILTER_ERROR_PAGE = "/common/filtererror.jsp";
}
