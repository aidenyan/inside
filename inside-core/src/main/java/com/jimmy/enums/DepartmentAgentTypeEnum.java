package com.jimmy.enums;

public enum DepartmentAgentTypeEnum {
    TYPE_GROUP(1, "集团"),
    TYPE_COMPANY(2, "公司"),
    TYPE_DEPARTMENT(3, "部门"),;
    private Integer value;
    private String desc;

    private DepartmentAgentTypeEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
