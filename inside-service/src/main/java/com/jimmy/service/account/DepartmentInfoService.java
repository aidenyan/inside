package com.jimmy.service.account;

import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dto.DepartTreeInfoDTO;

import java.util.List;

public interface DepartmentInfoService {
    List<DepartTreeInfoDTO> listTree();
    Boolean checkOrgCode(Long id, String agentCode);
    void save(DepartmentInfo departmentInfo);
    void update(DepartmentInfo departmentInfo);
    DepartmentInfo find(Long id);
    Boolean checkDelete(Long id);
    Boolean delete(Long id);
    List<DepartmentInfo> listDepartment(Long parentId,String departmentName);
}
