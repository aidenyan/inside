package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;

@Data
public class DepartmentInfo {
    private Long id;

    private String departmentName;

    private String departmentShortName;

    private Integer areaId;

    private String address;

    private String fullAddress;

    private String legalPerson;

    private String contactTel;

    private String contactPhone;

    private String email;

    private String wechat;

    private String agentCode;

    private Integer level;

    private Long parentId;

    private String parentTree;

    private String remark;

    private Byte deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

    private Byte orgStatus;


}