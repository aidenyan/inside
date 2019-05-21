package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;

@Data
public class SiteInfo {
    private Long id;

    private String domain;

    private Integer parentId;

    private String parentTree;

    private Boolean childEnabled;

    private Long orgId;

    private Boolean deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;


}