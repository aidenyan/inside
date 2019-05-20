package com.jimmy.common.utils;

import java.math.BigDecimal;

/**
 * @author aiden
 * @date 2017/6/13
 */
public class NumberUtils extends org.apache.commons.lang3.math.NumberUtils {
    public static String toStr(Integer num, Integer minLength) {
        if (num != null) {
            String numStr = String.valueOf(num);
            while (numStr.length() < minLength) {
                numStr = "0" + numStr;
            }
            return numStr;
        }
        return null;
    }

    public static boolean greater(Long src, Long tar) {
        if (src == null || src <= tar) {
            return Boolean.FALSE;
        }

        return Boolean.TRUE;
    }

    public static BigDecimal converScale(BigDecimal amount, Integer scale) {
        if (amount != null) {
            return amount.setScale(scale, BigDecimal.ROUND_HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    public static boolean greater(Integer src, Integer tar) {
        if (src == null || src <= tar) {
            return Boolean.FALSE;
        }

        return Boolean.TRUE;
    }
}
