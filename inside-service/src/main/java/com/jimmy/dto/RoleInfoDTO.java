package com.jimmy.dto;


import com.jimmy.dao.sys.entity.RoleInfo;
import com.jimmy.sublimation.validate.anno.NotEmpty;
import com.jimmy.sublimation.validate.anno.NotNull;

import java.util.List;

/**
 * 角色的详细信息
 *
 * @author aiden
 * @date 2017/3/6
 */
public class RoleInfoDTO {

    @NotNull("角色不能为空")
    private RoleInfo roleInfo;
    @NotEmpty("角色ID列表不能为空")
    private List<Long> menuIdList;

    public RoleInfo getRoleInfo() {
        return roleInfo;
    }

    public void setRoleInfo(RoleInfo roleInfo) {
        this.roleInfo = roleInfo;
    }


    public List<Long> getMenuIdList() {
        return menuIdList;
    }

    public void setMenuIdList(List<Long> menuIdList) {
        this.menuIdList = menuIdList;
    }
}
