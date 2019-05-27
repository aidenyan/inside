package com.jimmy.service.sys;

import com.jimmy.dto.SysConfigDTO;

/**
 * Created by Administrator on 2019/5/27/027.
 */
public interface SysConfigService {

    SysConfigDTO find();

    void save(SysConfigDTO sysConfigDTO);
}
