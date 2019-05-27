package com.jimmy.service.core.impl;


import com.aliyuncs.utils.StringUtils;
import com.jimmy.common.utils.DateUtils;
import com.jimmy.common.utils.EncryptUtils;
import com.jimmy.conts.AuthorityConst;
import com.jimmy.conts.SessionConst;
import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.enums.AccountTypeEnum;
import com.jimmy.local.RequestLocalThread;
import com.jimmy.local.ResponseLocalThread;
import com.jimmy.service.core.CookieService;
import com.jimmy.service.account.AccountInfoService;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Date;


/**
 * @author aiden
 * @date 2017/2/21
 */
@Service
@Transactional(readOnly = true)
public class CookieServiceImpl implements CookieService {
    @Autowired
    private AccountInfoService accountInfoService;

    private final static String LOGIN_NAME_SECRET = "com.jimmy.login.name.secret";
    private final Integer sessionTimeOut = 30 * 60*1000;
    private final static String ENCODING = "UTF-8";

    @Transactional(readOnly = false)
    public void updateOrAddAccountInfo(AccountInfo accountInfo) {
        Cookie cookie = null;
        HttpServletResponse response = ResponseLocalThread.get();
        String cookieName = EncryptUtils.encryptMd5(AuthorityConst.USER_LOGIN_COOKIE, LOGIN_NAME_SECRET);
        if (accountInfo != null) {
            /**
             * 将登陆的信息以及账号类型保存
             */
            String accountName = accountInfo.getName();
            try {
                accountName = URLEncoder.encode(accountName, ENCODING);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            StringBuffer cookieValue = new StringBuffer("");
            cookieValue.append(accountInfo.getType());
            cookieValue.append("_");
            cookieValue.append(DateUtils.getCurrent().getTime());
            cookieValue.append("_");
            cookieValue.append(accountName);
            String random = (String) RequestLocalThread.get().getSession().getAttribute(SessionConst.SESSION_RANDOM_INFO);
            if (random == null) {
                random = RequestLocalThread.get().getSession().getId() + RandomUtils.nextInt();
                RequestLocalThread.get().getSession().setAttribute(SessionConst.SESSION_RANDOM_INFO, random);
            }
            String secretValue = EncryptUtils.encryptMd5(cookieValue.toString(), LOGIN_NAME_SECRET);
            cookie = new Cookie(cookieName, cookieName + "_" + random + "_" + secretValue + "_" + cookieValue.toString());
            cookie.setPath("/");
        } else {
            cookie = new Cookie(cookieName, null);
            cookie.setPath("/");
        }
        response.addCookie(cookie);
    }

    public AccountInfo getAccountInf(Cookie[] cookies) {
        /**
         * 进行加密处理
         */
        String cookieName = EncryptUtils.encryptMd5(AuthorityConst.USER_LOGIN_COOKIE, LOGIN_NAME_SECRET);
        /**
         * 获取登录者信息的cooki
         */
        String value = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if (cookieName.equals(name)) {
                    value = cookie.getValue();
                    break;
                }
            }
        }
        AccountInfo accountInfo = null;
        /**
         * 检查用户是否已经登录
         */
        if (value != null && value.startsWith(cookieName)) {
            /**
             * 检查用户信息是否有被修改
             */
            /**
             * 获取cookie的用户信息
             */
            Integer start = 0;
            start = value.indexOf("_", start);
            start++;
            Integer last = value.indexOf("_", start);
            if (last > 0) {
                String random = value.substring(start, last);
                start = last + 1;
                last = value.indexOf("_", start);
                if (last > 0 && StringUtils.isNotEmpty(random)) {
                    /**
                     * 加密后的信息
                     */
                    String secretValue = value.substring(start, last);
                    start = last + 1;
                    last = value.indexOf("_", start);
                    if (last > 0) {
                        String type = value.substring(start, last);
                        start = last + 1;
                        last = value.indexOf("_", start);
                        if (last > 0) {
                            String dateTime = value.substring(start, last);
                            start = last + 1;
                            String name = value.substring(start);
                            String secretValueStr = EncryptUtils.encryptMd5(type + "_" + dateTime + "_" + name, LOGIN_NAME_SECRET);
                            if (secretValue.equals(secretValueStr)) {
                                try {
                                    name = URLDecoder.decode(name, ENCODING);
                                } catch (UnsupportedEncodingException e) {
                                    e.printStackTrace();
                                }
                                accountInfo = new AccountInfo();
                                accountInfo.setName(name);
                                accountInfo.setType(Integer.parseInt(type));
                                Date date = DateUtils.getCurrent();
                                date.setTime(Long.parseLong(dateTime) + sessionTimeOut);
                                /**
                                 * 检查登陆修改时间
                                 */
                                HttpServletRequest request = RequestLocalThread.get();
                                if (DateUtils.getCurrent().compareTo(date) < 0) {

                                    AccountInfo tempAccount = null;
                                    String sessionRandon = null;
                                    if (request != null) {
                                        tempAccount = (AccountInfo) request.getSession().getAttribute(SessionConst.SESSION_USER_LOGIN_INFO);
                                        sessionRandon = (String) request.getSession().getAttribute(SessionConst.SESSION_RANDOM_INFO);
                                    }
                                    if (random.equals(sessionRandon) && tempAccount != null && tempAccount.getType() != null && tempAccount.getType().equals(accountInfo.getType()) && tempAccount.getName() != null && tempAccount.getName().equals(accountInfo.getName())) {
                                        accountInfo = tempAccount;
                                    } else {
                                        accountInfo = accountInfoService.getAccountInfoByName(accountInfo.getName(), AccountTypeEnum.values(accountInfo.getType()));
                                        request.getSession().setAttribute(SessionConst.SESSION_USER_LOGIN_INFO, accountInfo);
                                        request.getSession().setAttribute(SessionConst.SESSION_RANDOM_INFO, random);
                                    }
                                } else {
                                    request.getSession().removeAttribute(SessionConst.SESSION_USER_LOGIN_INFO);
                                    request.getSession().removeAttribute(SessionConst.SESSION_USER_MENU_LIST);
                                    request.getSession().removeAttribute(SessionConst.SESSION_RANDOM_INFO);
                                    return null;
                                }
                            } else {
                                value = null;
                            }
                        }
                    }
                }
            }
        }
        return accountInfo;
    }


}
