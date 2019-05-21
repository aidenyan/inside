package com.jimmy.exception;


/**
 * @author aiden
 * @date 2017/2/23
 */
public class ServiceException extends RuntimeException {
    private String code;
    private String message;
    private String desc;
    private Throwable e;

    public ServiceException() {
    }

    public ServiceException(String message, String code, String desc) {
        super(message);
        this.message = message;
        this.code = code;
        this.desc = desc;
    }

    public ServiceException(String message, Throwable e, String desc) {
        super(message, e);
        this.message = message;
        this.e = e;
        this.desc = desc;
    }

    public ServiceException(String message, String code, Throwable e, String desc) {
        super(message, e);
        this.message = message;
        this.code = code;
        this.e = e;
        this.desc = desc;
    }

    public ServiceException(String message, String desc) {
        super(message);
        this.desc = desc;
        this.message = message;

    }
    public ServiceException(String message) {
        super(message);
        this.desc = message;
        this.message = message;

    }
    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public ServiceException(Throwable e) {
        this.e = e;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Throwable getE() {
        return e;
    }

    public void setE(Throwable e) {
        this.e = e;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
