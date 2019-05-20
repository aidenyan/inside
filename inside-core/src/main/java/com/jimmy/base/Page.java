package com.jimmy.base;

import java.util.Collections;
import java.util.List;

/**
 * @author : aiden
 * @ClassName :  Page
 * @Description :
 * @date : 2019/1/31/031
 */
public class Page<T> {

    public final static Integer PAGE_SIZE_DEFAULT = 10;
    private int startRow;
    private int endRow;
    private Integer pageNo;
    private Integer pageSize;
    private List<T> result;
    private Integer totalPage;
    private Long total;


    public Integer getPageNo() {
        if (pageNo == null || pageNo < 1) {
            pageNo = 1;
        }
        if (pageNo > getTotalPage()) {
            pageNo = getTotalPage();
        }
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getTotalPage() {
        if (total == null || total == 0) {
            totalPage = 1;
        }
        totalPage = Math.toIntExact(total % getPageSize() == 0 ? total / getPageSize() : (total - total % getPageSize()) / getPageSize() + 1);
        return totalPage;
    }

    public void setTotalPage(Integer totalPage) {
        this.totalPage = totalPage;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public int getPageSize() {

        if (pageSize == null || pageSize <= 0) {
            pageSize = PAGE_SIZE_DEFAULT;
        }
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getStartRow() {
        pageNo = getPageNo();
        pageSize = getPageSize();
        startRow = (pageNo - 1) * pageSize;
        return startRow;
    }


    public int getEndRow() {
        if (pageNo <= 0) {
            pageNo = 1;
        }
        if (pageSize <= 0) {
            pageSize = PAGE_SIZE_DEFAULT;
        }
        endRow = pageNo * pageSize - 1;
        return endRow;
    }


    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }


    public List<T> getResult() {
        if (result == null) {
            result = Collections.emptyList();
        }
        return result;
    }

    public void setResult(List<T> result) {
        this.result = result;
    }
}
