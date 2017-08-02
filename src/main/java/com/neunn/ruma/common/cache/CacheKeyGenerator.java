/**
 * @项目名称: ruma-web
 * @文件名称: CacheKeyGenerator.java
 * @Date: 2016年3月7日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.cache;

import java.lang.reflect.Method;

import org.springframework.cache.interceptor.KeyGenerator;

/**
 * spring-data-redis作为系统缓存存储数据，该类负责自动动态生成键值
 * <p>
 * {@code  @Cacheable()}
 * </p>
 * 
 * @author Frank
 * @date 2016年3月7日
 * @since 1.0
 */
public class CacheKeyGenerator implements KeyGenerator {

    /**
     * 类名＋方法名＋参数名
     * 
     * @author Frank
     * @date 2016年3月7日
     * @param target
     * @param method
     * @param params
     * @return
     * @since 1.0
     */
    @Override
    public Object generate(Object target, Method method, Object... objects) {
        StringBuilder sb = new StringBuilder();
        sb.append(target.getClass().getName());
        sb.append(method.getName());
        for (Object obj : objects) {
            sb.append(obj.toString());
        }
        return sb.toString();
    }

}
