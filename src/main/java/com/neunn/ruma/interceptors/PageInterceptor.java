package com.neunn.ruma.interceptors;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.RoutingStatementHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.scripting.defaults.DefaultParameterHandler;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;

import com.neunn.ruma.common.bean.Page;

/**
 * <p>
 * Class : com.neunn.base.interceptor.PageInterceptor
 * <p>
 * Descdription: myBatis分页功能拦截器
 * 
 * @author 赵广志-zhaogz@neunn.com
 * @version 1.0.0
 *          <p>
 *          --------------------------------------------------------------<br>
 *          修改履历：<br>
 *          <li>2014年7月7日，zhaogz@neunn.com，创建文件；<br>
 *          --------------------------------------------------------------<br>
 *          </p>
 */
@Intercepts({ @Signature(method = "prepare", type = StatementHandler.class, args = { Connection.class }),
        @Signature(method = "query", type = Executor.class, args = { MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class }) })
public class PageInterceptor implements Interceptor {

    /**
     * mysql数据库标识
     */
    public static final String MYSQL = "mysql";

    /**
     * oracle数据库标识
     */
    public static final String ORACLE = "oracle";

    /**
     * postgresql数据库标识
     */
    public static final String POSTGRESQL = "postgresql";

    /**
     * 数据库类型
     */
    protected String databaseType;

    /**
     * 线程分页信息变量
     */
    protected ThreadLocal<Page<?>> pageThreadLocal = new ThreadLocal<Page<?>>();

    public String getDatabaseType() {
        return databaseType;
    }

    /**
     * 设置数据库类型
     * 
     * @param databaseType 数据库类型
     */
    public void setDatabaseType(String databaseType) {
        if (!databaseType.equalsIgnoreCase(MYSQL) && !databaseType.equalsIgnoreCase(ORACLE) && !databaseType.equalsIgnoreCase(POSTGRESQL)) {
            throw new PageNotSupportException("Page not support for the type of database, database type [" + databaseType + "]");
        }
        this.databaseType = databaseType;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
        if (databaseType != null) {
            setDatabaseType(databaseType);
        }
    }

    /**
     * 拦截器逻辑实现方法
     * 
     * @param invocation 调用对象
     * @return 调用对象执行返回值
     * @throws Throwable 调用对象执行发生异常时
     * @see org.apache.ibatis.plugin.Interceptor#intercept(org.apache.ibatis.plugin.Invocation)
     */
    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public Object intercept(Invocation invocation) throws Throwable {
        if (invocation.getTarget() instanceof StatementHandler) { // 控制SQL和查询总数的地方
            Page page = pageThreadLocal.get();
            if (page == null) {
                return invocation.proceed();
            }

            RoutingStatementHandler handler = (RoutingStatementHandler) invocation.getTarget();
            StatementHandler delegate = (StatementHandler) ReflectUtil.getFieldValue(handler, "delegate");
            BoundSql boundSql = delegate.getBoundSql();
            Connection connection = (Connection) invocation.getArgs()[0];
            getDatabaseType(connection);

            if (page.getTotalPage() == -1) {
                Object parameterObj = boundSql.getParameterObject();
                MappedStatement mappedStatement = (MappedStatement) ReflectUtil.getFieldValue(delegate, "mappedStatement");
                queryTotalRecord(page, parameterObj, mappedStatement, connection);
            }

            String sql = boundSql.getSql();
            String pageSql = formatPageSql(page, sql);
            ReflectUtil.setFieldValue(boundSql, "sql", pageSql);

            return invocation.proceed();
        } else {
            // 获取分页Page对象
            Page<?> page = findPageObject(invocation.getArgs()[1]);
            if (page == null) {
                return invocation.proceed();
            }
            // 设置真正的parameterObj
            invocation.getArgs()[1] = findParameterObject(invocation.getArgs()[1]);

            pageThreadLocal.set(page);
            try {
                Object resultObj = invocation.proceed(); // Executor.query(..)
                if (resultObj instanceof List) {
                    page.setResults((List) resultObj);
                }
                return resultObj;
            } finally {
                pageThreadLocal.remove();
            }
        }
    }

