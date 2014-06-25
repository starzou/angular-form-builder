package com.yunat.channel.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.apache.log4j.Logger;

public class HttpUtil {
	private static final Logger logger = Logger.getLogger(HttpUtil.class);
	public static final String ERROR = "error";

	public static String connectURL(String commString, String address) {
		String rec_string = "";
		URL url = null;
		HttpURLConnection urlConn = null;
		try {
			url = new URL(address);
			urlConn = (HttpURLConnection) url.openConnection();
			urlConn.setConnectTimeout(1000 * 60 * 5);
			urlConn.setReadTimeout(1000 * 60 * 5);
			urlConn.setRequestMethod("POST");
			urlConn.setDoOutput(true);
			OutputStream out = urlConn.getOutputStream();
			out.write(commString.getBytes());
			out.flush();
			out.close();
			BufferedReader rd = new BufferedReader(new InputStreamReader(urlConn.getInputStream(), "UTF-8"));
			StringBuffer sb = new StringBuffer();
			int ch;
			while ((ch = rd.read()) > -1) {
				sb.append((char) ch);
			}
			rec_string = sb.toString().trim();
			rd.close();
		} catch (Exception e) {
			logger.error("http请求提交异常信息：", e);
			rec_string = ERROR;
		} finally {
			if (urlConn != null) {
				urlConn.disconnect();
			}
		}
		return rec_string;
	}
	
	public static String connectURLGET(String address) {
		String rec_string = "";
		URL url = null;
		HttpURLConnection urlConn = null;
		try {
			url = new URL(address);
			urlConn = (HttpURLConnection) url.openConnection();
			urlConn.setConnectTimeout(1000 * 60 * 5);
			urlConn.setReadTimeout(1000 * 60 * 5);
			urlConn.connect();
			BufferedReader rd = new BufferedReader(new InputStreamReader(urlConn.getInputStream(), "UTF-8"));
			StringBuffer sb = new StringBuffer();
			int ch;
			while ((ch = rd.read()) > -1) {
				sb.append((char) ch);
			}
			rec_string = sb.toString().trim();
			rd.close();
		} catch (Exception e) {
			logger.info("订购中心连接异常",e);
		} finally {
			if (urlConn != null) {
				urlConn.disconnect();
			}
		}
		return rec_string;
	}
	
	public static String connectURL(String commString, String address, String code) {
		String rec_string = "";
		URL url = null;
		HttpURLConnection urlConn = null;
		try {
			url = new URL(address);
			urlConn = (HttpURLConnection) url.openConnection();
			urlConn.setConnectTimeout(1000 * 60 * 5);
			urlConn.setReadTimeout(1000 * 60 * 5);
			urlConn.setRequestMethod("POST");
			urlConn.setDoOutput(true);
			OutputStream out = urlConn.getOutputStream();
			out.write(commString.getBytes());
			out.flush();
			out.close();
			BufferedReader rd = new BufferedReader(new InputStreamReader(urlConn.getInputStream(), code));
			StringBuffer sb = new StringBuffer();
			int ch;
			while ((ch = rd.read()) > -1) {
				sb.append((char) ch);
			}
			rec_string = sb.toString().trim();
			rd.close();
		} catch (Exception e) {
			logger.error("http请求提交异常信息：", e);
			rec_string = ERROR;
		} finally {
			if (urlConn != null) {
				urlConn.disconnect();
			}
		}
		return rec_string;
	}
}
