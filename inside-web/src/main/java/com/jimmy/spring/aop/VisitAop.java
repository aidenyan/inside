package com.jimmy.spring.aop;


import com.alibaba.fastjson.JSON;
import com.jimmy.common.utils.ObjectUtils;
import com.jimmy.common.utils.StringUtils;
import com.jimmy.exception.ServiceException;
import com.jimmy.local.RequestLocalThread;
import com.jimmy.spring.anno.LockVisit;
import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * @author aiden
 * @date 2017/4/20
 */
@Component
@Aspect
public class VisitAop {
    private Map<String, Map<String, Long>> resultMap = new HashMap<String, Map<String, Long>>();
    private static final Long PRE_DEAL_LONG_TIME = 100 * 1000L;
    private static final Logger logger = Logger.getLogger(VisitAop.class);
    private static Long updateTime = null;

    /**
     * @param joinPoint
     * @param lockVisit
     * @return
     * @throws Throwable
     */
    @Around(value = "@annotation(lockVisit)")
    public Object tokenAround(ProceedingJoinPoint joinPoint, LockVisit lockVisit) throws Throwable {
        Object[] objArray = joinPoint.getArgs();
        String classType = joinPoint.getTarget().getClass().getName();
        Class<?> clazz = Class.forName(classType);
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        LocalVariableTableParameterNameDiscoverer discoverer = new LocalVariableTableParameterNameDiscoverer();
        String[] paramNames = null;
        try {
            paramNames = discoverer.getParameterNames(method);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        Object value = null;
        StringBuffer stringBuffer = new StringBuffer();
        String sign = method.getDeclaringClass().getName() + "." + method.getName();
        boolean isSuccess = true;
        if (StringUtils.isNotBlank(lockVisit.sign())) {
            sign = lockVisit.sign();
        }
        if (!lockVisit.isPage() && lockVisit.params() != null && lockVisit.params().length > 0) {
            String[] params = lockVisit.params();
            for (String param : params) {
                value = ObjectUtils.getMethodParamValue(param, method, paramNames, objArray);
                if (value != null) {
                    stringBuffer.append(JSON.toJSONString(value));
                }
            }
        }
        if (lockVisit.isPage() || StringUtils.isNotBlank(stringBuffer.toString())) {
            HttpServletRequest request = RequestLocalThread.get();
            String uuid = request.getHeader("head-send-uuid");
            stringBuffer.append(uuid);
        }
        Object obj = null;
        if (StringUtils.isNotBlank(stringBuffer.toString())) {
            Map<String, Long> map = resultMap.get(sign);
            if (map == null) {
                synchronized (resultMap) {
                    map = resultMap.get(sign);
                    if (map == null) {
                        map = new HashMap<String, Long>();
                        resultMap.put(sign, map);
                    }
                }
            }
            try {
                synchronized (map) {
                    if (map != null && map.keySet().size() > 0) {
                        Long time = map.get(stringBuffer.toString());
                        if (time != null && time.compareTo(System.currentTimeMillis() - PRE_DEAL_LONG_TIME) > 0) {
                            isSuccess = false;
                            throw new ServiceException();
                        }
                    }
                    map.put(stringBuffer.toString(), System.currentTimeMillis());
                }
                obj = joinPoint.proceed(objArray);
            } catch (Exception e) {
                e.printStackTrace();
                logger.error(e.getMessage(), e);
                if (map != null && map.keySet() != null) {
                    logger.error("*******the map length" + map.size(), e);
                }
                throw e;
            } finally {
                if (isSuccess) {
                    map = resultMap.get(sign);
                    map.remove(stringBuffer.toString());
                    if (map.keySet() == null || map.keySet().size() == 0) {
                        resultMap.remove(sign);
                    }
                }
                clearMap();
                logger.info("*******the map length" + resultMap.size());
            }
        } else {
            obj = joinPoint.proceed(objArray);
        }
        return obj;
    }

    private void clearMap() {
        Long nowTime = Calendar.getInstance().getTimeInMillis();
        if (updateTime == null || updateTime - nowTime > 60 * 1000) {
            updateTime = nowTime;
            Map<String, Long> map = null;
            Long time = null;
            if (resultMap != null && resultMap.keySet().size() > 0) {
                Iterator<String> keyIterator = resultMap.keySet().iterator();
                String key = null;
                Iterator<String> keyMapIterator = null;
                String mapKey = null;
                while (keyIterator.hasNext()) {
                    key = keyIterator.next();
                    map = resultMap.get(key);
                    if (map == null) {
                        resultMap.remove(key);
                    } else if (map.keySet() != null) {
                        keyMapIterator = map.keySet().iterator();
                        while (keyMapIterator.hasNext()) {
                            mapKey = keyMapIterator.next();
                            time = map.get(mapKey);
                            if (time == null || time.compareTo(System.currentTimeMillis() - PRE_DEAL_LONG_TIME) <= 0) {
                                map.remove(mapKey);
                            }
                        }
                    }
                }
            }

        }

    }


}
