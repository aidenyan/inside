package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;
@Data
public class AccountInfo {
    private Long id;

    private Long departmentId;

    private Long personId;

    private String name;

    private String contactPhone;

    private String password;

    private Integer type;

    private Integer status;

    private Date loginTime;

    private String loginIp;

    private Integer errorNum;

    private Integer deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

}