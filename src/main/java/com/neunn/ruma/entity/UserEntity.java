/**
 * @项目名称: ruma-web
 * @文件名称: UserEntity.java
 * @Date: 2016年2月17日
 * @Copyright: 2016-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户实体类
 * 
 * @author Hely
 * @date 2016年03月03日
 * @since 1.0
 */
public class UserEntity implements Serializable {
    private static final long serialVersionUID = -1831191051652153375L;

    //主键
    private int id;

    //用户名
    private String username;


    //工号
    private String numberl;

    //手机
    private String phone;

    //邮箱
    private String email;

    //头像
    private String photo;

    //最后一次登录时间
    private Date loginDate;

    //冻结标识
    private String lockFlag;

    //创建人
    private int createBy;

    //创建日期
    private Date createDate;

    //修改人
    private int updateBy;

    //修改日期
    private Date updateDate;

    //备注
    private String remarks;

    //删除标识
    private String delFlag;

    //座机
    private String mobile;

    //部门
    private int dept;

    //真实姓名
    private String realname;

    private String roleName;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.id
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.name
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String name;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.passwd
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String passwd;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.org_id
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String orgId;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * org_info.name
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String orgName;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.email
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.tel
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String tel;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.creat_user
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String creatUser;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.creat_time
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private Date creatTime;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.modify_user
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private String modifyUser;

    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column
     * user_info.modify_time
     *
     * @mbggenerated Wed May 27 10:39:02 CST 2015
     */
    private Date modifyTime;



    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the numberl
     */
    public String getNumberl() {
        return numberl;
    }

    /**
     * @param numberl the numberl to set
     */
    public void setNumberl(String numberl) {
        this.numberl = numberl;
    }

    /**
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone the phone to set
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the photo
     */
    public String getPhoto() {
        return photo;
    }

    /**
     * @param photo the photo to set
     */
    public void setPhoto(String photo) {
        this.photo = photo;
    }

    /**
     * @return the loginDate
     */
    public Date getLoginDate() {
        return loginDate;
    }

    /**
     * @param loginDate the loginDate to set
     */
    public void setLoginDate(Date loginDate) {
        this.loginDate = loginDate;
    }

    /**
     * @return the lockFlag
     */
    public String getLockFlag() {
        return lockFlag;
    }

    /**
     * @param lockFlag the lockFlag to set
     */
    public void setLockFlag(String lockFlag) {
        this.lockFlag = lockFlag;
    }

    /**
     * @return the createBy
     */
    public int getCreateBy() {
        return createBy;
    }

    /**
     * @param createBy the createBy to set
     */
    public void setCreateBy(int createBy) {
        this.createBy = createBy;
    }

    /**
     * @return the createDate
     */
    public Date getCreateDate() {
        return createDate;
    }

    /**
     * @param createDate the createDate to set
     */
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    /**
     * @return the updateBy
     */
    public int getUpdateBy() {
        return updateBy;
    }

    /**
     * @param updateBy the updateBy to set
     */
    public void setUpdateBy(int updateBy) {
        this.updateBy = updateBy;
    }

    /**
     * @return the updateDate
     */
    public Date getUpdateDate() {
        return updateDate;
    }

    /**
     * @param updateDate the updateDate to set
     */
    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    /**
     * @return the remarks
     */
    public String getRemarks() {
        return remarks;
    }

    /**
     * @param remarks the remarks to set
     */
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    /**
     * @return the delFlag
     */
    public String getDelFlag() {
        return delFlag;
    }

    /**
     * @param delFlag the delFlag to set
     */
    public void setDelFlag(String delFlag) {
        this.delFlag = delFlag;
    }


    /**
     * @return the mobile
     */
    public String getMobile() {
        return mobile;
    }

    /**
     * @param mobile the mobile to set
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * @return the dept
     */
    public int getDept() {
        return dept;
    }

    /**
     * @param dept the dept to set
     */
    public void setDept(int dept) {
        this.dept = dept;
    }

    /**
     * @return the realname
     */
    public String getRealname() {
        return realname;
    }

    /**
     * @param realname the realname to set
     */
    public void setRealname(String realname) {
        this.realname = realname;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getCreatUser() {
        return creatUser;
    }

    public void setCreatUser(String creatUser) {
        this.creatUser = creatUser;
    }

    public Date getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Date creatTime) {
        this.creatTime = creatTime;
    }

    public String getModifyUser() {
        return modifyUser;
    }

    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }


}