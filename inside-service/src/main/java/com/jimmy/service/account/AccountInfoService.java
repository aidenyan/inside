package com.jimmy.service.account;

import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.PersonInfo;
import com.jimmy.dao.sys.enums.AccountTypeEnum;

import java.util.List;


public interface AccountInfoService {

    AccountInfo getAccountInfoByName(String loginName, AccountTypeEnum type);

    AccountInfo find(Long id);

    Integer countByDepartmentId(Long departmentId);

    void updateAccountInfo(AccountInfo accountInfo);

    void updatePersonInfo(AccountInfo accountInfo, PersonInfo personInfo);

    List<AccountInfo> listByDepartmentId(Long departmentId, String searchName);
}
