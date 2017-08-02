/**
 * @项目名称: ruma-web
 * @文件名称: BeanValidators.java
 * @Date: 2016年2月29日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.validator;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * JSR303 Validator(Hibernate Validator)工具类.
 * 
 * ConstraintViolation中包含propertyPath, message 和invalidValue等信息. 提供了各种convert方法，适合不同的i18n需求: 1.
 * List<String>, String内容为message 2. List<String>, String内容为propertyPath + separator + message 3.
 * Map<propertyPath, message>
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月29日
 * @since 1.0
 */
public class BeanValidators {

    /**
     * 调用JSR303的validate方法, 验证失败时抛出ConstraintViolationException.
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public static void validateWithException(Validator validator, Object object, Class<?>... groups)
            throws ConstraintViolationException {
        Set constraintViolations = validator.validate(object, groups);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(constraintViolations);
        }
    }

    /**
     * 辅助方法, 转换ConstraintViolationException中的Set<ConstraintViolations>中为List<message>.
     */
    public static List<String> extractMessage(ConstraintViolationException e) {
        return extractMessage(e.getConstraintViolations());
    }

    /**
     * 辅助方法, 转换Set<ConstraintViolation>为List<message>
     */
    @SuppressWarnings("rawtypes")
    public static List<String> extractMessage(Set<? extends ConstraintViolation> constraintViolations) {
        List<String> errorMessages = Lists.newArrayList();
        for (ConstraintViolation violation : constraintViolations) {
            errorMessages.add(violation.getMessage());
        }
        return errorMessages;
    }

    /**
     * 辅助方法, 转换ConstraintViolationException中的Set<ConstraintViolations>为Map<property, message>.
     */
    public static Map<String, String> extractPropertyAndMessage(ConstraintViolationException e) {
        return extractPropertyAndMessage(e.getConstraintViolations());
    }

    /**
     * 辅助方法, 转换Set<ConstraintViolation>为Map<property, message>.
     */
    @SuppressWarnings("rawtypes")
    public static Map<String, String> extractPropertyAndMessage(Set<? extends ConstraintViolation> constraintViolations) {
        Map<String, String> errorMessages = Maps.newHashMap();
        for (ConstraintViolation violation : constraintViolations) {
            errorMessages.put(violation.getPropertyPath().toString(), violation.getMessage());
        }
        return errorMessages;
    }

    /**
     * 辅助方法, 转换ConstraintViolationException中的Set<ConstraintViolations>为List<propertyPath message>.
     */
    public static List<String> extractPropertyAndMessageAsList(ConstraintViolationException e) {
        return extractPropertyAndMessageAsList(e.getConstraintViolations(), " ");
    }

    /**
     * 辅助方法, 转换Set<ConstraintViolations>为List<propertyPath message>.
     */
    @SuppressWarnings("rawtypes")
    public static List<String> extractPropertyAndMessageAsList(Set<? extends ConstraintViolation> constraintViolations) {
        return extractPropertyAndMessageAsList(constraintViolations, " ");
    }

    /**
     * 辅助方法, 转换ConstraintViolationException中的Set<ConstraintViolations>为List<propertyPath +separator+
     * message>.
     */
    public static List<String> extractPropertyAndMessageAsList(ConstraintViolationException e, String separator) {
        return extractPropertyAndMessageAsList(e.getConstraintViolations(), separator);
    }

    /**
     * 辅助方法, 转换Set<ConstraintViolation>为List<propertyPath +separator+ message>.
     */
    @SuppressWarnings("rawtypes")
    public static List<String> extractPropertyAndMessageAsList(Set<? extends ConstraintViolation> constraintViolations,
            String separator) {
        List<String> errorMessages = Lists.newArrayList();
        for (ConstraintViolation violation : constraintViolations) {
            errorMessages.add(violation.getPropertyPath() + separator + violation.getMessage());
        }
        return errorMessages;
    }
}
