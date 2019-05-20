package com.jimmy.web.enums;

/**
 * @author aiden
 * @date 2017/3/1
 */
public interface ResultEnum {
    public String getCode();

    public void setCode(String code);

    /**
     * 对外提示信息
     *
     * @return
     */
    public String getMessage();

    public void setMessage(String message);

    /**
     * 异常描述信息
     *
     * @return
     */
    public String getDesc();

    public void setDesc(String desc);
}
