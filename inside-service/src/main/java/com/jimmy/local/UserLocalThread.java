package com.jimmy.local;


import com.jimmy.dao.sys.entity.AccountInfo;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class UserLocalThread {
    private static final ThreadLocal<AccountInfo> accountLocalInfo = new ThreadLocal<AccountInfo>();

    public static void setAccountInfo(AccountInfo accountInfo) {
        accountLocalInfo.set(accountInfo);
    }

    public static AccountInfo get() {
        return accountLocalInfo.get();
    }
}