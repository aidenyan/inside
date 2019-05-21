package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.SiteInfo;

public interface SiteInfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SiteInfo record);

    int insertSelective(SiteInfo record);

    SiteInfo selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SiteInfo record);

    int updateByPrimaryKey(SiteInfo record);
}