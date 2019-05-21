package com.jimmy.dao.sys.mapper;


import com.jimmy.dao.sys.entity.SysArea;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

public interface SysAreaMapper {

    int delete(@Param("id") Long id, @Param("modifyId") Long modifyId);

    int insert(SysArea record);

    SysArea selectByPrimaryKey(Long id);

    List<SysArea> selectByFullName(@Param("fullName") String fullName);

    int update(SysArea record);

    // 只是用来查询各级别的地区，不传查询各省市和直辖市，传入查询该parentId下面的地区
    List<SysArea> listSysAreaByParent(@Param("parentIdList") List<Long> parentIdList);

    List<SysArea> listByIds(@Param("ids") List<Long> ids);

    List<SysArea> listAll();

    List<SysArea> listSelectArea(@Param("areaId") Long areaId);

    /**
     * 获取省份地址信息
     *
     * @return
     */
    List<SysArea> listProvince();

    List<SysArea> getAreaByAreaName(@Param("areaName") String areaName);

    List<SysArea> listSysAreaByFullName(@Param("areaSet") Set<String> areaSet);

    /**
     *
     * 根据上级id，查询下级所有市和区
     * 
     * @param parentId
     * @return
     *
     */
    String selectConcatAreaIds(@Param("parentId") Long parentId);

}