/**
 *@项目名称: ruma-web
 *@文件名称: CacheInterface.java
 *@Date: 2016年3月16日
 *@Copyright: 2015-2016 www.neunn.com  All rights reserved.
 *注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils.cache;

/**
 * 缓存管理接口
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年3月16日 
 * @since 1.0
 */
public interface CacheInterface {

    public   String get(String key);
    
    public   Object getObject(String key);
    
    public <T> T getObject(String key, Class<T> clazz);
    
    public  String set(String key, String value, int cacheSeconds);
    
    public  String setObject(String key, Object value, int cacheSeconds);
    
    public  long del(String key) ;
    
    public  long delObject(String key);
    
}
