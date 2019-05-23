package com.jimmy.local;


import com.jimmy.dao.sys.entity.SiteInfo;

/**
 * @author aiden
 * @date 2017/3/20
 */
public class SiteInfoLocalThread {
    private static final ThreadLocal<SiteInfo> siteInfoThreadLocal = new ThreadLocal<SiteInfo>();

    public static void set(SiteInfo siteInfo) {
        siteInfoThreadLocal.set(siteInfo);
    }

    public static SiteInfo get() {
        return siteInfoThreadLocal.get();
    }

    public static Long getSiteId() {
        SiteInfo siteInfo = get();
        if (siteInfo == null) {
            return null;
        }
      return siteInfo.getOrgId();
    }


}
