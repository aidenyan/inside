package com.jimmy.base;


import java.util.List;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class ResultData<T> {
    private String code;
    private String message;
    private T data;
    private Boolean nonBizError;

    public ResultData() {
    }
    public  ResultData(T t) {
          this.data=t;
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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Boolean getNonBizError() {
        return nonBizError;
    }

    public void setNonBizError(Boolean nonBizError) {
        this.nonBizError = nonBizError;
    }
}
