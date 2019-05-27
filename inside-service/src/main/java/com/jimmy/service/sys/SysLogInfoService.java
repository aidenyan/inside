package com.jimmy.service.sys;

import com.jimmy.annon.DisabledLog;
import com.jimmy.base.Page;
import com.jimmy.dao.sys.entity.SysLogInfoWithBLOBs;

import java.util.Date;

public interface SysLogInfoService {
    Page<SysLogInfoWithBLOBs> page(Integer objType, Integer operationCode, Date startDate, Date endDate,
                                   String content, Integer pageSize, Integer currentPage);

    SysLogInfoWithBLOBs find(Long id);
    @DisabledLog
    void save(SysLogInfoWithBLOBs sysLogInfoWithBLOBs);
}
