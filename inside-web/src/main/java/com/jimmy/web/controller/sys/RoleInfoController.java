package com.jimmy.web.controller.sys;

import com.jimmy.base.Page;
import com.jimmy.base.Result;
import com.jimmy.dao.sys.entity.RoleInfo;
import com.jimmy.dto.RoleInfoDTO;
import com.jimmy.service.sys.RoleInfoService;
import com.jimmy.sublimation.validate.anno.NotEmpty;
import com.jimmy.sublimation.validate.anno.NotNull;
import com.jimmy.sublimation.validate.anno.ParamValidate;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;

@Controller
@RequestMapping("/admin/sys/role")
public class RoleInfoController extends BaseController {
    @Autowired
    private RoleInfoService roleInfoService;


    @RequestMapping("/page")
    @ResponseBody
    public Result<Page<RoleInfo>> page(Integer pageSize, Integer pageNo) {
        Page<RoleInfo> page = roleInfoService.page(pageSize, pageNo);
        Result<Page<RoleInfo>> result = getResult(page, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }


    @RequestMapping("/deleted")
    @ResponseBody
    @ParamValidate
    public Result<Boolean> deleted(@NotEmpty("角色ID不能为空") Long[] ids) {
        roleInfoService.deleted(Arrays.asList(ids));
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/info")
    @ResponseBody
    @ParamValidate
    public Result<RoleInfoDTO> getRoleInfo(@NotNull("角色ID不能为空") Long id) {
        RoleInfoDTO roleInfoDTO = roleInfoService.findRoleDetail(id);
        Result<RoleInfoDTO> result = getResult(roleInfoDTO, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/save")
    @ResponseBody
    @ParamValidate
    public Result<Boolean> saveRoleInfo(@NotEmpty("角色信息不能为空") @RequestBody RoleInfoDTO roleInfoDTO) {
        Boolean bool = roleInfoService.save(roleInfoDTO.getRoleInfo(), roleInfoDTO.getMenuIdList());
        Result<Boolean> result = getResult(bool, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
}
