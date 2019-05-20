package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;
@Data
public class PersonInfo {
    private Long id;

    private String name;

    private Integer gender;

    private Date birthTime;

    private Integer areaId;

    private String address;

    private String fullAddress;

    private String contactTel;

    private String contactPhone;

    private String email;

    private String wechat;

    private Integer personType;

    private Boolean deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

    private Long sourceId;

}