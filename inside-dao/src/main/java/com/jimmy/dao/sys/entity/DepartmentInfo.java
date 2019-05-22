package com.jimmy.dao.sys.entity;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Date;

@Data
public class DepartmentInfo {
    private Long id;
    @Pattern(regexp = "[\u4e00-\u9fa5]{4,20}", message = "组织名称格式不正确，只能为4到20位中文")
    private String departmentName;
    @Pattern(regexp = "[\u4e00-\u9fa5]{2,10}", message = "组织简称格式不正确，只能为2到10位中文")
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

    private Byte deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

    private Byte orgStatus;


}