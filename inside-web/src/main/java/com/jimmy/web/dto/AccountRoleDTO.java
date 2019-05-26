package com.jimmy.web.dto;

import com.jimmy.dao.sys.entity.RoleInfo;
import lombok.Data;

import java.util.List;

@Data
public class AccountRoleDTO {
    private List<RoleInfo> roleInfoList;
    private List<Long> roleIdList;
}
