package com.jimmy.dao.sys.entity;

import lombok.Data;

import javax.validation.constraints.NotNull;

import java.util.Date;

@Data
public class DepartmentInfo {
    private Long id;
    @NotNull(message = "组织名称并能为空")
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
    @NotNull(message = "组织类型不能为空")
    private Integer agentType;

    private Integer level;

    private Long parentId;

    private String parentTree;

    private String remark;

    private Boolean deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

    private Integer orgStatus;


}