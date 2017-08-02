/**
 *@项目名称: interactive_marketing_base
 *@文件名称: Utils.java
 *@Date: 2015年11月24日
 *@Copyright: 2015-2015 www.neunn.com  All rights reserved.
 *注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 工具类
 * 
 * @author Poppy Wong
 * @date 2015年11月24日
 * @since 1.0
 */
public class MD5Util {

	/**
	 * 
	 * 32位MD5加密算法
	 * 
	 * @author wangxin
	 * @date 2015年9月6日
	 * @param plainText
	 * @return
	 * @since 1.0
	 */
	public static String md5s32(String plainText) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(plainText.getBytes());
			byte b[] = md.digest();
			int i;
			StringBuffer buf = new StringBuffer("");
			for (int offset = 0; offset < b.length; offset++) {
				i = b[offset];
				if (i < 0) {
					i += 256;
				}
				if (i < 16) {
					buf.append("0");
				}
				buf.append(Integer.toHexString(i));
			}
			return buf.toString();
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 
	 * 16位MD5加密算法
	 * 
	 * @author wangxin
	 * @date 2015年9月6日
	 * @param plainText
	 * @return
	 * @since 1.0
	 */
	public static String md5s16(String plainText) {
		String str = md5s32(plainText);
		if (str == null) {
			return null;
		} else {
			return str.substring(8, 24);
		}
	}

	/**
	 * 
	 * 8位MD5加密算法
	 * 
	 * @author wangxin
	 * @date 2015年9月6日
	 * @param plainText
	 * @return
	 * @since 1.0
	 */
	public static String md5s8(String plainText) {
		String str = md5s16(plainText);
		if (str == null) {
			return null;
		} else {
			return str.substring(8, 16);
		}
	}

}
