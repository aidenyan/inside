package com.jimmy.service.account.impl;

import com.jimmy.common.utils.StringUtils;
import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dao.sys.mapper.DepartmentInfoMapper;
import com.jimmy.dto.DepartTreeInfoDTO;
import com.jimmy.exception.ParamterException;
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
            departTreeInfoDTO.setAgentType(departmentInfo.getAgentType());
            departTreeInfoDTO.setParentTree(departmentInfo.getParentTree());
            treeInfoDTOList.add(departTreeInfoDTO);
        }
        return treeInfoDTOList;
    }

    @Override
    public Boolean checkOrgCode(Long id, String agentCode) {
        if (StringUtils.isNotBlank(agentCode)) {
            throw new ParamterException();
        }
        DepartmentInfo checkDepartment = new DepartmentInfo();
        checkDepartment.setAgentCode(agentCode.trim());
        List<DepartmentInfo> listCompany = departmentInfoMapper.listByAgentCode(agentCode.trim());
        if (listCompany != null && listCompany.size() > 1) {
            throw new ParamterException("组织编号重复");
        } else if (listCompany != null && listCompany.size() == 1) {
            if (id != null && !id.equals(listCompany.get(0).getId())) {
                throw new ParamterException("组织编号重复");
            }
        }
        return true;
    }

    @Override
    public void save(DepartmentInfo departmentInfo) {
        departmentInfoMapper.insert(departmentInfo);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<DepartmentInfo> listDepartment(Long parentId, String departmentName) {
        return departmentInfoMapper.listDepartment(parentId, departmentName);
    }
}
