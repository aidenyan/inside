package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.SysLogInfoWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface SysLogInfoMapper {


    int insert(SysLogInfoWithBLOBs record);

    SysLogInfoWithBLOBs find(@Param("id") Long id);

    int update(SysLogInfoWithBLOBs record);

    int count(@Param("objType") Integer objType,
              @Param("logType") Integer logType,
              @Param("endDate") Date endDate,
              @Param("startDate") Date startDate,
              @Param("content") String content
    );

    List<SysLogInfoWithBLOBs> list(@Param("objType") Integer objType,
                                   @Param("logType") Integer logType,
                                   @Param("endDate") Date endDate,
                                   @Param("startDate") Date startDate,
                                   @Param("content") String content,
                                   @Param("startRow") Integer startRow,
                                   @Param("pageSize") Integer pageSize
    );
}