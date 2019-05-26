package com.jimmy.spring.local;


import com.jimmy.spring.anno.LogInfo;

/**
 * @author aiden
 * @date 2017/5/25
 */
public class LogInfoLocalThread {
    private static final ThreadLocal<LogInfo> logInfoThreadLocal = new ThreadLocal<LogInfo>();

    public static void set(LogInfo logInfo) {
        logInfoThreadLocal.set(logInfo);
    }

    public static LogInfo get() {
        return logInfoThreadLocal.get();
    }
}
