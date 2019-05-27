package com.jimmy.web.enums;


import com.jimmy.enums.ResultEnum;

/**
 * @author aiden
 * @date 2017/3/1
 */
public enum ResultControllerEnum implements ResultEnum {
    RESULT_SUCCESS("0", "成功"),
    RESULT_FAIL("-1", "失败"),
    RESULT_LOGIN_NOT_EXIT("-20001", "账号不存在"),
    RESULT_LOGIN_PASSWORD_ERROR("-20002", "密码错误，超过五次错误将被锁住！"),
    RESULT_LOGIN_LOCK("-20003", "用户账号已经被锁请联系管理员！"),
    RESULT_LOGIN_DISABLE("-2004", "用户账号已经禁用请联系管理员！"),
    RESULT_PASSWORD_ERROR("-2005", "原来的密码错误！"),
	RESULT_ACCOUNT_NAMECHECK("-2006", "用户账号重复"),
	RESULT_ACCOUNT_PHONECHECK("-2007", "用户手机重复"),
	RESULT_DEPARTMENT_ERROR("-2008", "对应的组织机构不存在"),
	RESULT_SYSMODEL_CODECHECK("-2009", "模板编号重复"),
	RESULT_COMPANYORG_DELETECHECK("-2010", "无法删除，该组织下存在子组织或用户"),
	RESULT_POSITION_DELETECHECK("-2011", "无法删除，该职位已有用户在使用");
    private String code;
    private String message;
    private String desc;

    private ResultControllerEnum(String code, String message, String desc) {
        this.code = code;
        this.message = message;
        this.desc = desc;
    }

    private ResultControllerEnum(String code, String message) {
        this.desc = message;
        this.code = code;
        this.message = message;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
