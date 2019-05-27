package com.jimmy.web.controller.account;

import com.jimmy.base.PageReulst;
import com.jimmy.base.Result;
import com.jimmy.common.utils.EncryptUtils;
import com.jimmy.conts.AuthorityConst;
import com.jimmy.dao.sys.entity.*;
import com.jimmy.dao.sys.enums.ObjTypeEnum;
import com.jimmy.dao.sys.enums.OperationEnum;
import com.jimmy.exception.ParamterException;
import com.jimmy.local.UserLocalThread;
import com.jimmy.service.account.AccountInfoService;
import com.jimmy.service.account.DepartmentInfoService;
import com.jimmy.service.sys.RoleInfoService;
import com.jimmy.spring.anno.LogInfo;
import com.jimmy.sublimation.validate.anno.NotNull;
import com.jimmy.sublimation.validate.anno.ParamValidate;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.dto.AccountDTO;
import com.jimmy.web.dto.AccountRoleDTO;
import com.jimmy.web.dto.RoleDTO;
import com.jimmy.web.enums.ResultControllerEnum;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

import static com.jimmy.dao.sys.enums.AccountTypeEnum.ACCOUNT_TYPE_SYS_ADMIN;


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
    public Result<PageReulst<AccountPerson>> page(Long orgId, String name, Integer pageNo, Integer pageSize) {
        this.setPage(pageNo, pageSize);
        List<AccountPerson> accountInfoList = accountInfoService.listByDepartmentId(orgId, name);
        Result<PageReulst<AccountPerson>> result = getPageResult(accountInfoList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     * @param
     * @return
     * @Description: 权限信息
     * @return: Result<AccountVO>
     */
    @RequestMapping("/authorityInfo")
    @ResponseBody
    public Result<AccountRoleDTO> authorityInfo(Long id) {
        List<RoleInfo> roleList = roleInfoService.listAll();//获取角色
        List<AccountRole> listRoleAccount = accountInfoService.listRoleAccountInfo(id);

        List<Long> roleIdList = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(listRoleAccount)) {
            listRoleAccount.forEach(accountRole -> roleIdList.add(accountRole.getRoleId()));
        }
        AccountRoleDTO accountRoleDTO = new AccountRoleDTO();
        accountRoleDTO.setRoleIdList(roleIdList);
        accountRoleDTO.setRoleInfoList(roleList);
        Result<AccountRoleDTO> result = getResult(accountRoleDTO, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/role_list")
    @ResponseBody
    public Result<List<RoleInfo>> roleList() {
        List<RoleInfo> roleList = roleInfoService.listAll();//获取角色
        Result<List<RoleInfo>> result = getResult(roleList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     * @param accountInfo
     * @return
     * @Description: 账户修改
     * @return: Result<Boolean>
     */
    @RequestMapping("/accountEdit")
    @ResponseBody
    @ParamValidate("updatePassword")
    @LogInfo(type = ObjTypeEnum.ACCOUNT, operation = OperationEnum.UPDATE,param = "accountInfo.id")
    public Result<Boolean> accountEdit(@RequestBody AccountInfo accountInfo) {
        if (accountInfo != null && accountInfo.getPassword() != null) {
            accountInfo.setPassword(EncryptUtils.encryptMd5(accountInfo.getPassword(), AuthorityConst.USER_LOGIN_PASSWORD_SECRET));
        }
        AccountInfo loginUser = UserLocalThread.get();
        if (loginUser == null) {
            throw new ParamterException("请先登录");
        }
        accountInfoService.updateAccountInfo(accountInfo);
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     * @param
     * @return
     * @Description: 保存账号信息
     * @return: Result<Boolean>
     */
    @RequestMapping("/save")
    @ResponseBody
    @ParamValidate("save")
    @LogInfo(type = ObjTypeEnum.ACCOUNT, operation = OperationEnum.SAVE)
    public Result<Boolean> save(@RequestBody AccountDTO accountDTO, BindingResult bindingResult) {

        Result<Boolean> result = null;
        AccountInfo accountInfo = accountDTO.getAccountInfo();
        accountInfo.setPassword(EncryptUtils.encryptMd5(accountInfo.getPassword(), AuthorityConst.USER_LOGIN_PASSWORD_SECRET));
        Long departmentId = accountInfo.getDepartmentId();
        DepartmentInfo departmentInfo = departmentInfoService.find(departmentId);
        if (departmentInfo != null) {
            result = getResult(Boolean.FALSE, ResultControllerEnum.RESULT_DEPARTMENT_ERROR);
            return result;
        }
        AccountInfo tempAccountInfo = accountInfoService.getAccountInfoByName(accountInfo.getName(), ACCOUNT_TYPE_SYS_ADMIN);
        if (tempAccountInfo != null) {
            result = getResult(Boolean.FALSE, ResultControllerEnum.RESULT_ACCOUNT_NAMECHECK);
            return result;
        }
        if (accountInfo.getContactPhone() != null && accountInfo.getContactPhone() != "") {
            boolean isExist = accountInfoService.checkAccountPhone(accountInfo.getContactPhone(), null);
            if (isExist) {
                result = getResult(Boolean.FALSE, ResultControllerEnum.RESULT_ACCOUNT_PHONECHECK);
                return result;
            }
        }
        PersonInfo personInfo = accountDTO.getPersonInfo();

        accountInfoService.save(accountInfo, personInfo, accountDTO.getRoleIdList());
        result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/updateRole")
    @ResponseBody
    @ParamValidate
    @LogInfo(type = ObjTypeEnum.ACCOUNT, operation = OperationEnum.UPDATE,param = "roleDTO.id")
    public Result<Boolean> accountEdit(@RequestBody RoleDTO roleDTO) {
        AccountInfo loginUser = UserLocalThread.get();
        if (loginUser == null) {
            throw new ParamterException("请先登录");
        }
        accountInfoService.updateAccountRole(roleDTO.getRoleIdList(), roleDTO.getId());
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/deleted")
    @ResponseBody
    @ParamValidate
    @LogInfo(type = ObjTypeEnum.ACCOUNT, operation = OperationEnum.DELETE, param = "id")
    public Result<Boolean> deleted(@NotNull("id不能未空") Long id) {
        AccountInfo loginUser = UserLocalThread.get();
        if (loginUser == null) {
            throw new ParamterException("请先登录");
        }
        accountInfoService.deleteById(id);
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/personInfo")
    @ResponseBody
    public Result<PersonInfo> personInfo(Long id) {
        PersonInfo person = accountInfoService.findPerson(id);

        Result<PersonInfo> result = getResult(person, ResultControllerEnum.RESULT_SUCCESS);
        return result;

    }

    @RequestMapping("/personInfoEdit")
    @ResponseBody
    @ParamValidate
    public Result<Boolean> personInfoEdit(@RequestBody PersonInfo personInfo, BindingResult bindingResult) {
        accountInfoService.updatePersonInfo(personInfo);
        Result<Boolean> result = getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;

    }
}
