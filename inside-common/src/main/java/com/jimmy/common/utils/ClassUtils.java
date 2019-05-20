package com.jimmy.common.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * @author : aiden
 * @ClassName :  ClassUtils
 * @Description :
 * @date : 2019/1/31/031
 */
public class ClassUtils {

    public static List<Field> getField(Class<?> tClass) {
        if (tClass == null) {
            return new ArrayList<>();
        }
        Field[] fields = tClass.getDeclaredFields();
        List<Field> resultList = new ArrayList<>();
        if (fields != null) {
            resultList.addAll(Arrays.asList(fields));
        }
        resultList.addAll(getField(tClass.getSuperclass()));
        return resultList;
    }

    public static List<Class<?>> getInterfaceList(Class<?> tClass) {
        if(tClass==null){
            return new ArrayList<>();
        }
        Class<?>[] tClassInterfaces = tClass.getInterfaces();
        if (tClassInterfaces == null || tClassInterfaces.length == 0) {
            return new ArrayList<>();
        }
        List<Class<?>> resultList = new ArrayList<>();
        for (Class<?> tClassInterface : tClassInterfaces) {
            resultList.addAll(getInterfaceList(tClassInterface));
        }
        resultList.addAll(Arrays.asList(tClassInterfaces));
        for(Class<?> tClazz:tClassInterfaces){
            resultList.addAll(getInterfaceList(tClazz));
        }
        resultList.addAll(getInterfaceList(tClass.getSuperclass()));
        return resultList;
    }


    public static boolean isCollection(Class<?> tClass) {
        return  getInterfaceList(tClass).contains(Collection.class);


    }

}
