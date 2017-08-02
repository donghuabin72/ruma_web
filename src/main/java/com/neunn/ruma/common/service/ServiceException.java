/**
 * @项目名称: ruma-web
 * @文件名称: ServiceException.java
 * @Date: 2016年2月29日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.service;

/**
 * Service层公用的Exception, 从由Spring管理事务的函数中抛出时会触发事务回滚
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月29日
 * @since 1.0
 */
public class ServiceException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ServiceException() {
        super();
    }

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(Throwable cause) {
        super(cause);
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