    /**
     * 提取分页信息对象
     * 
     * @param parameterObj spring封装后的参数对象
     * @return 分页信息对象
     */
    protected Page<?> findPageObject(Object parameterObj) {
        if (parameterObj instanceof Page<?>) {
            return (Page<?>) parameterObj;
        } else if (parameterObj instanceof Map) {
            for (Object val : ((Map<?, ?>) parameterObj).values()) {
                if (val instanceof Page<?>) {
                    return (Page<?>) val;
                }
            }
        }
        return null;
    }

    /**
     * 提取sql查询参数对象
     * 
     * @param parameterObj spring封装后的参数对象
     * @return sql查询参数对象
     */
    protected Object findParameterObject(Object parameterObj) {
        Map<String, Object> result = new HashMap<String, Object>();
        if (parameterObj instanceof Page<?>) {
            return (Page<?>) parameterObj;
        } else if (parameterObj instanceof Map<?, ?>) {
            Map<?, ?> parameterMap = (Map<?, ?>) parameterObj;
            for (Object key : parameterMap.keySet()) {
                if (!key.equals("page")) {
                    result.put(key.toString(), parameterMap.get(key));
                }
            }
        }
        return result;
    }

    /**
     * 获得连接数据库类型
     * 
     * @param connection 数据库连接
     * @throws SQLException 获得连接数据库类型失败时
     */
    protected void getDatabaseType(Connection connection) throws SQLException {
        if (databaseType == null) {
            String productName = connection.getMetaData().getDatabaseProductName();
            productName = productName.toLowerCase();
            if (productName.indexOf(MYSQL) != -1) {
                databaseType = MYSQL;
            } else if (productName.indexOf(ORACLE) != -1) {
                databaseType = ORACLE;
            } else if (productName.indexOf(POSTGRESQL) != -1) {
                databaseType = POSTGRESQL;
            } else {
                throw new PageNotSupportException("Page not support for the type of database, database product name [" + productName + "]");
            }
        }
    }

    /**
     * 生成分页查询sql
     * 
     * @param page 分页信息
     * @param sql 用户提交查询sql
     * @return 分页查询sql
     */
    protected String formatPageSql(Page<?> page, String sql) {
        if (MYSQL.equalsIgnoreCase(databaseType)) {
            return formatMysqlPageSql(page, sql);
        } else if (ORACLE.equalsIgnoreCase(databaseType)) {
            return formatOraclePageSql(page, sql);
        } else if (POSTGRESQL.equalsIgnoreCase(databaseType)) {
            return formatPostgreSqlPageSql(page, sql);
        }
        return sql;
    }

    /**
     * 生成where和order by 查询子句
     * 
     * @param page 分页查询信息
     * @param sql 原始sql文
     * @return 格式化后sql文
     */
    private StringBuilder formatWhereSql(Page<?> page, String sql) {
        StringBuilder sb = new StringBuilder(sql);
        String searchColumn = page.getSearchColumn();
        String searchColumnType = page.getSearchColumnType();
        String searchValue = page.getSearchValue();
        String searchValueOp = page.getSearchValueOp();
        if (searchColumn != null && !"".equals(searchColumn) && searchValue != null && !"".equals(searchValue)) {
            String[] searchColumns = searchColumn.split(",");
            String[] searchColumnTypes = searchColumnType.split(",");
            String[] searchValues = searchValue.split(",");
            String[] searchValueOps = searchValueOp.split(",");
            if (searchColumns.length == searchValues.length && searchColumns.length == searchColumnTypes.length && searchColumns.length == searchValueOps.length) {
                if (!sql.contains("where")) {
                    sb.append("where 1=1 ");
                }
                for (int i = 0; i < searchColumns.length; i++) {
                    if (searchColumnTypes[i].equals(Page.COLUMN_TYPE_NUMBER)) {
                        sb.append(" and ").append(searchColumns[i]).append(" ").append(searchValueOps[i]).append(" ").append(searchValues[i]);
                    } else if (searchColumnTypes[i].equals(Page.COLUMN_TYPE_STRING)) {
                        sb.append(" and ").append(searchColumns[i]).append(" ").append(searchValueOps[i]).append("'").append(searchValues[i]).append("'");
                    } else if (searchColumnTypes[i].equals(Page.COLUMN_TYPE_DATE)) {
                        // searchValues[i]值形如：'2007-09-07 00:00:00','yyyy-mm-dd
                        // hh24:mi:ss'的字符串
                        if (databaseType == MYSQL) {
                            sb.append(" and unix_timestamp(").append(searchColumns[i]).append(") ").append(searchValueOps[i]).append(" ").append("unix_timestamp(str_to_date(")
                                    .append(searchValues[i]).append("))");
                        } else if (databaseType == ORACLE) {
                            sb.append(" and ").append(searchColumns[i]).append(" ").append(searchValueOps[i]).append(" ").append("to_date(").append(searchValues[i]).append(")");
                        } else if (databaseType == POSTGRESQL) {
                            sb.append(" and ").append(searchColumns[i]).append(" ").append(searchValueOps[i]).append(" ").append("to_date(").append(searchValues[i]).append(")");
                        } else {
                            // do nothing
                        }
                    } else {
                        sb.append(" and ").append(searchColumns[i]).append(" ").append(searchValueOps[i]).append(" ").append(searchValues[i]);
                    }
                }
            }
        }
        formatOrderBySql(page, sb);
        return sb;
    }

