package com.jimmy.excepition;


import com.jimmy.enums.ResultServiceEnum;
import com.jimmy.exception.ServiceException;

/**
 * @author aiden
 * @date 2017/3/6
 */
public class ServiceDataException extends ServiceException {
    private String code;
    private String message;

    private Throwable e;
    private String desc;

    public ServiceDataException() {
    }

    public ServiceDataException(String message){
        super(message);
        this.message=message;
    }

    public ServiceDataException(String message, String code, String desc) {
        super(message, desc);
        this.message = message;
        this.code = code;
        this.desc = desc;
    }

    public ServiceDataException(String message, Throwable e, String desc) {
        super(message, e, desc);
        this.message = message;
        this.desc = desc;
        this.e = e;
    }

    public ServiceDataException(String message, String code, Throwable e, String desc) {
        super(message, e, desc);
        this.message = message;
        this.code = code;
        this.desc = desc;
        this.e = e;
    }

    public ServiceDataException(String message, String desc) {
        super(message, desc);
        this.desc = desc;
        this.message = message;
    }

    public ServiceDataException(ResultServiceEnum resultServiceEnum) {
        super(resultServiceEnum.getMessage(), resultServiceEnum.getDesc());
        this.message = resultServiceEnum.getMessage();
        this.desc = resultServiceEnum.getDesc();
        this.code = resultServiceEnum.getCode();
    }

    @Override
    public String getDesc() {
        return desc;
    }

    @Override
    public void setDesc(String desc) {
        this.desc = desc;
    }

    public ServiceDataException(Throwable e) {
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
