package com.jimmy.service.core;


import javax.servlet.http.Cookie;

/**
 * @author aiden
 * @date 2017/2/21
 */
public interface AuthorityUserInterceptor  {

    /**
     * 检查用户的信息同时保存用户的信息
     *
     * @param cookies
     */
    public void checkAndSaveUserInfo(Cookie[] cookies);
}
