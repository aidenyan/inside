package com.jimmy.service.sys;

import com.jimmy.base.Page;
import com.jimmy.dao.sys.entity.RoleInfo;
import com.jimmy.dto.RoleInfoDTO;

import java.util.List;


public interface RoleInfoService {

    Page<RoleInfo> page(Integer pageSize, Integer currentPage);

    void deleted(List<Long> idList);

    RoleInfo find(Long id);

    RoleInfoDTO findRoleDetail(Long id);

    List<RoleInfo> listAll();

    boolean save(RoleInfo roleInfo, List<Long> menuIdList);


}
