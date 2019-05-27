package com.jimmy.enums;

/**
 * @author aiden
 * @date 2017/3/1
 */
public enum LogObjTypeEnum {
    ROLE(0, "角色"),
    ;
    private Integer value;
    private String desc;

    private LogObjTypeEnum(Integer value, String desc) {
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

    public static LogObjTypeEnum values(Integer value) {

        for (LogObjTypeEnum accountTypeEnum : LogObjTypeEnum.values()) {
            if (accountTypeEnum.getValue().equals(value)) {
                return accountTypeEnum;
            }
        }
        return null;
    }
}

