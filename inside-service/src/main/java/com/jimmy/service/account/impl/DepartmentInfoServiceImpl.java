package com.jimmy.service.account.impl;

import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dao.sys.mapper.DepartmentInfoMapper;
import com.jimmy.dto.DepartTreeInfoDTO;
import com.jimmy.service.account.DepartmentInfoService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DepartmentInfoServiceImpl implements DepartmentInfoService {

    @Autowired
    private DepartmentInfoMapper departmentInfoMapper;

    @Override
    public List<DepartTreeInfoDTO> listTree() {
        List<DepartmentInfo> departmentInfoList = departmentInfoMapper.list();
        if (CollectionUtils.isEmpty(departmentInfoList)) {
            return Collections.EMPTY_LIST;
        }
        List<DepartTreeInfoDTO> treeInfoDTOList = new ArrayList<>();
        DepartTreeInfoDTO departTreeInfoDTO = null;
        for (DepartmentInfo departmentInfo : departmentInfoList) {
            departTreeInfoDTO = new DepartTreeInfoDTO();
            departTreeInfoDTO.setId(departmentInfo.getId());
            departTreeInfoDTO.setLevel(departmentInfo.getLevel());
            departTreeInfoDTO.setName(departmentInfo.getDepartmentName());
            departTreeInfoDTO.setPId(departmentInfo.getParentId());
            departTreeInfoDTO.setParentTree(departmentInfo.getParentTree());
            treeInfoDTOList.add(departTreeInfoDTO);
        }
        return treeInfoDTOList;
    }
}
