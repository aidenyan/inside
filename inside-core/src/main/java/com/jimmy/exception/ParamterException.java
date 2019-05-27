package com.jimmy.exception;


import com.jimmy.enums.ResultCoreEnum;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class ParamterException extends RuntimeException {
    private String code;
    private String message;
    private Throwable e;

    public ParamterException() {
    }

    public ParamterException(String message, String code) {
        super(message);
        this.message = message;
        this.code = code;
    }

    public ParamterException(String message, Throwable e) {
        super(message, e);
        this.message = message;
        this.e = e;
    }

    public ParamterException(String message, String code, Throwable e) {
        super(message, e);
        this.message = message;
        this.code = code;
        this.e = e;
    }

    public ParamterException(Throwable e) {
        super(ResultCoreEnum.RESULT_PARAMETER_EXCEPTION.getMessage(), e);
        this.message = ResultCoreEnum.RESULT_PARAMETER_EXCEPTION.getMessage();
        this.code = ResultCoreEnum.RESULT_PARAMETER_EXCEPTION.getCode();
        this.e = e;
    }
    public ParamterException(String message) {
        super(message);
        this.message =message;
        this.code = ResultCoreEnum.RESULT_PARAMETER_EXCEPTION.getCode();
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

