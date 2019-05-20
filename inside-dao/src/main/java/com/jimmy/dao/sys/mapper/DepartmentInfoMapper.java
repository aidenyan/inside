package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dao.sys.entity.SysLogInfoWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface DepartmentInfoMapper {


    int insert(DepartmentInfo record);
    List<DepartmentInfo> list();
    DepartmentInfo find(@Param("id") Long id);

    int updateProperty(DepartmentInfo record);

    int update(DepartmentInfo record);

    int countDepartment(@Param("departmentName") String departmentName
    );

    List<DepartmentInfo> listDepartment(@Param("departmentName") String departmentName,

                                   @Param("startRow") Integer startRow,
                                   @Param("pageSize") Integer pageSize
    );
}