package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.SysConfig;

import java.util.List;

public interface SysConfigMapper {
    int deleted();

    int insert(SysConfig record);

    List<SysConfig> list();

    int update(SysConfig sysConfig);


}