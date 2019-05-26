package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.AccountPerson;
import com.jimmy.dao.sys.enums.AccountTypeEnum;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AccountInfoMapper {
    int insert(AccountInfo record);

    AccountInfo find(@Param("id") Long id);
    Integer countByDepartmentId(@Param("departmentId") Long departmentId);
    int update(AccountInfo record);
    AccountInfo findAccountPhone(@Param("mobile")String mobile,@Param("type") Integer type);

    AccountInfo findByLoginName(@Param("loginName") String loginName, @Param("type")Integer type);
    void deleteById(@Param("id")Long id);
    List<AccountPerson> listByDepartmentId(@Param("departmentId") Long departmentId, @Param("searchName") String searchName);
}