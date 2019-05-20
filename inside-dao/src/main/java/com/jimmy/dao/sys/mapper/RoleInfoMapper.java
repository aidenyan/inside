package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.RoleInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoleInfoMapper {


    int insert(RoleInfo record);
    int count();
    List<RoleInfo> list(@Param("startRow") Integer startRow,@Param("pageSize") Integer pageSize);
    RoleInfo find(@Param("id") Long id);
    int update(RoleInfo record);
    int deleted(@Param("idList")List<Long> idList);
}