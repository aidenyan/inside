package com.jimmy.common.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;


/**
 * @author aiden
 * @date 2017/5/2
 */
public class ObjectUtils extends org.apache.commons.lang3.ObjectUtils {
    public static Object getFiled(String param, Object obj) {
        if (obj == null || param == null) {
            return null;
        } else {
            try {
                Field field = null;
                Class clazz = obj.getClass();
                if (param.indexOf(".") > 0) {
                    int last = param.indexOf(".");
                    String fieldName = param.substring(0, last);
                    for (; clazz != Object.class; clazz = clazz.getSuperclass()) {
                        try {
                            field = clazz.getDeclaredField(param);
                        } catch (NoSuchFieldException e) {

                        }
                        if (field != null) {
                            field.setAccessible(true);
                            obj = field.get(obj);
                            break;
                        }
                    }
                    if (obj instanceof Collection) {
                        List<Object> list = new ArrayList<Object>();
                        Object value = null;
                        for (Object tempObj : (Collection) obj) {
                            value = getFiled(param.substring(last + 1), obj);
                            if (value != null) {
                                if (value instanceof Collection) {
                                    list.addAll((Collection) value);
                                } else {
                                    list.add(value);
                                }
                            }
                        }
                        if (list != null && list.size() > 0) {
                            return list;
                        }
                        return null;
                    } else {
                        return getFiled(param.substring(last + 1), obj);
                    }
                } else {
                    for (; clazz != Object.class; clazz = clazz.getSuperclass()) {
                        try {
                            field = clazz.getDeclaredField(param);
                        } catch (NoSuchFieldException e) {
                        }
                        if (field != null) {
                            field.setAccessible(true);
                            return field.get(obj);
                        }
                    }
                    return null;
                }
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    public static Object getMethodParamValue(String param, Method method, String[] paramNames, Object[] objArray) {
        Object value = null;
        if (paramNames != null) {
            String fieldName = null;
            String paramStr = null;
            if (param.indexOf(".") > 0) {
                int last = param.indexOf(".");
                fieldName = param.substring(0, last);
                paramStr = param.substring(last + 1);
            } else {
                fieldName = param;
            }
            String name = null;
            for (Integer i = 0; i < paramNames.length; i++) {
                name = paramNames[i];
                if (name.equals(fieldName)) {
                    if (StringUtils.isBlank(paramStr)) {
                        value = objArray[i];
                        if (value != null) {
                            break;
                        }
                    } else {
                        if (objArray[i] instanceof Collection) {
                            List<Object> list = new ArrayList<Object>();
                            for (Object obj : (Collection) objArray[i]) {
                                value = ObjectUtils.getFiled(paramStr, objArray[i]);
                                if (value != null) {
                                    if (value instanceof Collection) {
                                        list.addAll((Collection) value);
                                    } else {
                                        list.add(value);
                                    }
                                }
                            }
                            List<String> strList = new ArrayList<String>();
                            for (Object obj : list) {
                                strList.add(String.valueOf(obj));
                            }
                            Collections.sort(strList);
                            if (strList != null && strList.size() > 0) {
                                value = strList;
                            } else {
                                value = null;
                            }
                            break;
                        } else {
                            value = ObjectUtils.getFiled(paramStr, objArray[i]);
                            if (value != null) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return value;

    }

}
