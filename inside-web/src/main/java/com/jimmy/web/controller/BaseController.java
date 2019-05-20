package com.jimmy.web.controller;

import com.jimmy.base.Result;
import com.jimmy.conts.SessionConst;
import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.MenuInfo;
import com.jimmy.local.RequestLocalThread;
import com.jimmy.local.UserLocalThread;
import com.jimmy.service.sys.MenuInfoService;
import com.jimmy.web.enums.ResultEnum;
import com.jimmy.web.mvc.DateEditor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class BaseController {
    @Autowired
    private MenuInfoService menuInfoService;

    public List<MenuInfo> getMenuList() {
        HttpServletRequest request = RequestLocalThread.get();
        if (request != null) {
            List<MenuInfo> menuInfoList = (List<MenuInfo>) request.getSession().getAttribute(SessionConst.SESSION_USER_MENU_LIST);
            if (menuInfoList == null) {
                menuInfoList = menuInfoService.listMenuInfoByAccount(this.getAccountId());
                request.getSession().setAttribute(SessionConst.SESSION_USER_MENU_LIST, menuInfoList);
            }
            return menuInfoList;
        }
        return null;
    }

    public AccountInfo getAccountInfo() {
        return UserLocalThread.get();
    }
    public <T> Result<T> getResult(T t, ResultEnum resultEnum) {
        Result<T> result = new Result<T>(resultEnum);
        result.setResult(t);
        return addAuthorityCodeList(result);
    }
    public <T> Result<T> addAuthorityCodeList(Result<T> result) {

            List<MenuInfo> menuInfoList = getMenuList();
            List<String> authorityCodeList = new ArrayList<String>();
            for (MenuInfo tempMenuInfo : menuInfoList) {
                authorityCodeList.add(tempMenuInfo.getCode());
            }
            result.setAuthorityCodeList(authorityCodeList);

        return result;
    }
    public Long getAccountId() {
        AccountInfo accountInfo = getAccountInfo();
        if (accountInfo != null) {
            return accountInfo.getId();
        }
        return null;
    }

    @InitBinder
    protected void initBinder(HttpServletRequest request,
                              ServletRequestDataBinder binder) throws Exception {
        //对于需要转换为Date类型的属性，使用DateEditor进行处理
        binder.registerCustomEditor(Date.class, new DateEditor());
    }
}
