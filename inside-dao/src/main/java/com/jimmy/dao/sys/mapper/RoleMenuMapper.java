package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.RoleMenu;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoleMenuMapper {
    int deleted(@Param("roleId") Long roleId);
    List<Long> listMenuId(@Param("roleId") Long roleId);
    int insert(RoleMenu roleMenu);

}