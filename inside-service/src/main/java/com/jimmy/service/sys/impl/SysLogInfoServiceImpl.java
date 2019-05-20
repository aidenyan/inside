package com.jimmy.service.sys.impl;

import com.jimmy.base.Page;
import com.jimmy.dao.sys.entity.SysLogInfo;
import com.jimmy.dao.sys.entity.SysLogInfoWithBLOBs;
import com.jimmy.dao.sys.mapper.SysLogInfoMapper;
import com.jimmy.service.sys.SysLogInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.Date;

@Service
@Transactional(readOnly = true)
public class SysLogInfoServiceImpl implements SysLogInfoService {
    @Autowired
    private SysLogInfoMapper sysLogInfoMapper;

    @Override
    public Page<SysLogInfoWithBLOBs> page(Integer objType, Integer operationCode, Date startDate, Date endDate, String content, Integer pageSize, Integer currentPage) {
        Page<SysLogInfoWithBLOBs> page = new Page<>();
        page.setPageSize(pageSize);
        page.setPageNo(currentPage);
        Integer total = sysLogInfoMapper.count(objType, operationCode, endDate, startDate, content);
        page.setTotal(total);
        if (total > 0) {
            page.setResult(sysLogInfoMapper.list(objType, operationCode, endDate, startDate, content, page.getStartRow(), page.getPageSize()));
        }else{
            page.setResult(Collections.emptyList());
        }
        return page;
    }

    @Override
    public SysLogInfoWithBLOBs find(Long id) {
        Assert.notNull(id);

        return sysLogInfoMapper.find(id);
    }
}
