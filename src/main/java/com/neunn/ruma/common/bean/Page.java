package com.neunn.ruma.common.bean;

import java.util.List;

/**
 * <p>
 * Class : com.neunn.base.bean.Page
 * <p>
 * Descdription: myBatis分页信息保存实现类
 * 
 * @author 赵广志-zhaogz@neunn.com
 * @version 1.0.0
 * @param <T> <p>
 *        --------------------------------------------------------------<br>
 *        修改履历：<br>
 *        <li>2014年7月7日，zhaogz@neunn.com，创建文件；<br>
 *        --------------------------------------------------------------<br>
 *        </p>
 */
public class Page<T> {

    /**
     * 缺省每页记录数
     */
    public static final int DEFAULT_PAGE_SIZE = 10;

    /**
     * 查询字段类型值:字符类型
     */
    public static final String COLUMN_TYPE_STRING = "string";

    /**
     * 查询字段类型值:数值类型
     */
    public static final String COLUMN_TYPE_NUMBER = "number";

    /**
     * 查询字段类型值:日期类型
     */
    public static final String COLUMN_TYPE_DATE = "date";

    /**
     * 页码
     */
    private int pageNo = 1;

    /**
     * 偏移量
     */
    private int offset = -1;

    /**
     * 每页记录数
     */
    private int pageSize = DEFAULT_PAGE_SIZE;

    /**
     * 总记录数
     */
    private int totalRecord = 0;

    /**
     * 总页数
     */
    private int totalPage = -1;

    /**
     * 页面数据
     */
    private List<T> results;

    /**
     * 排序字段
     */
    private String sortColumn;

    /**
     * 排序方式
     */
    private String sortOrder;

    /**
     * 查询条件字段
     */
    private String searchColumn;

    /**
     * 查询条件字段类型
     */
    private String searchColumnType;

    /**
     * 查询条件字段值
     */
    private String searchValue;

    /**
     * 查询条件字段值操作符
     */
    private String searchValueOp;

    /**
     * 获得页码
     * 
     * @return 页码
     */
    public int getPageNo() {
        return pageNo;
    }

    /**
     * 设置页码
     * 
     * @param pageNo 页码
     */
    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    /**
     * 获得每页记录数
     * 
     * @return 每页记录数
     */
    public int getPageSize() {
        return pageSize;
    }

    /**
     * 设置每页记录数
     * 
     * @param pageSize 每页记录数
     */
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
        computeTotalPage();
    }

    /**
     * 获得总记录数
     * 
     * @return 总记录数
     */
    public int getTotalRecord() {
        return totalRecord;
    }

    /**
     * 设置总记录数
     * 
     * @param totalRecord 总记录数
     */
    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;
        computeTotalPage();
    }

    /**
     * 获得总页数
     * 
     * @return 总页数
     */
    public int getTotalPage() {
        return totalPage;
    }

    /**
     * 计算总页数
     */
    protected void computeTotalPage() {
        if (getPageSize() > 0 && getTotalRecord() > 0) {
            this.totalPage = (int) (getTotalRecord() % getPageSize() == 0 ? getTotalRecord() / getPageSize() : getTotalRecord() / getPageSize() + 1);
        }
    }

    /**
     * 获得页面数据
     * 
     * @return 页面数据
     */
    public List<T> getResults() {
        return results;
    }

    /**
     * 设置页面数据
     * 
     * @param results 页面数据
     */
    public void setResults(List<T> results) {
        this.results = results;
    }

    public String getSortColumn() {
        return sortColumn;
    }

    public void setSortColumn(String sortColumn) {
        this.sortColumn = sortColumn;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getSearchColumn() {
        return searchColumn;
    }

    public void setSearchColumn(String searchColumn) {
        this.searchColumn = searchColumn;
    }

    public String getSearchColumnType() {
        return searchColumnType;
    }

    public void setSearchColumnType(String searchColumnType) {
        this.searchColumnType = searchColumnType;
    }

    public String getSearchValue() {
        return searchValue;
    }

    public void setSearchValue(String searchValue) {
        this.searchValue = searchValue;
    }

    public String getSearchValueOp() {
        return searchValueOp;
    }

    public void setSearchValueOp(String searchValueOp) {
        this.searchValueOp = searchValueOp;
    }

}
