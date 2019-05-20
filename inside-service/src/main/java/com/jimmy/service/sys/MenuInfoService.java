package com.jimmy.service.sys;

import com.jimmy.dao.sys.entity.MenuInfo;

import java.util.List;


public interface MenuInfoService {

    List<MenuInfo> listMenuInfoByAccount(Long accountId);

    List<MenuInfo> listAll();

}
