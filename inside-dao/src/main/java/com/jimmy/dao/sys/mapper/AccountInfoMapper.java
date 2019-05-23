package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.AccountInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AccountInfoMapper {
    int insert(AccountInfo record);

    AccountInfo find(@Param("id") Long id);
    Integer countByDepartmentId(@Param("departmentId") Long departmentId);
    int update(AccountInfo record);

    AccountInfo findByLoginName(@Param("loginName") String loginName, @Param("type")Integer type);

    List<AccountInfo> listByDepartmentId(@Param("departmentId") Long departmentId, @Param("searchName") String searchName);
}