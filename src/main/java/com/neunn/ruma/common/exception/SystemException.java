package com.neunn.ruma.common.exception;

/**
 * 
 * 系统异常
 * 
 * @author Frank
 * @date 2016年3月15日
 * @since 1.0
 */
public class SystemException extends Exception {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -817044718040544536L;

    private static final String SYSTEM_MESSAGE_KEY = "system.info.error";

    /**
     * 消息键值
     */
    private String messageKey = SYSTEM_MESSAGE_KEY;

    /**
     * 消息参数
     */
    private Object[] param;

    /**
     * 构造函数
     */
    public SystemException() {
        super();
    }

    /**
     * 根据消息键值构造类实例
     * 
     * @param messageKey 消息键值
     */
    public SystemException(final String messageKey) {
        this.messageKey = messageKey;
    }

    /**
     * 根据消息键值和参数构造类实例
     * 
     * @param messageKey 消息键值
     * @param param 消息参数
     */
    public SystemException(final String messageKey, final Object[] param) {
        this.messageKey = messageKey;
        this.param = param;
    }

    /**
     * 获得消息键值
     * 
     * @return 消息键值
     */
    public String getMessageKey() {
        return this.messageKey;
    }

    /**
     * 获得消息参数
     * 
     * @return 消息参数
     */
    public Object[] getParam() {
        return this.param;
    }
}
