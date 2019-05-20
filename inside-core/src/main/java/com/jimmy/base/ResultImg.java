package com.jimmy.base;


import com.jimmy.web.enums.ResultEnum;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class ResultImg<T> {
    private String code;
    private String message;
    private T data;

    public ResultImg() {
    }

    public ResultImg(ResultEnum resultEnum) {
        if (resultEnum != null) {
            this.code = resultEnum.getCode();
            this.message = resultEnum.getMessage();
        }

    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
