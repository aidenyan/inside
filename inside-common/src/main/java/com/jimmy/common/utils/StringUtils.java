package com.jimmy.common.utils;



import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author aiden
 * @date 2017/3/9
 */
public class StringUtils extends org.apache.commons.lang3.StringUtils{
    private static final String REPLACE_START = "{";
    private static final String REPLACE_END = "}";

    public static String addNotEnd(String source, String target) {
        if (!source.endsWith(target)) {
            return source + target;
        }
        return source;
    }

    public static String length(String target, Integer length) {
        if (target != null && target.length() < length) {
            while (target.length() < length) {
                target = "0" + target;
            }
        }
        return target;
    }

    public static String concat(String... strs) {
        if (strs != null && strs.length > 0) {
            StringBuffer stringBuffer = new StringBuffer();
            for (String str : strs) {
                if (StringUtils.isNotBlank(str)) {
                    stringBuffer.append(str);
                }
            }
            return stringBuffer.toString();

        }
        return null;

    }



    public static boolean checkStr(String preString, String nextStr) {
        if (preString == null && nextStr == null) {
            return true;
        } else if (preString != null && preString.equals(nextStr)) {
            return true;
        } else {
            return false;
        }
    }

    public static String replaceMap(String source, Map<String, String> replaceMap) {
        for (String replace : replaceMap.keySet()) {
            source = source.replace(REPLACE_START + replace + REPLACE_END, replaceMap.get(replace)==null?"":replaceMap.get(replace));

        }
        return source;
    }

    public static Boolean checkPhone(String phone) {
        Pattern p = Pattern.compile( "^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\\d{8}$");
        Matcher m = p.matcher(phone);
        return m.matches();
    }

}
