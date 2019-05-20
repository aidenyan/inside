package com.jimmy.dao.sys.enums;

/**
 * @author aiden
 * @date 2017/3/1
 */
public enum AccountStatusEnum {
    ACCOUNT_STATUS_DISABLE(1, "禁用"),
    ACCOUNT_STATUS_USING(0, "启用"),
    ACCOUNT_STATUS_LOCK(2, "锁足");
    private Integer value;
    private String desc;

    private AccountStatusEnum(Integer value, String desc) {
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
