package com.jimmy.web.controller.login;

import com.jimmy.base.Result;
import com.jimmy.common.utils.DateUtils;
import com.jimmy.common.utils.EncryptUtils;
import com.jimmy.conts.AuthorityConst;
import com.jimmy.conts.SessionConst;
import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.MenuInfo;
import com.jimmy.dao.sys.enums.AccountStatusEnum;
import com.jimmy.dao.sys.enums.AccountTypeEnum;
import com.jimmy.service.core.CookieService;
import com.jimmy.service.account.AccountInfoService;
import com.jimmy.service.sys.MenuInfoService;
import com.jimmy.sublimation.validate.anno.NotEmpty;
import com.jimmy.sublimation.validate.anno.ParamValidate;
import com.jimmy.web.consts.ControllerConst;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author aiden
 * @date 2017/3/1
 */
@Controller
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private CookieService cookieService;
    @Autowired
    private MenuInfoService menuInfoService;
    @Autowired
    private AccountInfoService accountInfoService;


    @RequestMapping("/in")
    @ResponseBody
    @ParamValidate
    public Result<Void> login(@NotEmpty("用户名不能为空") String name, @NotEmpty("密码名不能为空") String password, HttpServletRequest request) {
        AccountInfo accountInfo = accountInfoService.getAccountInfoByName(name, AccountTypeEnum.ACCOUNT_TYPE_SYS_ADMIN.ACCOUNT_TYPE_SYS_ADMIN);
        Result<Void> result = null;
        request.getSession().invalidate();
        if (accountInfo == null) {
            result = new Result<Void>(ResultControllerEnum.RESULT_LOGIN_NOT_EXIT);
            return result;
        }
        if (AccountStatusEnum.ACCOUNT_STATUS_LOCK.getValue().equals(accountInfo.getStatus())) {
            result = new Result<Void>(ResultControllerEnum.RESULT_LOGIN_LOCK);
            return result;
        }
        if (AccountStatusEnum.ACCOUNT_STATUS_DISABLE.getValue().equals(accountInfo.getStatus())) {
            result = new Result<Void>(ResultControllerEnum.RESULT_LOGIN_DISABLE);
            return result;
        }
        String passwordEncrypt = EncryptUtils.encryptMd5(password, AuthorityConst.USER_LOGIN_PASSWORD_SECRET);
        if (!passwordEncrypt.equals(accountInfo.getPassword())) {
            result = new Result<Void>(ResultControllerEnum.RESULT_LOGIN_PASSWORD_ERROR);
            if (accountInfo.getErrorNum() != null && (ControllerConst.MAX_PASSWORD_ERROR_NUM - 1) == accountInfo.getErrorNum()) {
                accountInfo.setStatus(AccountStatusEnum.ACCOUNT_STATUS_LOCK.getValue());
            }
            accountInfoService.updateAccountInfo(accountInfo);
            return result;
        }
        result = new Result<Void>(ResultControllerEnum.RESULT_SUCCESS);
        /**
         * 将登陆信息保存到cookie中去
         */
        cookieService.updateOrAddAccountInfo(accountInfo);
        accountInfo.setLoginIp(request.getRemoteHost());
        accountInfo.setLoginTime(DateUtils.getCurrent());
        accountInfoService.updateAccountInfo(accountInfo);
        /**
         * 获取菜单信息保存
         */
        List<MenuInfo> menuInfoList = menuInfoService.listMenuInfoByAccount(accountInfo.getId());
        request.getSession().setAttribute(SessionConst.SESSION_USER_MENU_LIST, menuInfoList);
        request.getSession().setAttribute(SessionConst.SESSION_USER_LOGIN_INFO, accountInfo);
        return result;
    }

}