    /**
     * 生成order by 查询子句
     * 
     * @param page 分页查询信息
     * @param sb 原始sql文
     */
    private void formatOrderBySql(Page<?> page, StringBuilder sb) {
        String sortColumn = page.getSortColumn();
        String sortValue = page.getSortOrder();
        if (sortColumn != null && !"".equals(sortColumn) && sortValue != null && !"".equals(sortValue)) {
            String[] sortColumns = sortColumn.split(",");
            String[] sortValues = sortValue.split(",");
            if (sortColumns.length == sortValues.length) {
                sb.append(" order by ");
                for (int i = 0; i < sortColumns.length; i++) {
                    if (i == sortColumns.length - 1) {
                        sb.append(sortColumns[i]).append(" ").append(sortValues[i]);
                    } else {
                        sb.append(sortColumns[i]).append(" ").append(sortValues[i]).append(",");
                    }
                }
            }
        }
    }

    /**
     * 生成MySql数据库分页查询sql
     * 
     * @param page 分页信息
     * @param sql 用户提交查询sql
     * @return 分页查询sql
     */
    protected String formatMysqlPageSql(Page<?> page, String sql) {
        // 计算第一条记录的位置，Mysql中记录的位置是从0开始的。
        int offset = 0;
        if (page.getOffset() == -1) {
            offset = (page.getPageNo() - 1) * page.getPageSize();
        } else {
            offset = page.getOffset();
        }
        StringBuilder sb = formatWhereSql(page, sql);
        return sb.append(" limit ").append(offset).append(",").append(page.getPageSize()).toString();
    }

    /**
     * 生成Oracle数据库分页查询sql
     * 
     * @param page 分页信息
     * @param sql 用户提交查询sql
     * @return 分页查询sql
     */
    protected String formatOraclePageSql(Page<?> page, String sql) {
        // 计算第一条记录的位置，Oracle分页是通过rownum进行的，而rownum是从1开始的
        int offset = 0;
        if (page.getOffset() == -1) {
            offset = (page.getPageNo() - 1) * page.getPageSize() + 1;
        } else {
            offset = page.getOffset();
        }
        StringBuilder sb = formatWhereSql(page, sql);
        sb.insert(0, "select u.*, rownum r from (").append(") u where rownum < ").append(offset + page.getPageSize());
        sb.insert(0, "select * from (").append(") where r >= ").append(offset);
        formatOrderBySql(page, sb);
        return sb.toString();
    }

    /**
     * 生成postgreSql数据库分页查询sql
     * 
     * @param page 分页信息
     * @param sql 用户提交查询sql
     * @return 分页查询sql
     */
    protected String formatPostgreSqlPageSql(Page<?> page, String sql) {
        // 计算第一条记录的位置，postgresql中记录的位置是从0开始的。
        int offset = 0;
        if (page.getOffset() == -1) {
            offset = (page.getPageNo() - 1) * page.getPageSize();
        } else {
            offset = page.getOffset();
        }
        StringBuilder sb = formatWhereSql(page, sql);
        return sb.append(" limit ").append(page.getPageSize()).append(" offset ").append(offset).toString();
    }

