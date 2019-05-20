package com.jimmy.common.utils;


import org.apache.commons.codec.digest.DigestUtils;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.*;

/**
 * @author aiden
 * @date 2017/2/21
 */
public class EncryptUtils {

    public static List<? extends Class<? extends Serializable>> classList = Arrays.asList(Integer.class, String.class, Character.class, Long.class, Byte.class, Float.class, Double.class, Short.class, Boolean.class,
            int.class, char.class, long.class, byte.class, float.class, double.class, short.class, boolean.class);

    /**
     * 对原文进行MD5加密
     *
     * @param source 原文
     * @param secret 秘钥
     * @return
     */
    public static String encryptMd5(String source, String secret) {
        if (StringUtils.isNotBlank(secret)) {
            return DigestUtils.md5Hex(source + secret);
        } else {
            return DigestUtils.md5Hex(source);
        }
    }

    /**
     * 对原文进行MD5加密
     *
     * @param source 原文
     * @param secret 秘钥
     * @return
     */
    public static String encryptObjMd5(Object source, String secret) {
        if (source == null) {
            throw new RuntimeException("encrypt obj is null");
        }
        try {
            Map<String, String> resultMap = getSourceMap(source, null);
            if (resultMap.containsKey("secret")) {
                resultMap.remove("secret");
            }
            List<String> keyList = new ArrayList<>(resultMap.keySet());
            Collections.sort(keyList);
            StringBuffer secretTargetSource = new StringBuffer();
            for (String key : keyList) {
                secretTargetSource.append(key + "=" + resultMap.get(key) + "key");
            }
            return encryptMd5(secretTargetSource.toString(), secret);
        } catch (IllegalAccessException e) {
            throw new RuntimeException("trunk obj is error");
        }
    }

    private static Map<String, String> getSourceMap(Object source, String preKey) throws IllegalAccessException {
        Map<String, String> resultMap = new HashMap<>();
        if (source == null) {
            return resultMap;
        }
        if (classList.contains(source.getClass())) {
            resultMap.put(preKey, String.valueOf(source));
            return resultMap;
        } else if (source instanceof Date) {
            resultMap.put(preKey, String.valueOf(((Date)source).getTime()));
            return resultMap;
        } else if (ClassUtils.isCollection(source.getClass())) {
            Iterator<?> iterator = ((Collection<?>) source).iterator();
            int i = 0;
            while (iterator.hasNext()) {
                resultMap.putAll(getSourceMap(iterator.next(), preKey + i));
                i++;
            }
            return resultMap;
        }
        if (StringUtils.isBlank(preKey)) {
            preKey = "";
        } else if (!preKey.endsWith(".")) {
            preKey += ".";
        }
        List<Field> fieldList = ClassUtils.getField(source.getClass());

        Object obj;
        for (Field field : fieldList) {
            field.setAccessible(true);
            obj = field.get(source);
            if (obj == null) {
                continue;
            }
            if (Modifier.isStatic(field.getModifiers())) {
                continue;
            }
            resultMap.putAll(getSourceMap(obj, preKey + field.getName()));
        }
        return resultMap;
    }

    public static void main(String[] arg) {
        System.out.println(String.valueOf(new Date()));
    }
}
