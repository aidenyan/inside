package com.jimmy.base;



import com.jimmy.web.enums.ResultEnum;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class Result<T> {
    private String code;
    private String message;
    private T result;
    private List<String> authorityCodeList;
    private Map<String, Object> searchMap;
    private Object incidental;
    private Long siteId;

    public Result() {
    }

    public Object getIncidental() {
        return incidental;
    }

    public void setIncidental(Object incidental) {
        this.incidental = incidental;
    }

    public Result(ResultEnum resultEnum) {
        if (resultEnum != null) {
            this.code = resultEnum.getCode();
            this.message = resultEnum.getMessage();
        }

    }

    public Result(ResultEnum resultEnum, T result) {
        this(resultEnum);
        this.result = result;
    }

    public Result(ResultEnum resultEnum, T result, String message) {
        this(resultEnum);
        this.result = result;
        this.message = message;
    }

    public Result(ResultEnum resultEnum, String message) {
        this(resultEnum);
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getAuthorityCodeList() {
        return authorityCodeList;
    }

    public void setAuthorityCodeList(List<String> authorityCodeList) {
        this.authorityCodeList = authorityCodeList;
    }

    public Map<String, Object> getSearchMap() {
        return searchMap;
    }

    public void setSearchMap(Map<String, Object> searchMap) {
        this.searchMap = searchMap;
    }

    public void push(String key, Object value) {
        if (searchMap == null) {
            searchMap = new HashMap<String, Object>();
        }
        searchMap.put(key, value);
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }

}
