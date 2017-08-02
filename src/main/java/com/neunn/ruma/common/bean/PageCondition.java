package com.neunn.ruma.common.bean;

/**
 * <p>Class       : com.neunn.base.bean.PageCondition
 * <p>Descdription: dataTable前台查询条件保存实现类
 *
 * @author  赵广志-zhaogz@neunn.com
 * @version 1.0.0
 * @param <T>
 *<p>
 *--------------------------------------------------------------<br>
 * 修改履历：<br>
 *        <li> 2015年5月27日，zhaogz@neunn.com，创建文件；<br>
 *--------------------------------------------------------------<br>
 *</p>
 */
public class PageCondition<T> extends Page<T> {

    /**
     * int draw: 客户端请求次数
     */
    private int draw;

    /**
     * String size: 每页显示记录数
     */
    private String size;

    /**
     * String currentRecord: 起始记录偏移量
     */
    private String currentRecord;

    /**
     * String sortOrder: 排序字段索引
     */
    private String sortColumn;

    /**
     * String sortDir: 排序方式
     */
    private String sortOrder;

    /**
     * String searchValue: 搜索条件
     */
    private String searchValue;

    /**
     * 查询表名称
     */
    private String tableName;

    /**
     * 统计字段
     */
    private String sumField;

    public int getDraw() {
        return draw;
    }

    public void setDraw(int draw) {
        this.draw = draw;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getCurrentRecord() {
        return currentRecord;
    }

    public void setCurrentRecord(String currentRecord) {
        this.currentRecord = currentRecord;
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

    public String getSearchValue() {
        return searchValue;
    }

    public void setSearchValue(String searchValue) {
        this.searchValue = searchValue;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getSumField() {
        return sumField;
    }

    public void setSumField(String sumField) {
        this.sumField = sumField;
    }

}
