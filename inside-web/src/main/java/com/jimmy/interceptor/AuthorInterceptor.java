package com.jimmy.interceptor;

import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.exception.AuthorException;
import com.jimmy.local.UserLocalThread;
import com.jimmy.service.core.AuthorityUserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthorInterceptor implements HandlerInterceptor {

    private AuthorityUserInterceptor authorityUserInterceptor;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse httpServletResponse, Object o) throws Exception {
        authorityUserInterceptor.checkAndSaveUserInfo((request).getCookies());
        AccountInfo accountInfo = UserLocalThread.get();
        if (accountInfo == null) {
            throw new AuthorException("the author is not egouth");
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }

    public AuthorityUserInterceptor getAuthorityUserInterceptor() {
        return authorityUserInterceptor;
    }

    public void setAuthorityUserInterceptor(AuthorityUserInterceptor authorityUserInterceptor) {
        this.authorityUserInterceptor = authorityUserInterceptor;
    }
}
