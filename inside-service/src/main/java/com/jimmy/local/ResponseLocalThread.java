package com.jimmy.local;


import javax.servlet.http.HttpServletResponse;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class ResponseLocalThread {
    private static final ThreadLocal<HttpServletResponse> responseThreadLocal = new ThreadLocal<HttpServletResponse>();

    public static void set(HttpServletResponse response) {
        responseThreadLocal.set(response);
    }

    public static HttpServletResponse get() {
        return responseThreadLocal.get();
    }
}
