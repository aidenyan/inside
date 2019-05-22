package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dao.sys.entity.SysLogInfoWithBLOBs;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Date;
import java.util.List;

public interface DepartmentInfoMapper {


    int insert(DepartmentInfo record);
    List<DepartmentInfo> list();
    DepartmentInfo find(@Param("id") Long id);

    int updateProperty(DepartmentInfo record);

    int update(DepartmentInfo record);

    List<DepartmentInfo> listByAgentCode(@Param("agentCode") String agentCode);
    Integer countByParentId(@Param("departmentId") Long departmentId);

    List<DepartmentInfo> listDepartment(@Param("parentId") Long parentId,@Param("departmentName") String departmentName);
}