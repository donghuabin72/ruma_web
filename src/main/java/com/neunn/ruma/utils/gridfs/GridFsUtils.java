/**
 * @项目名称: ruma-web
 * @文件名称: GridFsUtils.java
 * @Date: 2016年2月25日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils.gridfs;

import java.io.File;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.mongodb.DB;
import com.mongodb.DBCursor;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import com.neunn.ruma.utils.ObjectUtils;
import com.neunn.ruma.utils.StreamUtils;

/**
 * mongo GridF文件管理器工具类
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月25日
 * @since 1.0
 */
public class GridFsUtils {
    private static Logger logger = LoggerFactory.getLogger(MongodbPool.class);

    /**
     * mongoDB GridFs连接对象
     */
    private static DB fsDB = null;

    /**
     * GridFS对象
     */
    private static GridFS myFS = null;

    public GridFsUtils() {

    }

    /**
     * 初始化GirdFs
     * 
     * @date 2016年2月25日
     * @param dirpath 文件所属mongo GridFS集合的名称，类似于文件夹
     * @since 1.0
     */
    private static void init(String dirpath) {
        if (ObjectUtils.isEmpty(fsDB)) {
            fsDB = MongodbPool.getDB("");
        }
        if (ObjectUtils.isEmpty(myFS)) {
            myFS = new GridFS(fsDB, dirpath);
        }
    }

    /**
     * 上传一个文件到mongo GridFS文件服务器
     * 
     * @date 2016年2月25日
     * @param file 要上传的文件
     * @param dirpath 文件所属mongo GridFS集合的名称，类似于文件夹
     * @return
     */
    public static boolean uploadFile(File file, String dirpath) {
        init(dirpath);
        try {
            if (file.exists()) {
                GridFSInputFile inputFile;
                inputFile = myFS.createFile(file);
                inputFile.save();
                return true;
            }
        } catch (IOException e) {
            logger.error("GridFsUtils-uploadFile:上传文件到GridFS异常", e);
        }
        return false;
    }

    /**
     * 从mongo GridFS文件服务器获取一个指定文件
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年2月25日
     * @param filekey 文件主键值
     * @param dirpath 文件所属mongo GridFS集合的名称，类似于文件夹
     * @return 返回map对象中包括：filebyte 文件转换为字节数组数据 ；filename 文件名称
     * @since 1.0
     */
    public static Map<String, Object> findFileById(String filekey, String dirpath) {
        init(dirpath);
        Map<String, Object> result = new HashMap<String, Object>();
        try {
            GridFSDBFile gridFSDBFile = myFS.findOne(new ObjectId(filekey));
            if (ObjectUtils.isNotEmpty(gridFSDBFile)) {
                InputStream in = gridFSDBFile.getInputStream();
                result.put("filebyte", StreamUtils.InputStreamTOByte(in));
                result.put("filename", gridFSDBFile.getFilename());
            }
        } catch (Exception e) {
            logger.error("GridFsUtils-findFileById:从GridFS下载文件异常", e);
        }
        return result;
    }

    /**
     * 从mongo GridFS文件服务器获取一个指定文件
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年2月25日
     * @param name 文件名
     * @param dirpath 文件所属mongo GridFS集合的名称，类似于文件夹
     * @return 返回map对象中包括：filebyte 文件转换为字节数组数据 ；filename 文件名称
     * @since 1.0
     */
    public static Map<String, Object> findFileByName(String name, String dirpath) {
        init(dirpath);
        Map<String, Object> result = new HashMap<String, Object>();
        try {
            GridFSDBFile gridFSDBFile = myFS.findOne(name);
            if (ObjectUtils.isNotEmpty(gridFSDBFile)) {
                InputStream in = gridFSDBFile.getInputStream();
                result.put("filebyte", StreamUtils.InputStreamTOByte(in));
                result.put("filename", gridFSDBFile.getFilename());
            }
        } catch (Exception e) {
            logger.error("GridFsUtils-findFileByName:从GridFS下载文件异常", e);
        }
        return result;
    }

    /**
     * 获取指定集合域中的所有文件
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年2月25日
     * @param dirpath 文件所属mongo GridFS集合的名称，类似于文件夹
     * @return 返回集合对象中每个对象包括：filebyte 文件转换为字节数组数据 ；filename 文件名称
     * @since 1.0
     */
    public static List<Map<String, Object>> findAllFile(String dirpath) {
        init(dirpath);
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        DBCursor cursor = myFS.getFileList();
        while (cursor.hasNext()) {
            list.add(findFileById(String.valueOf(cursor.next().get("_id")), dirpath));
        }
        return list;
    }

}
