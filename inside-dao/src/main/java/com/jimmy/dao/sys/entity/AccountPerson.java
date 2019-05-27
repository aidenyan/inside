package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;

@Data
public class AccountPerson {
    private Long id;
    private Long personId;
    private String name;
    private String personName;
    private String email;
    private String contactTel;
    private String orgName;
    private Integer status;
    private Date createTime;
    private Date modifyTime;
    private Long createId;
    private Long modifyId;
}
