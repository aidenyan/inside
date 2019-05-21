package com.jimmy.service.account;

import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dto.DepartTreeInfoDTO;

import java.util.List;

public interface DepartmentInfoService {
    List<DepartTreeInfoDTO> listTree();

    List<DepartmentInfo> listDepartment(Long parentId,String departmentName);
}
