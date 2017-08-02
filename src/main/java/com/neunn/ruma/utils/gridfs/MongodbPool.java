/**
 * @项目名称: ruma-web
 * @文件名称: MongodbPool.java
 * @Date: 2016年2月25日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils.gridfs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.DB;
import com.mongodb.Mongo;
import com.mongodb.MongoOptions;
import com.neunn.ruma.common.config.Global;


/**
 * mongodb连接池工具类
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月25日
 * @since 1.0
 */
public final class MongodbPool {

    private static Logger logger = LoggerFactory.getLogger(MongodbPool.class);

    private static Mongo mongo = null;


    /**
     * 根据DB名称获得连接
     * 
     * @param dbName 要操作的数据库DB名称
     * @return
     */
    public static DB getDB(String dbName) {
        if (mongo == null) {
            init();
        }
        return mongo.getDB(Global.getConfig("mongo.db"));
    }

    /**
     * 初始化mongo连接对象
     */
    private static void init() {
        // 获取mongodb主机地址
        String host = Global.getConfig("mongo.host");
        // 获取mongodb端口号
        int port = Integer.parseInt(Global.getConfig("mongo.port"));
        // 获取连接池大小
        int poolSize = Integer.parseInt(Global.getConfig("mongo.poolsize"));
        // 获取等待队列大小
        int blockSize = Integer.parseInt(Global.getConfig("mongo.blocksize"));
        try {
            mongo = new Mongo(host, port);
            MongoOptions opt = mongo.getMongoOptions();
            opt.connectionsPerHost = poolSize;
            opt.threadsAllowedToBlockForConnectionMultiplier = blockSize;
        } catch (Exception e) {
            logger.error("初始化mongo连接对象-MongodbPool.init方法异常 ：", e);
        }
    }
}
