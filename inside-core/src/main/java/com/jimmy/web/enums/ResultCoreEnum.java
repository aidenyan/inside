package com.jimmy.web.enums;

/**
 * @author aiden
 * @date 2017/2/21
 */
public enum ResultCoreEnum implements ResultEnum {
    RESULT_EXCEPTION_SYS("-10001", "系统异常","系统异常"),
    RESULT_AUTHORITY_NOT_ENOUGH("-10002", "权限不足","权限不足"),
    RESULT_PARAMETER_EXCEPTION("-10003", "参数异常","参数异常");
    private String code;
    private String message;
    private String desc;

    private ResultCoreEnum(String code, String message,String desc) {
        this.code = code;
        this.message = message;
        this.desc=desc;
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
