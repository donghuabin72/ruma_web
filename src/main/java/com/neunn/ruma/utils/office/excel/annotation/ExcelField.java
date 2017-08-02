/**
 * @项目名称: ruma-web
 * @文件名称: ExcelField.java
 * @Date: 2016年2月24日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils.office.excel.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Excel注解定义
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月24日
 * @since 1.0
 */
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelField {

    /**
     * 导出字段名（默认调用当前字段的“get”方法，如指定导出字段为对象，请填写“对象名.对象属性”，例：“area.name”、“office.name”）
     */
    String value() default "";

    /**
     * 导出字段标题（需要添加批注请用“**”分隔，标题**批注，仅对导出模板有效）
     */
    String title();

    /**
     * 字段类型（0：导出导入；1：仅导出；2：仅导入）
     */
    int type() default 0;

    /**
     * 导出字段对齐方式（0：自动；1：靠左；2：居中；3：靠右）
     */
    int align() default 0;

    /**
     * 导出字段字段排序（升序）
     */
    int sort() default 0;

    /**
     * 反射类型
     */
    Class<?> fieldType() default Class.class;

    /**
     * 字段归属组（根据分组导出导入）
     */
    int[] groups() default {};
}