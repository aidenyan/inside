package com.jimmy.web.controller.account;

import com.jimmy.base.PageReulst;
import com.jimmy.base.Result;
import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.RoleInfo;
import com.jimmy.service.account.AccountInfoService;
import com.jimmy.service.account.DepartmentInfoService;
import com.jimmy.service.sys.RoleInfoService;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;


@Controller
@RequestMapping("/admin/account")
public class AccountController extends BaseController {

    @Autowired
    private AccountInfoService accountInfoService;

    @Autowired
    private RoleInfoService roleInfoService;

    @Autowired
    private DepartmentInfoService departmentInfoService;


    @RequestMapping("/page")
    @ResponseBody
    public Result<PageReulst<AccountInfo>> page(Long orgId, String name, Integer pageNo, Integer pageSize) {
        this.setPage(pageNo, pageSize);
        List<AccountInfo> accountInfoList = accountInfoService.listByDepartmentId(orgId, name);
        Result<PageReulst<AccountInfo>> result = getPageResult(accountInfoList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }


    @RequestMapping("/role_list")
    @ResponseBody
    public Result<List<RoleInfo>> roleList() {
        List<RoleInfo> roleList = roleInfoService.listAll();//获取角色
        Result<List<RoleInfo>> result = getResult(roleList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
}
