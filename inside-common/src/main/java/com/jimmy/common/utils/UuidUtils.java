package com.jimmy.common.utils;

import java.util.UUID;

/**
 * @author aiden
 * @date 2017/5/25
 */
public class UuidUtils {
    public static String getUuid() {
        UUID uuid = UUID.randomUUID();
        String str = uuid.toString();
        // 去掉"-"符号
        return str.substring(0, 8) + str.substring(9, 13) + str.substring(14, 18) + str.substring(19, 23) + str.substring(24);
    }
}
