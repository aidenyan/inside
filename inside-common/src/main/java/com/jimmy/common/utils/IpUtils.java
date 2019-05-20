package com.jimmy.common.utils;

import javax.servlet.http.HttpServletRequest;

/**
 * @author aiden
 * @date 2017/5/25
 */
public class IpUtils {
    public static String getIP(HttpServletRequest request) {
        String  ip=request.getHeader("HTTP_X_FORWARDED_FOR");
        if(StringUtils.isNotBlank(ip)){
           String[] ipArray= ip.split(",");
            if(ipArray.length>0){
                ip=ipArray[0];
            }
        }
         ip = request.getHeader("x-forwarded-for");
        if (!checkIP(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (!checkIP(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (!checkIP(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
    private static boolean checkIP(String ip) {
        if (ip == null || ip.length() == 0 || "unkown".equalsIgnoreCase(ip)
                || ip.split(".").length != 4) {
            return false;
        }
        return true;
    }
}
