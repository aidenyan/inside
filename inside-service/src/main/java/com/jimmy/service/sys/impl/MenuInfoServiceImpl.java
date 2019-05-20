package com.jimmy.service.sys.impl;

import com.jimmy.dao.sys.entity.MenuInfo;
import com.jimmy.dao.sys.mapper.MenuInfoMapper;
import com.jimmy.service.sys.MenuInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MenuInfoServiceImpl implements MenuInfoService {
    @Autowired
    private MenuInfoMapper menuInfoMapper;
    @Override
    public List<MenuInfo> listMenuInfoByAccount(Long accountId) {
        Assert.notNull(accountId);
        return menuInfoMapper.listMenuInfoByAccount(accountId);
    }

    @Override
    public List<MenuInfo> listAll() {
        return menuInfoMapper.list();
    }
}
