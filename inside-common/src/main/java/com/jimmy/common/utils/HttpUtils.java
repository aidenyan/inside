package com.jimmy.common.utils;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.util.Assert;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * @author aiden
 * @date 2017/7/6
 */
public class HttpUtils {
    private HttpUtils() {
    }


    /**
     * POST请求
     *
     * @param url          URL
     * @param parameterMap 请求参数
     * @param headerMap    设置header
     * @return 返回结果
     */
    public static String post(String url, Map<String, Object> parameterMap, Map<String, Object> headerMap) {
        Assert.hasText(url);
        String siteUrl = org.apache.commons.lang3.StringUtils.lowerCase(url);
        if (siteUrl.startsWith("https")) {
            return postSSL(siteUrl, parameterMap, headerMap);
        }
        String result = null;
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try {
            HttpPost httpPost = new HttpPost(url);
            if (null != headerMap && !headerMap.isEmpty()) {
                for (Iterator<String> iter = headerMap.keySet().iterator(); iter.hasNext(); ) {
                    String name = (String) iter.next();
                    String value = headerMap.get(name).toString();
                    httpPost.setHeader(name, value);
                }
            }
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            if (parameterMap != null) {
                for (Map.Entry<String, Object> entry : parameterMap.entrySet()) {
                    String name = entry.getKey();
                    String value = ConvertUtils.convert(entry.getValue());
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(name)) {
                        nameValuePairs.add(new BasicNameValuePair(name, value));
                    }
                }
            }
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            result = EntityUtils.toString(httpEntity);
            EntityUtils.consume(httpEntity);
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    private static String postSSL(String url, Map<String, Object> parameterMap, Map<String, Object> headerMap) {
        Assert.hasText(url);
        String result = null;
        CloseableHttpClient httpClient = HttpClients.createDefault();
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(2000).setConnectTimeout(1000).build();
        HttpPost httpPost = null;
        try {
            SSLContext sslContext = SSLContexts.createDefault();
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, new String[]{"TLSv1"}, null, SSLConnectionSocketFactory.BROWSER_COMPATIBLE_HOSTNAME_VERIFIER);
            httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).build();
            httpPost = new HttpPost(url);
            if (null != headerMap && !headerMap.isEmpty()) {
                for (Iterator<String> iter = headerMap.keySet().iterator(); iter.hasNext(); ) {
                    String name = (String) iter.next();
                    String value = headerMap.get(name).toString();
                    httpPost.setHeader(name, value);
                }
            }
            httpPost.setConfig(requestConfig);
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            if (parameterMap != null) {
                for (Map.Entry<String, Object> entry : parameterMap.entrySet()) {
                    String name = entry.getKey();
                    String value = ConvertUtils.convert(entry.getValue());
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(name)) {
                        nameValuePairs.add(new BasicNameValuePair(name, value));
                    }
                }
            }
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            result = EntityUtils.toString(httpEntity);
            EntityUtils.consume(httpEntity);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            httpPost.abort();
        }
        return result;
    }

    public static Map<String, Object> postJson(String url, Map<String, Object> parameterMap, Map<String, Object> headerMap) {
        JSONObject jsonParam = new JSONObject();
        CloseableHttpClient httpClient = HttpClients.createDefault();

        try {
            HttpPost httpPost = new HttpPost(url);

            if (null != parameterMap) {
                for (Iterator<String> iter = headerMap.keySet().iterator(); iter.hasNext(); ) {
                    String name = iter.next();
                    String value = headerMap.get(name).toString();
                    httpPost.setHeader(name, value);
                }
            }

            if (null != parameterMap) {
                for (Map.Entry<String, Object> entry : parameterMap.entrySet()) {
                    jsonParam.put(entry.getKey(), entry.getValue());
                }
            }
            StringEntity entity = new StringEntity(jsonParam.toString(), "utf-8");//解决中文乱码问题
            entity.setContentEncoding("UTF-8");
            entity.setContentType("application/json");
            httpPost.setEntity(entity);

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            String result = EntityUtils.toString(httpEntity);
            EntityUtils.consume(httpEntity);

            Map<String, Object> mapResult = JsonUtils.toObject(result, Map.class);

            return mapResult;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * GET请求
     *
     * @param url          URL
     * @param parameterMap 请求参数
     * @param headerMap    设置header
     * @return 返回结果
     */

    public static String get(String url, Map<String, Object> parameterMap, Map<String, Object> headerMap) {
        Assert.hasText(url);
        String result = null;
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try {
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            if (parameterMap != null) {
                for (Map.Entry<String, Object> entry : parameterMap.entrySet()) {
                    String name = entry.getKey();
                    String value = ConvertUtils.convert(entry.getValue());
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(name)) {
                        nameValuePairs.add(new BasicNameValuePair(name, value));
                    }
                }
            }
            HttpGet httpGet = new HttpGet(url + (org.apache.commons.lang3.StringUtils.contains(url, "?") ? "&" : "?") + EntityUtils.toString(new UrlEncodedFormEntity(nameValuePairs, "UTF-8")));
            if (null != headerMap && !headerMap.isEmpty()) {
                for (Iterator<String> iter = headerMap.keySet().iterator(); iter.hasNext(); ) {
                    String name = (String) iter.next();
                    String value = headerMap.get(name).toString();
                    httpGet.setHeader(name, value);
                }
            }
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity httpEntity = httpResponse.getEntity();
            result = EntityUtils.toString(httpEntity);
            EntityUtils.consume(httpEntity);
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static String get(String url) {
        String result = null;
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            // 创建httpget.
//            HttpGet httpget = new HttpGet(url);
            HttpPost httppost = new HttpPost(url);
            System.out.println("executing request " + httppost.getURI());
            // 执行get请求.
            CloseableHttpResponse response = httpclient.execute(httppost);
            try {
                // 获取响应实体
                HttpEntity entity = response.getEntity();
                // 打印响应状态
                System.out.println(response.getStatusLine());
                if (entity != null) {
                    // 打印响应内容长度
                    System.out.println("Response content length: " + entity.getContentLength());
                    // 打印响应内容
                    System.out.println("Response content: " + EntityUtils.toString(entity));
                    result = EntityUtils.toString(entity);
                }

            } finally {
                response.close();
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭连接,释放资源
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return result;
    }

    public static String post(String url, String json) {
        return post(url, json, null);
    }

    /**
     * @param url
     * @param json
     * @return String 返回类型
     * @throws
     * @Title: post
     * @Description:
     */
    public static String post(String url, String json, String respCharSet) {
        Assert.hasText(url);
        String result = null;
        if (org.apache.commons.lang3.StringUtils.isEmpty(json)) {
            return result;
        }
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try {
            StringEntity entity = new StringEntity(json, "utf-8");
            entity.setContentEncoding("UTF-8");
            entity.setContentType("application/json");
            HttpPost httpPost = new HttpPost(url);
            httpPost.setEntity(entity);
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            result = EntityUtils.toString(httpEntity, respCharSet);
            EntityUtils.consume(httpEntity);
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static String postArray(String url, Map<String, Object> parameterMap, Map<String, Object> headerMap) {
        Assert.hasText(url);
        String siteUrl = org.apache.commons.lang3.StringUtils.lowerCase(url);
        if (siteUrl.startsWith("https")) {
            return postSSL(siteUrl, parameterMap, headerMap);
        }
        String result = null;
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try {
            HttpPost httpPost = new HttpPost(url);
            if (null != headerMap && !headerMap.isEmpty()) {
                for (Iterator<String> iter = headerMap.keySet().iterator(); iter.hasNext(); ) {
                    String name = (String) iter.next();
                    String value = headerMap.get(name).toString();
                    httpPost.setHeader(name, value);
                }
            }
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            if (parameterMap != null) {
                for (Map.Entry<String, Object> entry : parameterMap.entrySet()) {
                    String name = entry.getKey();
                    if (entry.getValue() instanceof String[]) {
                        String[] values = (String[]) entry.getValue();
                        for (String v : values) {
                            if (org.apache.commons.lang3.StringUtils.isNotEmpty(v)) {
                                nameValuePairs.add(new BasicNameValuePair(name, v));
                            }
                        }
                    }
                    String value = ConvertUtils.convert(entry.getValue());
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(name)) {
                        nameValuePairs.add(new BasicNameValuePair(name, value));
                    }
                }
            }
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            result = EntityUtils.toString(httpEntity);
            EntityUtils.consume(httpEntity);
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

}
