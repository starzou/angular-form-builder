package com.yunat.channel.util;

import java.util.Stack;

import org.apache.commons.lang.StringUtils;

public class SysConvert {
	
	private static char[] CHAR_SET    = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();   
	
	private static char[] CHAR_PREFIX = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
	
	/***
	 *  convert 10 to 62
	 * @param number
	 * @return
	 */
	public static String convert10To62(long number){  
        Long rest=number;  
        Stack<Character> stack=new Stack<Character>();  
        StringBuilder result=new StringBuilder(0);  
        while(rest!=0){  
            stack.add(CHAR_SET[new Long((rest-(rest/62)*62)).intValue()]);  
            rest=rest/62;  
        }  
        for(;!stack.isEmpty();){  
            result.append(stack.pop());  
        }  
        return result.toString();  
   } 
	
	/***
	 * convert 62 to 10
	 * @param param
	 * @return String
	 */
	private static String convertBase62ToDecimal( String param) {  
        int decimal = 0;  
        int base = 62;  
        int keisu = 0;  
        int cnt = 0;  
  
        byte ident[] = param.getBytes();  
        for ( int i = ident.length - 1; i >= 0; i-- ) {  
            int num = 0;  
            if ( ident[i] > 48 && ident[i] <= 57 ) {  
                num = ident[i] - 48;  
            }  
            else if ( ident[i] >= 65 && ident[i] <= 90 ) {  
                num = ident[i] - 65 + 10;  
            }  
            else if ( ident[i] >= 97 && ident[i] <= 122 ) {  
                num = ident[i] - 97 + 10 + 26;  
            }  
            keisu = (int) java.lang.Math.pow( (double) base, (double) cnt );  
            decimal += num * keisu;  
            cnt++;  
        }  
        return String.format( "%08d", decimal );  
    }
	
	
	/***
	 * 返回短链接随机数码
	 * @param cid
	 * @return String
	 */
	public static String generateShortUrl(Long cid,String startLetter){
		String letter = null;
		if(StringUtils.isNotBlank(startLetter)){
			letter = String.valueOf(CHAR_PREFIX[0]);
		}else{
			int random = (int)(Math.random() * 26);
			letter = String.valueOf(CHAR_PREFIX[random]);
		}
		
		if(StringUtils.isNotBlank(letter)){
			String numAndChar = convert10To62(cid);
			StringBuffer buffer = new StringBuffer(letter);
			buffer.append(numAndChar);
			//int index = ArrayUtils.indexOf(CHAR_PREFIX, CharUtils.toChar(startLetter));
			return buffer.toString();
		}
		return null;
	}
	
	public static void main(String[] args) {
		Long cid = 34L;
		System.out.println(generateShortUrl(cid,null));
		System.out.println(convertBase62ToDecimal("G8"));
	}
}
