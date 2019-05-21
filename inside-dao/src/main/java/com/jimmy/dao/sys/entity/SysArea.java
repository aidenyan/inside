package com.jimmy.dao.sys.entity;


import lombok.Data;

import java.util.Date;

@Data
public class SysArea {

    private String name;

    private String code;

    private String fullName;

    private Long parentId;

    private String parentTree;

    private Integer orders;
    private Date createTime;
    private Date modifyTime;
    private Long createId;
    private Long modifyId;
    private Long id;
    private Boolean deleted = false;


}