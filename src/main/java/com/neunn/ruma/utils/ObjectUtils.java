/**
 * @项目名称: ruma-web
 * @文件名称: ObjectUtils.java
 * @Date: 2016年2月23日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

/**
 * 对象操作工具类, 继承org.apache.commons.lang3.ObjectUtils类
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月24日
 * @since 1.0
 */
public class ObjectUtils extends org.apache.commons.lang3.ObjectUtils {

    /**
     * 注解到对象复制，只复制能匹配上的方法。
     * 
     * @param annotation
     * @param object
     */
    public static void annotationToObject(Object annotation, Object object) {
        if (annotation != null) {
            Class<?> annotationClass = annotation.getClass();
            Class<?> objectClass = object.getClass();
            for (Method m : objectClass.getMethods()) {
                if (StringUtils.startsWith(m.getName(), "set")) {
                    try {
                        String s = StringUtils.uncapitalize(StringUtils.substring(m.getName(), 3));
                        Object obj = annotationClass.getMethod(s).invoke(annotation);
                        if (obj != null && !"".equals(obj.toString())) {
                            if (object == null) {
                                object = objectClass.newInstance();
                            }
                            m.invoke(object, obj);
                        }
                    } catch (Exception e) {
                        // 忽略所有设置失败方法
                    }
                }
            }
        }
    }

    /**
     * 序列化对象
     * 
     * @param object
     * @return
     */
    public static byte[] serialize(Object object) {
        ObjectOutputStream oos = null;
        ByteArrayOutputStream baos = null;
        try {
            if (object != null) {
                baos = new ByteArrayOutputStream();
                oos = new ObjectOutputStream(baos);
                oos.writeObject(object);
                return baos.toByteArray();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 反序列化对象
     * 
     * @param bytes
     * @return
     */
    public static Object unserialize(byte[] bytes) {
        ByteArrayInputStream bais = null;
        try {
            if (bytes != null && bytes.length > 0) {
                bais = new ByteArrayInputStream(bytes);
                ObjectInputStream ois = new ObjectInputStream(bais);
                return ois.readObject();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 判断对象是否为空
     * 
     * @param obj
     * @return
     */
    @SuppressWarnings("rawtypes")
    public static boolean isEmpty(Object obj) {
        if (obj == null) {
            return true;
        }
        if ((obj instanceof String)) {
            String str = (String) obj;
            return "".equals(str.trim());
        }
        if ((obj instanceof Number)) {
            Number num = (Number) obj;
            return num.byteValue() == 0;
        }
        if ((obj instanceof Collection)) {
            Collection col = (Collection) obj;
            return col.isEmpty();
        }
        if ((obj instanceof Map)) {
            Map map = (Map) obj;
            return map.isEmpty();
        }
        if (obj.getClass().getSimpleName().endsWith("[]")) {
            List<Object> list = Arrays.asList(new Object[] {obj});
            Object[] objs = (Object[]) list.get(0);
            return objs.length == 0;
        }
        return false;
    }

    /**
     * 判断对象是否不为空
     * 
     * @param obj
     * @return
     */
    public static boolean isNotEmpty(Object obj) {
        return !isEmpty(obj);
    }
}
