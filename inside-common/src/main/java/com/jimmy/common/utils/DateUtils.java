package com.jimmy.common.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @author aiden
 * @date 2017/2/23
 */
public class DateUtils extends org.apache.commons.lang3.time.DateUtils {
    public static final String YYYYMMDD = "yyyyMMdd";
    public static final String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
    public static final String YYMMDDHHMMSS = "yyMMddHHmmss";

    public static String getCurrentDateString() {
        SimpleDateFormat sdf = new SimpleDateFormat(YYYYMMDD);
        return sdf.format(new Date());
    }

    public static String format(Date date, String format) {
        if (date == null) {
            date = new Date();
        }
        if (format == null) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        return simpleDateFormat.format(date);
    }

    public static String getCurrentDateString(String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(new Date());
    }

    public static Date getCurrent() {
        Calendar calendar = Calendar.getInstance();
        return calendar.getTime();
    }

    public static Date getCurrent(Integer nextTime) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.SECOND, nextTime);
        return calendar.getTime();
    }

    public static Date getNextDay(Date curDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(curDate);
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        return calendar.getTime();
    }

    public static Date getNextDay(Date curDate, Integer day) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(curDate);
        calendar.add(Calendar.DAY_OF_MONTH, day);
        return calendar.getTime();
    }

    public static Date getMonth(Date curDate, int month) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(curDate);
        calendar.add(Calendar.MONTH, month);
        return calendar.getTime();
    }

    public static Date getNextDate(Integer nextHouse) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR,0-nextHouse);
        return calendar.getTime();

    }
}
