package com.jimmy.service.account;

import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.AccountRole;
import com.jimmy.dao.sys.entity.PersonInfo;
import com.jimmy.dao.sys.enums.AccountTypeEnum;

import java.util.List;


public interface AccountInfoService {

    AccountInfo getAccountInfoByName(String loginName, AccountTypeEnum type);

    AccountInfo find(Long id);

    boolean checkAccountPhone(String mobile, AccountTypeEnum type);

    Integer countByDepartmentId(Long departmentId);

    void updateAccountInfo(AccountInfo accountInfo);

    void deleteById(Long id);

    void updatePersonInfo(AccountInfo accountInfo, PersonInfo personInfo);
    void updatePersonInfo( PersonInfo personInfo);

    void save(AccountInfo accountInfo, PersonInfo personInfo, List<Long> roleIdList);

    List<AccountInfo> listByDepartmentId(Long departmentId, String searchName);

    List<AccountRole> listRoleAccountInfo(Long accountId);

    void updateAccountRole(List<Long> roleIdList, Long accountId);

    PersonInfo findPerson(Long personId);
}