    /**
     * 查询记录总数
     * 
     * @param page 分页信息
     * @param parameterObject 查询参数对象
     * @param mappedStatement sql语句对象
     * @param connection 数据库连接
     */
    protected void queryTotalRecord(Page<?> page, Object parameterObject, MappedStatement mappedStatement, Connection connection) {
        BoundSql boundSql = mappedStatement.getBoundSql(parameterObject);
        String sql = boundSql.getSql();
        String countSql = this.formatCountSql(formatWhereSql(page, sql).toString());

        List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
        BoundSql countBoundSql = new BoundSql(mappedStatement.getConfiguration(), countSql, parameterMappings, parameterObject);
        ParameterHandler parameterHandler = new DefaultParameterHandler(mappedStatement, parameterObject, countBoundSql);
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            pstmt = connection.prepareStatement(countSql);
            parameterHandler.setParameters(pstmt);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                int totalRecord = rs.getInt(1);
                page.setTotalRecord(totalRecord);
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            if (rs != null)
                try {
                    rs.close();
                } catch (Exception e) {
                    // do nothing
                }
            if (pstmt != null)
                try {
                    pstmt.close();
                } catch (Exception e) {
                    // do nothing
                }
        }
    }

    /**
     * 生成查询记录总数sql
     * 
     * @param sql 用户请求查询sql
     * @return 查询记录总数sql
     */
    protected String formatCountSql(String sql) {
        int startIndex = sql.indexOf("from");
        int endIndex = sql.indexOf("order") == -1 ? sql.length() : sql.indexOf("order");
        return "select count(*) " + sql.substring(startIndex, endIndex);
    }

    /**
     * 反射工具类
     */
    private static class ReflectUtil {
        /**
         * 获取指定对象的指定属性
         * 
         * @param obj 指定对象
         * @param fieldName 指定属性名称
         * @return 指定属性
         */
        public static Object getFieldValue(Object obj, String fieldName) {
            Object result = null;
            Field field = ReflectUtil.getField(obj, fieldName);
            if (field != null) {
                field.setAccessible(true);
                try {
                    result = field.get(obj);
                } catch (IllegalArgumentException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            return result;
        }

        /**
         * 获取指定对象里面的指定属性对象
         * 
         * @param obj 目标对象
         * @param fieldName 指定属性名称
         * @return 属性对象
         */
        private static Field getField(Object obj, String fieldName) {
            Field field = null;
            for (Class<?> clazz = obj.getClass(); clazz != Object.class; clazz = clazz.getSuperclass()) {
                try {
                    field = clazz.getDeclaredField(fieldName);
                    break;
                } catch (NoSuchFieldException e) {
                    // do nothing
                }
            }
            return field;
        }

        /**
         * 设置指定对象的指定属性值
         * 
         * @param obj 指定对象
         * @param fieldName 指定属性
         * @param fieldValue 指定属性值
         */
        public static void setFieldValue(Object obj, String fieldName, String fieldValue) {
            Field field = ReflectUtil.getField(obj, fieldName);
            if (field != null) {
                try {
                    field.setAccessible(true);
                    field.set(obj, fieldValue);
                } catch (IllegalArgumentException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * <p>
     * Class : base.interceptor.PageNotSupportException
     * <p>
     * Descdription: 分页功能不支持数据类型异常
     * 
     * @author 赵广志-zhaogz@neunn.com
     * @version 1.0.0
     *          <p>
     *          --------------------------------------------------------------<br>
     *          修改履历：<br>
     *          <li>2014年7月7日，zhaogz@neunn.com，创建文件；<br>
     *          --------------------------------------------------------------
     *          <br>
     *          </p>
     */
    public static class PageNotSupportException extends RuntimeException {

        /**
         * long serialVersionUID: serialVersionUID
         */
        private static final long serialVersionUID = -7992516789704944681L;

        /**
         * 构造函数
         */
        public PageNotSupportException() {
            super();
        }

        /**
         * 根据错误消息和发生异常构造类实例
         * 
         * @param message 错误消息
         * @param cause 发生异常
         */
        public PageNotSupportException(String message, Throwable cause) {
            super(message, cause);
        }

        /**
         * 根据错误消息构造类实例
         * 
         * @param message 错误消息
         */
        public PageNotSupportException(String message) {
            super(message);
        }

        /**
         * 根据发生异常构造类实例
         * 
         * @param cause 发生异常
         */
        public PageNotSupportException(Throwable cause) {
            super(cause);
        }
    }

}