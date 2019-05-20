package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.MenuInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MenuInfoMapper {



    List<MenuInfo> list();
    List<MenuInfo> listByParentId(@Param("parentMenuIdList") List<Long> parentMenuIdList);



    List<MenuInfo> listMenuInfoByAccount(@Param("accountId") Long accountId);
}