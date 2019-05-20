package com.jimmy.service.core;


import com.jimmy.dao.sys.entity.AccountInfo;

import javax.servlet.http.Cookie;


/**
 * @author aiden
 * @date 2017/2/21
 */
public interface CookieService {
    /**
     * 将用户信息保存到cookie中
     *
     * @param accountInfo
     */
    public void updateOrAddAccountInfo(AccountInfo accountInfo);

    /**
     * 通过cookie获取用户信息
     *
     * @param cookies
     * @return
     */
    public AccountInfo getAccountInf(Cookie[] cookies);

}
