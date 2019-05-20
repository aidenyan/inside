package com.jimmy.web.controller.account;

import com.jimmy.base.Result;
import com.jimmy.dto.DepartTreeInfoDTO;
import com.jimmy.service.account.DepartmentInfoService;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/admin/account/department")
public class DepartmentController extends BaseController {

    @Autowired
    private DepartmentInfoService departmentInfoService;

    @RequestMapping("/tree")
    @ResponseBody
    public Result<List<DepartTreeInfoDTO>> treeCompanyOrg() {
        List<DepartTreeInfoDTO> list = departmentInfoService.listTree();
        Result<List<DepartTreeInfoDTO>> result = getResult(list, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
}
