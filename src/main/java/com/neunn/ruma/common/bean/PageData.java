package com.neunn.ruma.common.bean;

import java.util.List;

/**
 * <p>Class       : com.neunn.base.bean.PageData
 * <p>Descdription: dataTable查询结果保存实现类
 *
 * @author  赵广志-zhaogz@neunn.com
 * @version 1.0.0
 *<p>
 *--------------------------------------------------------------<br>
 * 修改履历：<br>
 *        <li> 2015年5月27日，zhaogz@neunn.com，创建文件；<br>
 *--------------------------------------------------------------<br>
 *</p>
 */
public class PageData {

    /**
     * int draw: 客户端请求次数
     */
    private int draw;

    /**
     * int recordsTotal: 全部记录数
     */
    private int recordsTotal;

    /**
     * int recordsFiltered: 显示记录总数
     */
    private int recordsFiltered;

    /**
     * List<T> data: 表格数据
     */
    private List<?> data;

    /**
     * 统计字段,统计结果
     */
    private String sumValue;

    public int getDraw() {
        return draw;
    }

    public void setDraw(int draw) {
        this.draw = draw;
    }

    public int getRecordsTotal() {
        return recordsTotal;
    }

    public void setRecordsTotal(int recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public int getRecordsFiltered() {
        return recordsFiltered;
    }

    public void setRecordsFiltered(int recordsFiltered) {
        this.recordsFiltered = recordsFiltered;
    }

    public List<?> getData() {
        return data;
    }

    public void setData(List<?> data) {
        this.data = data;
    }

    public String getSumValue() {
        return sumValue;
    }

    public void setSumValue(String sumValue) {
        this.sumValue = sumValue;
    }

}
