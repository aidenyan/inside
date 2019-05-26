package com.jimmy.common.utils;


import org.apache.commons.lang3.reflect.FieldUtils;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;

import java.lang.reflect.Field;
import java.lang.reflect.Method;


/**
 * @author aiden
 * @date 2017/3/29
 */
public class BeanUtils {
    private static LocalVariableTableParameterNameDiscoverer discoverer = new LocalVariableTableParameterNameDiscoverer();
    public static Object getFieldValue(Object obj, String fieldName) {
        if (obj == null) {
            return null;
        }
        Field targetField = getTargetField(obj.getClass(), fieldName);

        try {
            return FieldUtils.readField(targetField, obj, true);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Field getTargetField(Class<?> targetClass, String fieldName) {
        Field field = null;

        try {
            if (targetClass == null) {
                return field;
            }

            if (Object.class.equals(targetClass)) {
                return field;
            }

            field = FieldUtils.getDeclaredField(targetClass, fieldName, true);
            if (field == null) {
                field = getTargetField(targetClass.getSuperclass(), fieldName);
            }
        } catch (Exception e) {
        }

        return field;
    }

    public static void setFieldValue(Object obj, String fieldName, Object value) {
        if (null == obj) {
            return;
        }
        Field targetField = getTargetField(obj.getClass(), fieldName);
        try {
            FieldUtils.writeField(targetField, obj, value);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    public static String[] getParamterName(Method method) {
        try{
            return discoverer.getParameterNames(method);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;

    }

}
