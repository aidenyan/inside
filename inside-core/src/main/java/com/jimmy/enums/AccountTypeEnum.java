package com.jimmy.enums;

/**
 * @author aiden
 * @date 2017/3/1
 */
public enum AccountTypeEnum {
    ACCOUNT_TYPE_SYS_ADMIN(0, "系统管理员"),
    ACCOUNT_TYPE_MEMBER(1, "会员"),;
    private Integer value;
    private String desc;

    private AccountTypeEnum(Integer value, String desc) {
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
    public static AccountTypeEnum values(Integer value){

        for(AccountTypeEnum accountTypeEnum:AccountTypeEnum.values()){
            if(accountTypeEnum.getValue().equals(value)){
                return accountTypeEnum;
            }
        }
        return null;
    }
    }

