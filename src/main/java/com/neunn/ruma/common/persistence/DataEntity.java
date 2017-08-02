/**
 * @项目名称: ruma-web
 * @文件名称: CrudDao.java
 * @Date: 2016年2月25日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.common.persistence;

import java.util.Date;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.utils.IdGen;
import com.neunn.ruma.utils.StringUtils;
import com.neunn.ruma.utils.UserUtils;

/**
 * DAO共通基础类实现
 * 
 * @author Frank
 * @date 2016年2月25日
 * @since 1.0
 */
public abstract class DataEntity<T> extends BaseEntity<T> {

	private static final long serialVersionUID = 1L;
	
	protected String remarks;	// 备注
	protected UserEntity createBy;	// 创建者
	protected Date createDate;	// 创建日期
	protected UserEntity updateBy;	// 更新者
	protected Date updateDate;	// 更新日期
	protected String delFlag; 	// 删除标记（0：正常；1：删除；2：审核）
	
	public DataEntity() {
		super();
		this.delFlag = DEL_FLAG_NORMAL;
	}
	
	public DataEntity(String id) {
		super(id);
	}
	
	/**
	 * 插入之前执行方法，需要手动调用
	 */
	@Override
	public void preInsert(){
		// 不限制ID为UUID，调用setIsNewRecord()使用自定义ID
		if (!this.isNewRecord){
			setId(IdGen.uuid());
		}
		UserEntity user = UserUtils.getUser();
		if (StringUtils.isNotBlank(user.getId()+"")){
			this.updateBy = user;
			this.createBy = user;
		}
		this.updateDate = new Date();
		this.createDate = this.updateDate;
	}
	
	/**
	 * 更新之前执行方法，需要手动调用
	 */
	@Override
	public void preUpdate(){
	    UserEntity user = UserUtils.getUser();
		if (StringUtils.isNotBlank(user.getId()+"")){
			this.updateBy = user;
		}
		this.updateDate = new Date();
	}
	
	@Length(min=0, max=255)
	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	@JsonIgnore
	public UserEntity getCreateBy() {
		return createBy;
	}

	public void setCreateBy(UserEntity createBy) {
		this.createBy = createBy;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@JsonIgnore
	public UserEntity getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(UserEntity updateBy) {
		this.updateBy = updateBy;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	@JsonIgnore
	@Length(min=1, max=1)
	public String getDelFlag() {
		return delFlag;
	}

	public void setDelFlag(String delFlag) {
		this.delFlag = delFlag;
	}

}
