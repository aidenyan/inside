package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;
@Data
public class MenuInfo {
    private Long id;

    private String urlPath;

    private String code;

    private Integer menuType;

    private Short parentMenuId;

    private String name;

    private String menuUrl;

    private Integer menuLevel;

    private Short orderNum;

    private Boolean deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

}