package com.jimmy.service.account.impl;

import com.jimmy.common.utils.StringUtils;
import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.PersonInfo;
import com.jimmy.dao.sys.enums.AccountTypeEnum;
import com.jimmy.dao.sys.mapper.AccountInfoMapper;
import com.jimmy.service.account.AccountInfoService;
import com.jimmy.service.sys.PersonInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AccountInfoServiceImpl implements AccountInfoService {
    @Autowired
    private AccountInfoMapper accountInfoMapper;

    @Autowired
    private PersonInfoService personInfoService;

    @Override
    public AccountInfo getAccountInfoByName(String loginName, AccountTypeEnum type) {
        Assert.isTrue(StringUtils.isNotBlank(loginName));
        Assert.notNull(type);
        return accountInfoMapper.findByLoginName(loginName, type.getValue());
    }

    @Override
    public AccountInfo find(Long id) {
        Assert.notNull(id);
        return accountInfoMapper.find(id);
    }

    @Override
    public Integer countByDepartmentId(Long departmentId) {
        Assert.notNull(departmentId);
        return accountInfoMapper.countByDepartmentId(departmentId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAccountInfo(AccountInfo accountInfo) {
        Assert.notNull(accountInfo);
        if (accountInfo.getId() != null) {
            accountInfoMapper.update(accountInfo);
        } else {
            accountInfoMapper.insert(accountInfo);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePersonInfo(AccountInfo accountInfo, PersonInfo personInfo) {
        Assert.notNull(accountInfo);
        if (personInfo != null) {
            personInfoService.saveOrUpdate(personInfo);
        }
        accountInfo.setPersonId(personInfo.getId());
        updateAccountInfo(accountInfo);

    }

    @Override
    public List<AccountInfo> listByDepartmentId(Long departmentId, String searchName) {
        Assert.notNull(departmentId);
        if (StringUtils.isBlank(searchName)) {
            searchName = null;
        }
        return accountInfoMapper.listByDepartmentId(departmentId, searchName);
    }


}
