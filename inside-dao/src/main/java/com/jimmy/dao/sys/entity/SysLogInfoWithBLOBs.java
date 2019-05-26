package com.jimmy.dao.sys.entity;

import lombok.Data;

@Data
public class SysLogInfoWithBLOBs extends SysLogInfo {
    private String operationResult;

    private String operationDetail;

    private String objId;


}