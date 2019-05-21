package com.jimmy.service.sys;



import com.jimmy.dao.sys.entity.SysArea;

import java.util.List;
import java.util.Map;

public interface SysAreaService {

    Boolean delete(Long id, Long modifyId);

    Boolean batchDelete(List<Long> ids, Long modifyId);

    Boolean insert(SysArea record);

    SysArea selectByPrimaryKey(Long id);

    Boolean update(SysArea record);

    // 只是用来查询各级别的地区，不传查询各省市和直辖市，传入查询该parentId下面的地区
    List<SysArea> listSysAreaByParent(List<Long> parentIdList);

    List<SysArea> listByIds(List<Long> ids);

    List<SysArea> listAll();

    List<SysArea> listSelectArea(Long areaId);

    /**
     * 获取省份地址信息
     *
     * @return
     */
    List<SysArea> listProvince();

    List<SysArea> getAreaByAreaName(String areaName);

    Map<String, String> getAreaInfo(Long areaId);

    List<SysArea> selectByFullName(String fullName);

    /**
     *
     * 根据上级id，查询下级所有市和区
     * 
     * @param parentId
     * @return
     *
     */
    String selectConcatAreaIds(Long parentId);

}
