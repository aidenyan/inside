package com.jimmy.base;

import java.util.List;

/**
 * @author aiden
 * @date 2017/3/7
 */
public class PageReulst<T> {
    public static final Integer PAGE_SIZE_DEFAULT=1;
    private Integer pageNo;
    private Integer pageSize;
    private List<T> result;
    private Integer totalPage;
    private Long total;


    public Integer getPageNo() {
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public List<T> getResult() {
        return result;
    }

    public void setResult(List<T> result) {
        this.result = result;
    }

    public Integer getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(Integer totalPage) {
        this.totalPage = totalPage;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
