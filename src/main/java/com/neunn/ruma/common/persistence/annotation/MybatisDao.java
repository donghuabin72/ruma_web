/**
 *@项目名称: ruma-web
 *@文件名称: MybatisDao.java
 *@Date: 2016年2月25日
 *@Copyright: 2016-2016 www.neunn.com  All rights reserved.
 *注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.persistence.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.stereotype.Component;

/**
 * 标识MyBatis的DAO,方便{@link org.mybatis.spring.mapper.MapperScannerConfigurer}的扫描
 * 
 * @author Frank
 * @date 2016年2月25日 
 * @since 1.0
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Component
public @interface MybatisDao {

}
