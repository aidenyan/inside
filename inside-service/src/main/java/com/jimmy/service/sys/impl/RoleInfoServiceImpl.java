package com.jimmy.service.sys.impl;

import com.jimmy.base.Page;
import com.jimmy.dao.sys.entity.MenuInfo;
import com.jimmy.dao.sys.entity.RoleInfo;
import com.jimmy.dao.sys.entity.RoleMenu;
import com.jimmy.dao.sys.mapper.MenuInfoMapper;
import com.jimmy.dao.sys.mapper.RoleInfoMapper;
import com.jimmy.dao.sys.mapper.RoleMenuMapper;
import com.jimmy.dto.RoleInfoDTO;
import com.jimmy.service.sys.RoleInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class RoleInfoServiceImpl implements RoleInfoService {
    @Autowired
    private RoleInfoMapper roleInfoMapper;
    @Autowired
    private RoleMenuMapper roleMenuMapper;
    @Autowired
    private MenuInfoMapper menuInfoMapper;

    @Override
    public Page<RoleInfo> page(Integer pageSize, Integer currentPage) {
        Page<RoleInfo> page = new Page<>();
        page.setPageSize(pageSize);
        page.setPageNo(currentPage);
        Integer total = roleInfoMapper.count();
        page.setTotal(total);
        if (total > 0) {
            page.setResult(roleInfoMapper.list(page.getStartRow(), page.getPageSize()));
        } else {
            page.setResult(Collections.emptyList());
        }
        return page;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleted(List<Long> idList) {
        Assert.notEmpty(idList);
        roleInfoMapper.deleted(idList);
    }

    @Override
    public RoleInfo find(Long id) {
        Assert.notNull(id);
        return roleInfoMapper.find(id);
    }

    @Override
    public RoleInfoDTO findRoleDetail(Long id) {
        RoleInfoDTO roleInfoDTO=new RoleInfoDTO();
        roleInfoDTO.setRoleInfo(find(id));
        roleInfoDTO.setMenuIdList(roleMenuMapper.listMenuId(id));
        return roleInfoDTO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(RoleInfo roleInfo, List<Long> menuIdList) {
        Assert.notNull(roleInfo);
        Assert.notEmpty(menuIdList);
        if (roleInfo.getId() == null) {
            roleInfoMapper.insert(roleInfo);
        } else {
            roleInfoMapper.update(roleInfo);
        }
        roleMenuMapper.deleted(roleInfo.getId());
        List<MenuInfo> menuInfoList = menuInfoMapper.listByParentId(menuIdList);
        Set<Long> menuIdSet = new HashSet<>();
        menuIdSet.addAll(menuIdList);
        if (org.apache.commons.collections.CollectionUtils.isNotEmpty(menuInfoList)) {
            menuInfoList.forEach(menuInfo -> {
                menuIdSet.add(menuInfo.getId());
            });
        }
        RoleMenu roleMenu = null;
        for (Long menuId : menuIdSet) {
            roleMenu = new RoleMenu();
            roleMenu.setMenuId(menuId);
            roleMenu.setRoleId(roleInfo.getId());
            roleMenuMapper.insert(roleMenu);
        }
        return Boolean.TRUE;
    }
}
