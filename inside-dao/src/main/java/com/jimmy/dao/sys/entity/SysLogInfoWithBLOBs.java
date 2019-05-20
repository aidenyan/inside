package com.jimmy.dao.sys.entity;

public class SysLogInfoWithBLOBs extends SysLogInfo {
    private String operationResult;

    private String operationDetail;

    private byte[] objId;

    public String getOperationResult() {
        return operationResult;
    }

    public void setOperationResult(String operationResult) {
        this.operationResult = operationResult == null ? null : operationResult.trim();
    }

    public String getOperationDetail() {
        return operationDetail;
    }

    public void setOperationDetail(String operationDetail) {
        this.operationDetail = operationDetail == null ? null : operationDetail.trim();
    }

    public byte[] getObjId() {
        return objId;
    }

    public void setObjId(byte[] objId) {
        this.objId = objId;
    }
}