package com.neunn.ruma.common.exception;


/**
 * 
 * 运行时异常
 * 
 * @author Frank
 * @date 2016年3月15日
 * @since 1.0
 */
public class RTException extends RuntimeException {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1423899298749043216L;

    private static final String RUNTIME_MESSAGE_KEY = "runtime.info.error";

    /**
     * 消息键值
     */
    private String messageKey = RUNTIME_MESSAGE_KEY;


    /**
     * 消息参数
     */
    private String[] param;

    /**
     * 构造函数
     */
    public RTException() {
        super();
    }

    /**
     * 根据消息键值构造类实例
     * 
     * @param messageKey 消息键值
     */
    public RTException(final String messageKey) {
        this.messageKey = messageKey;
    }

    /**
     * 根据消息键值和参数构造类实例
     * 
     * @param messageKey 消息键值
     * @param param 消息参数
     */
    public RTException(final String messageKey, final String[] param) {
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
    public String[] getParam() {
        return this.param;
    }

}
