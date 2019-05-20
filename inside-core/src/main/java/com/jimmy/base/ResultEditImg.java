package com.jimmy.base;


import com.jimmy.web.enums.ResultEnum;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class ResultEditImg {
    private Integer error=0;
    private String message;
    private String url;

    public ResultEditImg() {
    }
    public ResultEditImg(ResultEnum resultEnum) {
        if (resultEnum != null) {
            if(!"0".equals(resultEnum.getCode())){
                error=1;
            }
            this.message = resultEnum.getMessage();
        }

    }

    public Integer getError() {
        return error;
    }

    public void setError(Integer error) {
        this.error = error;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
