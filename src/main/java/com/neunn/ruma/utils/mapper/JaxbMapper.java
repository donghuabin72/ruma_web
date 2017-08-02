/**
 * @项目名称: ruma-web
 * @文件名称: JaxbMapper.java
 * @Date: 2016年2月24日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils.mapper;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.namespace.QName;

import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.util.Assert;

import com.neunn.ruma.utils.ExceptionUtils;
import com.neunn.ruma.utils.Reflections;
import com.neunn.ruma.utils.StringUtils;

/**
 * 使用Jaxb2.0实现XML<->Java Object的Mapper.
 * 
 * 在创建时需要设定所有需要序列化的Root对象的Class. 特别支持Root对象是Collection的情形.
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月24日
 * @since 1.0
 */
@SuppressWarnings("rawtypes")
public class JaxbMapper {

    private static ConcurrentMap<Class, JAXBContext> jaxbContexts = new ConcurrentHashMap<Class, JAXBContext>();

    /**
     * Java Object 转为 Xml格式字符串
     */
    public static String toXml(Object root) {
        Class clazz = Reflections.getUserClass(root);
        return toXml(root, clazz, null);
    }

    /**
     * Java Object 转为 Xml格式字符串
     */
    public static String toXml(Object root, String encoding) {
        Class clazz = Reflections.getUserClass(root);
        return toXml(root, clazz, encoding);
    }

    /**
     * Java Object 转为 Xml格式字符串.
     */
    public static String toXml(Object root, Class clazz, String encoding) {
        try {
            StringWriter writer = new StringWriter();
            createMarshaller(clazz, encoding).marshal(root, writer);
            return writer.toString();
        } catch (JAXBException e) {
            throw ExceptionUtils.unchecked(e);
        }
    }

    /**
     * Java Collection->Xml without encoding, 特别支持Root Element是Collection的情形.
     */
    public static String toXml(Collection<?> root, String rootName, Class clazz) {
        return toXml(root, rootName, clazz, null);
    }

    /**
     * Java Collection->Xml with encoding, 特别支持Root Element是Collection的情形.
     */
    public static String toXml(Collection<?> root, String rootName, Class clazz, String encoding) {
        try {
            CollectionWrapper wrapper = new CollectionWrapper();
            wrapper.collection = root;

            JAXBElement<CollectionWrapper> wrapperElement =
                    new JAXBElement<CollectionWrapper>(new QName(rootName), CollectionWrapper.class, wrapper);

            StringWriter writer = new StringWriter();
            createMarshaller(clazz, encoding).marshal(wrapperElement, writer);

            return writer.toString();
        } catch (JAXBException e) {
            throw ExceptionUtils.unchecked(e);
        }
    }

    /**
     * xml数据转为object
     */
    @SuppressWarnings("unchecked")
    public static <T> T fromXml(String xml, Class<T> clazz) {
        try {
            StringReader reader = new StringReader(xml);
            return (T) createUnmarshaller(clazz).unmarshal(reader);
        } catch (JAXBException e) {
            throw ExceptionUtils.unchecked(e);
        }
    }

    /**
     * 创建Marshaller并设定encoding(可为null). 线程不安全，需要每次创建或pooling。
     */
    public static Marshaller createMarshaller(Class clazz, String encoding) {
        try {
            JAXBContext jaxbContext = getJaxbContext(clazz);

            Marshaller marshaller = jaxbContext.createMarshaller();

            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

            if (StringUtils.isNotBlank(encoding)) {
                marshaller.setProperty(Marshaller.JAXB_ENCODING, encoding);
            }

            return marshaller;
        } catch (JAXBException e) {
            throw ExceptionUtils.unchecked(e);
        }
    }

    /**
     * 创建UnMarshaller. 线程不安全，需要每次创建或pooling。
     */
    public static Unmarshaller createUnmarshaller(Class clazz) {
        try {
            JAXBContext jaxbContext = getJaxbContext(clazz);
            return jaxbContext.createUnmarshaller();
        } catch (JAXBException e) {
            throw ExceptionUtils.unchecked(e);
        }
    }

    /**
     * 获取JAXBContext，用于创建Unmarshaller
     */
    protected static JAXBContext getJaxbContext(Class clazz) {
        Assert.notNull(clazz, "'clazz' must not be null");
        JAXBContext jaxbContext = jaxbContexts.get(clazz);
        if (jaxbContext == null) {
            try {
                jaxbContext = JAXBContext.newInstance(clazz, CollectionWrapper.class);
                jaxbContexts.putIfAbsent(clazz, jaxbContext);
            } catch (JAXBException ex) {
                throw new HttpMessageConversionException("Could not instantiate JAXBContext for class [" + clazz + "]: "
                        + ex.getMessage(), ex);
            }
        }
        return jaxbContext;
    }

    /**
     * 封装Root Element 是 Collection的情况.
     */
    public static class CollectionWrapper {

        @XmlAnyElement
        protected Collection<?> collection;
    }

}
