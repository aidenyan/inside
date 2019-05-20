package com.jimmy.service.core.impl;


import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.local.UserLocalThread;
import com.jimmy.service.core.AuthorityUserInterceptor;
import com.jimmy.service.core.CookieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;

/**
 * @author aiden
 * @date 2017/2/21
 */
@Service("authorityUserInterceptorImpl")
@Transactional(readOnly = true)
public class AuthorityUserInterceptorImpl implements AuthorityUserInterceptor {
    @Autowired
    private CookieService cookieService;


    /**
     * 检查用户的信息同时保存用户的信息
     *
     * @param cookies
     */
    public void checkAndSaveUserInfo(Cookie[] cookies) {
        /**
         * 获取用户信息
         */
        AccountInfo accountInfo = cookieService.getAccountInf(cookies);
        if (accountInfo != null) {
            accountInfo.setPassword(null);
            UserLocalThread.setAccountInfo(accountInfo);
        } else {
            UserLocalThread.setAccountInfo(null);
        }
    }


}
