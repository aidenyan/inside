package com.jimmy.enums;

/**
 * @author aiden
 * @date 2017/3/1
 */
public enum LogTypeEnum {
    ADD(0, "增加"),
    DELETED(1, "删除"),
    UPDATE(2, "修改"),
    ;
    private Integer value;
    private String desc;

    private LogTypeEnum(Integer value, String desc) {
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
    public static LogTypeEnum values(Integer value){

        for(LogTypeEnum accountTypeEnum: LogTypeEnum.values()){
            if(accountTypeEnum.getValue().equals(value)){
                return accountTypeEnum;
            }
        }
        return null;
    }
    }

