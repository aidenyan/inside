package com.jimmy.local;


import javax.servlet.http.HttpServletRequest;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class RequestLocalThread {
    private static final ThreadLocal<HttpServletRequest> requestThreadLocal = new ThreadLocal<HttpServletRequest>();

    public static void set(HttpServletRequest request) {
        requestThreadLocal.set(request);
    }

    public static HttpServletRequest get() {
        return requestThreadLocal.get();
    }
}
