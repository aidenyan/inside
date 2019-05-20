package com.jimmy.service.account;

import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.PersonInfo;
import com.jimmy.dao.sys.enums.AccountTypeEnum;


public interface AccountInfoService {

    AccountInfo getAccountInfoByName(String loginName, AccountTypeEnum type);

    AccountInfo find(Long id);

    void updateAccountInfo(AccountInfo accountInfo);

    void updatePersonInfo(AccountInfo accountInfo, PersonInfo personInfo);
}
