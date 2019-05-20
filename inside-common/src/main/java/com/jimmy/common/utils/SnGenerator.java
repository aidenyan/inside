package com.jimmy.common.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;

/**
 * 编号生成器
 *
 * @author dean
 * @date 2017/3/6
 */
public class SnGenerator {
    private static Map<String, String> currentDateMap = new HashMap<String, String>();
    private static Map<String, Integer> orderMap = new HashMap<String, Integer>();
    private static Integer autoFlag=10;
    //分步式中代表每台服務器id
   	private static Integer ipFlag=1;
   	
    public synchronized static String getCommonSn() {
        return DateUtils.getCurrentDateString("yyMMddHHmmssSSS");
    }

    public synchronized static String getBatchNo() {
        String key = "batchNo";
        String date = currentDateMap.get(key);
        Integer order = orderMap.get(key);
        if (order == null) {
            order = 1;
        }
        String currentDate = DateUtils.getCurrentDateString("MMddyyyy");
        if (date != null && currentDate.equals(date)) {
            order++;
        } else {
            order = 1;
            currentDateMap.put(key, currentDate);
        }
        orderMap.put(key, order);
        String orderStr = String.valueOf(order);
        while (orderStr.length() < 3) {
            orderStr = "0" + orderStr;
        }
        return currentDate + orderStr;
    }

    /*public synchronized static String getCommonSn(String key, Long creatorId) {
        String currentDate = currentDateMap.get(key);
        Integer order = orderMap.get(key);
        if (order == null) {
            order = 1;
        }
        String date = DateUtils.getCurrentDateString(DateUtils.YYMMDDHHMMSS);
        if (currentDate != null && currentDate.equals(date)) {
            order++;
        } else {
            currentDate = date;
            order = 1;
        }
        String orderStr = String.valueOf(order);
        while (orderStr.length() < 3) {
            orderStr = "0" + orderStr;
        }
        String creatorIdStr = String.valueOf(creatorId);
        while (creatorIdStr.length() < 7) {
            creatorIdStr = "0" + creatorIdStr;
        }
        currentDateMap.put(key, creatorIdStr);
        orderMap.put(key, order);
        return key + currentDate + orderStr + creatorIdStr;
    }*/
    
	public synchronized  static String nextId(){
			/*autoFlag++;
			if(autoFlag>99){
				autoFlag=10;
			}
			return getCommonSn()+ipFlag.toString()+autoFlag.toString();*/
		return getCommonSn();
	}
	
	public static void main(String[] args) {
		  final CyclicBarrier cdl = new CyclicBarrier(1000);
	        for(int i = 0; i < 1000; i++){
	            new Thread(new Runnable() { 
	                @Override 
	                public void run() { 
	                try { 
	                    cdl.await(); 
	                } catch (InterruptedException e) { 
	                    e.printStackTrace(); 
	                } catch (BrokenBarrierException e) { 
	                    e.printStackTrace(); 
	                } 
	                System.out.println(nextId());}
	             }).start(); 
	        } 
	        try { 
	            TimeUnit.SECONDS.sleep(5); 
	        } catch (InterruptedException e) { 
	           e.printStackTrace(); 
	        }
	}
}
