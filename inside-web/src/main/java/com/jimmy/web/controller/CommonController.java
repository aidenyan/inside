package com.jimmy.web.controller;

import com.jimmy.base.Result;
import com.jimmy.common.utils.EncryptUtils;
import com.jimmy.common.utils.StringUtils;
import com.jimmy.conts.AuthorityConst;
import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.MenuInfo;
import com.jimmy.dao.sys.entity.PersonInfo;
import com.jimmy.dao.sys.entity.SysArea;
import com.jimmy.dto.PasswordUpdateDTO;
import com.jimmy.service.account.AccountInfoService;
import com.jimmy.service.sys.MenuInfoService;
import com.jimmy.service.sys.PersonInfoService;
import com.jimmy.service.sys.SysAreaService;
import com.jimmy.sublimation.validate.anno.ParamValidate;
import com.jimmy.web.enums.ResultControllerEnum;
import com.jimmy.web.enums.ResultCoreEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/admin/common")
public class CommonController extends BaseController {
    @Autowired
    private SysAreaService sysAreaService;

    @Autowired
    private MenuInfoService menuInfoService;

    @Autowired
    private AccountInfoService accountInfoService;
    @Autowired
    private PersonInfoService personInfoService;


    @RequestMapping("/account/name")
    @ResponseBody
    public Result<String> accountName() {
        AccountInfo accountInfo = this.getAccountInfo();
        if (accountInfo == null) {
            return getResult(accountInfo.getName(), ResultCoreEnum.RESULT_AUTHORITY_NOT_ENOUGH);
        }
        Result<String> result = getResult(accountInfo.getName(), ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     * @param parentId
     * @return
     * @Description: 通过上级查询下级区域(不传查省份/直辖市)不传只查询省份列表
     * @return: String
     */
    @RequestMapping("/listByParentId")
    @ResponseBody
    public Result<List<SysArea>> listByParentId(Long parentId) {
        List<Long> parentIdList = null;
        if (parentId != null) {
            parentIdList = Arrays.asList(parentId);
        }
        Result<List<SysArea>> result = getResult(sysAreaService.listSysAreaByParent(parentIdList), ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/person/find_name")
    @ResponseBody
    public Result<String> findName() {
        AccountInfo accountInfo = this.getAccountInfo();
        PersonInfo personInfo = personInfoService.find(accountInfo.getPersonId());
        String personName = null;
        if (personInfo != null) {
            personName = personInfo.getName();
        }
        Result<String> result = getResult(personName, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/account/check_password")
    @ResponseBody
    public Result<Boolean> checkPassword(String password) {
        AccountInfo accountInfo = this.getAccountInfo();
        accountInfo = accountInfoService.find(accountInfo.getId());
        String passwordEncrypt = EncryptUtils.encryptMd5(password, AuthorityConst.USER_LOGIN_PASSWORD_SECRET);
        boolean resultBool = passwordEncrypt.equals(accountInfo.getPassword());
        Result<Boolean> result = getResult(resultBool, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/account/update")
    @ResponseBody
    public Result<Boolean> updateAccount(@RequestBody PasswordUpdateDTO passwordUpdateDto) {
        if (passwordUpdateDto == null) {
            return getResult(false, ResultCoreEnum.RESULT_PARAMETER_EXCEPTION);
        }
        AccountInfo accountInfo = this.getAccountInfo();
        accountInfo = accountInfoService.find(accountInfo.getId());
        String passwordEncrypt = EncryptUtils.encryptMd5(passwordUpdateDto.getOldPassword(), AuthorityConst.USER_LOGIN_PASSWORD_SECRET);
        boolean resultBool = passwordEncrypt.equals(accountInfo.getPassword());
        if (!resultBool) {
            return getResult(resultBool, ResultControllerEnum.RESULT_PASSWORD_ERROR);
        }
        AccountInfo updateAccount = new AccountInfo();
        updateAccount.setId(accountInfo.getId());
        updateAccount.setPassword(EncryptUtils.encryptMd5(passwordUpdateDto.getPassword(), AuthorityConst.USER_LOGIN_PASSWORD_SECRET));
        PersonInfo personInfo = null;
        if (StringUtils.isNoneBlank(passwordUpdateDto.getPersonName())) {
            personInfo = new PersonInfo();
            personInfo.setId(accountInfo.getPersonId());
            personInfo.setName(passwordUpdateDto.getPersonName());
        }
        accountInfoService.updatePersonInfo(updateAccount, personInfo);
        Result<Boolean> result = getResult(true, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }


    @RequestMapping("/list/menu_info")
    @ResponseBody
    @ParamValidate
    public Result<List<MenuInfo>> listMenuInfo() {
        List<MenuInfo> menuInfoList = menuInfoService.listAll();
        Result<List<MenuInfo>> result = getResult(menuInfoList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

}
