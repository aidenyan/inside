package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.AccountRole;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AccountRoleMapper {
    int deleteByAccountId(@Param("accountId") Long accountId);

    int insert(AccountRole record);
    List<AccountRole> listByAccountId(Long accountId);




}