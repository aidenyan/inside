package com.jimmy.web.controller.account;


import com.jimmy.base.PageReulst;
import com.jimmy.base.Result;
import com.jimmy.dao.sys.entity.DepartmentInfo;
import com.jimmy.dto.DepartTreeInfoDTO;
import com.jimmy.service.account.DepartmentInfoService;
import com.jimmy.validate.Validator;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
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

    /**
     * @return
     * @Description: 查询机构组织
     * @return: Result<List<DepartmentInfo>>
     */
    @RequestMapping("/page")
    @ResponseBody
    public Result<PageReulst<DepartmentInfo>> listCompanyOrg(Long parentId, String departmentName, Integer pageNo, Integer pageSize) {
        this.setPage(pageNo, pageSize);
        List<DepartmentInfo> list = departmentInfoService.listDepartment(parentId, departmentName);
        Result<PageReulst<DepartmentInfo>> result = getPageResult(list, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     * @return
     * @Description: 新增组织
     * @return: Result<List<CompanyOrg>>
     */
    @RequestMapping("/save")
    @ResponseBody
    public Result<Boolean> saveCompanyOrg(@Valid DepartmentInfo departmentInfo, BindingResult bindingResult) {
        Validator.checkErrors(bindingResult);
        departmentInfoService.checkOrgCode(departmentInfo.getId(), departmentInfo.getAgentCode());
        departmentInfoService.save(departmentInfo);
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/update")
    @ResponseBody
    public Result<Boolean> update(@Valid DepartmentInfo departmentInfo, BindingResult bindingResult) {
        Validator.checkErrors(bindingResult);
        departmentInfoService.checkOrgCode(departmentInfo.getId(), departmentInfo.getAgentCode());
        departmentInfoService.update(departmentInfo);
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }


    @RequestMapping("/info")
    @ResponseBody
    public Result<DepartmentInfo> info(Long id) {
        DepartmentInfo departmentInfo = departmentInfoService.find(id);
        Result<DepartmentInfo> result = getResult(departmentInfo, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
    @RequestMapping("/delete")
    @ResponseBody
    public Result<Boolean> deleteCompanyOrg(Long id) {
        Boolean flag = departmentInfoService.checkDelete(id);
        Result<Boolean> result = null;
        if (!flag) {
            result = getResult(flag, ResultControllerEnum.RESULT_COMPANYORG_DELETECHECK);
        } else {
            flag = departmentInfoService.delete(id);
            result = getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        }
        return result;
    }
}
