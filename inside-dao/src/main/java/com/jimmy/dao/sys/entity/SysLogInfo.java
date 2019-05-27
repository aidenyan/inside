package com.jimmy.dao.sys.entity;

import lombok.Data;

import java.util.Date;
@Data
public class SysLogInfo {
    private Long id;

    private String operationContent;

    private String operationCode;

    private Byte logType;

    private String operationIp;

    private String operationToken;

    private String sign;

    private Integer objType;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

    private String operationName;

}