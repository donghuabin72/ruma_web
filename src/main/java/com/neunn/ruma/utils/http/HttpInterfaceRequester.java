/**
 * @项目名称: ruma-web
 * @文件名称: HttpInterfaceRequester.java
 * @Date: 2016年2月25日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Map;
import java.util.Vector;

import com.neunn.ruma.utils.mapper.JsonMapper;

/**
 * 发送HTTP请求类，用来调用HTTP接口
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月25日
 * @since 1.0
 */
public class HttpInterfaceRequester {
    private String defaultContentEncoding;

    public HttpInterfaceRequester() {
        this.defaultContentEncoding = Charset.defaultCharset().name();
    }

    /**
     * 发送GET请求
     *
     * @param urlString URL地址
     * @return 响应对象
     * @throws IOException
     */
    public HttpInterfaceResponser sendGet(String urlString) throws IOException {
        return this.send(urlString, "GET", null, null);
    }

    /**
     * 发送GET请求
     *
     * @param urlString URL地址
     * @param params 参数集合
     * @return 响应对象
     * @throws IOException
     */
    public HttpInterfaceResponser sendGet(String urlString, Map<String, Object> params) throws IOException {
        return this.send(urlString, "GET", params, null);
    }

    /**
     * 发送GET请求
     *
     * @param urlString URL地址
     * @param params 参数集合
     * @param propertys 请求属性
     * @return 响应对象
     * @throws IOException
     */
    public HttpInterfaceResponser sendGet(String urlString, Map<String, Object> params, Map<String, Object> propertys)
            throws IOException {
        return this.send(urlString, "GET", params, propertys);
    }

    /**
     * 发送POST请求
     *
     * @param urlString URL地址
     * @return 响应对象
     * @throws IOException
     */
    public HttpInterfaceResponser sendPost(String urlString) throws IOException {
        return this.send(urlString, "POST", null, null);
    }

    /**
     * 发送POST请求
     *
     * @param urlString URL地址
     * @param params 参数集合
     * @return 响应对象
     * @throws IOException
     */
    public HttpInterfaceResponser sendPost(String urlString, Map<String, Object> params) throws IOException {
        return this.send(urlString, "POST", params, null);
    }

    /**
     * 发送POST请求
     *
     * @param urlString URL地址
     * @param params 参数集合
     * @param propertys 请求属性
     * @return 响应对象
     * @throws IOException
     */
    public HttpInterfaceResponser sendPost(String urlString, Map<String, Object> params, Map<String, Object> propertys)
            throws IOException {
        return this.send(urlString, "POST", params, propertys);
    }

    /**
     * 发送JSON请求
     * 
     * @author Edward
     * @date 2014-7-11
     * @param urlString URL请求地址
     * @param params 参数集合
     * @param propertys 请求属性
     * @return
     * @throws IOException
     * @since 1.0
     */
    public HttpInterfaceResponser sendJson(String urlString, Map<String, Object> params, Map<String, Object> propertys)
            throws IOException {
        return this.send(urlString, "JSON", params, propertys);
    }

    /**
     * 发送HTTP请求
     *
     * @param urlString
     * @return 响映对象
     * @throws IOException
     */
    private HttpInterfaceResponser send(String urlString, String method, Map<String, Object> parameters,
            Map<String, Object> propertys) throws IOException {
        HttpURLConnection urlConnection = null;

        if (method.equalsIgnoreCase("GET") && parameters != null) {
            StringBuffer param = new StringBuffer();
            int i = 0;
            for (String key : parameters.keySet()) {
                if (i == 0)
                    param.append("?");
                else
                    param.append("&");
                param.append(key).append("=").append(parameters.get(key));
                i++;
            }
            urlString += param;
        }
        URL url = new URL(urlString);
        urlConnection = (HttpURLConnection) url.openConnection();

        urlConnection.setRequestMethod(method);
        urlConnection.setDoOutput(true);
        urlConnection.setDoInput(true);
        urlConnection.setUseCaches(false);

        if (propertys != null)
            for (String key : propertys.keySet()) {
                urlConnection.addRequestProperty(key, propertys.get(key).toString());
            }

        if (method.equalsIgnoreCase("POST") && parameters != null) {
            StringBuffer param = new StringBuffer();
            int i = 0;
            for (String key : parameters.keySet()) {
                if (i != 0)
                    param.append("&");
                param.append(key).append("=").append(parameters.get(key));
                i++;
            }
            System.out.println(param);
            urlConnection.getOutputStream().write(param.toString().getBytes());
            urlConnection.getOutputStream().flush();
            urlConnection.getOutputStream().close();
        }

        if (method.equalsIgnoreCase("JSON") && parameters != null) {
            String param = JsonMapper.toJsonString(parameters);
            System.out.println(param);
            urlConnection.getOutputStream().write(param.toString().getBytes());
            urlConnection.getOutputStream().flush();
            urlConnection.getOutputStream().close();
        }

        return this.makeContent(urlString, urlConnection);
    }

    /**
     * 得到响应对象
     *
     * @param urlConnection
     * @return 响应对象
     * @throws IOException
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    private HttpInterfaceResponser makeContent(String urlString, HttpURLConnection urlConnection) throws IOException {
        HttpInterfaceResponser httpResponser = new HttpInterfaceResponser();
        try {
            InputStream in = urlConnection.getInputStream();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(in));
            httpResponser.contentCollection = new Vector();
            StringBuffer temp = new StringBuffer();
            String line = bufferedReader.readLine();
            while (line != null) {
                httpResponser.contentCollection.add(line);
                temp.append(line).append("\r\n");
                line = bufferedReader.readLine();
            }
            bufferedReader.close();

            String ecod = urlConnection.getContentEncoding();
            if (ecod == null)
                ecod = this.defaultContentEncoding;

            httpResponser.urlString = urlString;

            httpResponser.defaultPort = urlConnection.getURL().getDefaultPort();
            httpResponser.file = urlConnection.getURL().getFile();
            httpResponser.host = urlConnection.getURL().getHost();
            httpResponser.path = urlConnection.getURL().getPath();
            httpResponser.port = urlConnection.getURL().getPort();
            httpResponser.protocol = urlConnection.getURL().getProtocol();
            httpResponser.query = urlConnection.getURL().getQuery();
            httpResponser.ref = urlConnection.getURL().getRef();
            httpResponser.userInfo = urlConnection.getURL().getUserInfo();

            httpResponser.content = new String(temp.toString().getBytes(), ecod);
            httpResponser.contentEncoding = ecod;
            httpResponser.code = urlConnection.getResponseCode();
            httpResponser.message = urlConnection.getResponseMessage();
            httpResponser.contentType = urlConnection.getContentType();
            httpResponser.method = urlConnection.getRequestMethod();
            httpResponser.connectTimeout = urlConnection.getConnectTimeout();
            httpResponser.readTimeout = urlConnection.getReadTimeout();

            return httpResponser;
        } catch (IOException e) {
            throw e;
        } finally {
            if (urlConnection != null)
                urlConnection.disconnect();
        }
    }

    /**
     * 默认的响应字符集
     */
    public String getDefaultContentEncoding() {
        return this.defaultContentEncoding;
    }

    /**
     * 设置默认的响应字符集
     */
    public void setDefaultContentEncoding(String defaultContentEncoding) {
        this.defaultContentEncoding = defaultContentEncoding;
    }
}
