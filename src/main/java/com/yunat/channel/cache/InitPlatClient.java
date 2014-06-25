package com.yunat.channel.cache;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import com.taobao.api.DefaultTaobaoClient;
import com.yunat.channel.common.cons.TaobaoLoginCons;
import com.yunat.channel.service.CouponService;
import com.yunat.channel.spring.SpringApp;
import com.yunat.channel.util.SessionKeyUtil;
import org.apache.log4j.Logger;
import com.taobao.api.TaobaoClient;

public class InitPlatClient {

	protected Logger logger = Logger.getLogger(getClass());

	protected CouponService couponService;

	private Map<String,TaobaoClient> taobaoClintMap;

	private Map<String,SessionKeyBean> sessionKeyMap;

	private static  InitPlatClient platclient = new InitPlatClient();


	private InitPlatClient(){
		taobaoClintMap = new HashMap<String, TaobaoClient>();
		sessionKeyMap = new HashMap<String, SessionKeyBean>();
	}

	public static  InitPlatClient getPlatClient() {
		return platclient;
	}

	public Map<String, TaobaoClient> getTaobaoClintMap() {
		return taobaoClintMap;
	}

	public void setTaobaoClintMap(Map<String, TaobaoClient> taobaoClintMap) {
		this.taobaoClintMap = taobaoClintMap;
	}

	public Map<String, SessionKeyBean> getSessionKeyMap() {
		return sessionKeyMap;
	}

	public void setSessionKeyMap(Map<String, SessionKeyBean> sessionKeyMap) {
		this.sessionKeyMap = sessionKeyMap;
	}

	public boolean isValidDate(String date) {
		boolean boo = true;
		String dateT = getTime("yyyyMMdd");
		if(!dateT.equals(date)){
			boo = false;
		}
		return boo;
	}

    public String getTime(String parrten) {
        String timestr;
        if (parrten == null || parrten.equals("")) {
            parrten = "yyyyMMddHHmmss";
        }
        java.text.SimpleDateFormat sdf = new SimpleDateFormat(parrten);
        java.util.Date cday = new Date();
        timestr = sdf.format(cday);
        return timestr;
    }


	public TaobaoClient getClient(){
		TaobaoClient client = taobaoClintMap.get("0");
		if(client==null){
            try {
                couponService = (CouponService) SpringApp.applicationContext.getBean("couponService");
                Map<String, Object> taobaoMap = couponService.getNameToConfig("taobao_client");
                if(taobaoMap!=null&&taobaoMap.get("client_id")!=null&&taobaoMap.get("secret")!=null&&taobaoMap.get("url")!=null){
                    String client_id = (String)taobaoMap.get("client_id");
                    String url = (String)taobaoMap.get("url");
                    String secret = (String)taobaoMap.get("secret");
                    client = new DefaultTaobaoClient(url, client_id,secret, TaobaoLoginCons.FORMAT_JSON,
                            TaobaoLoginCons.CONNECT_TIMEOUT, TaobaoLoginCons.READ_TIMEOUT);
                    taobaoClintMap.put("0",client);
                }else{
                    logger.info("获取配置信息【taobao_client】的数据为空");
                }
            } catch (Exception e) {
                logger.info("获取淘宝客户端异常", e);
            }
		}else{
            logger.info("取缓存中的淘宝客户端");
        }
		return client;
	}

    public String getSessionKey(Long shopId){
        String sessionKey = null;
        String cacheKey = "taobao"+shopId;
        logger.info("调订购中心获取sessionKey------------------------------cacheKey:"+cacheKey);
        if(sessionKeyMap.get(cacheKey)!=null){
            SessionKeyBean sebean = sessionKeyMap.get(cacheKey);
            String dateT = sebean.getDate();
            if(dateT!=null&&isValidDate(dateT)){
                sessionKey = sebean.getSessionKey();
            }
        }
        if(sessionKey == null){
            // 调订购中心获取sessionKey
            try {
                couponService = (CouponService) SpringApp.applicationContext.getBean("couponService");
                Map<String, Object> ucenterMap = couponService.getNameToConfig("getAccessToken");
                if(ucenterMap!=null&&ucenterMap.get("client_id")!=null&&ucenterMap.get("secret")!=null&&ucenterMap.get("url")!=null){
                    String app_id = (String)ucenterMap.get("client_id");
                    String url = (String)ucenterMap.get("url");
                    String ticket = (String)ucenterMap.get("secret");
                    SessionKeyUtil sessionKeyUtil = new SessionKeyUtil(app_id,ticket,url);
                    sessionKey = sessionKeyUtil.getSessionKey(shopId);
                    if(sessionKey!=null){
                        logger.info("通过订购中心获取sessionKey---------sessionKey:"+sessionKey);
                        SessionKeyBean sebean = new SessionKeyBean();
                        sebean.setSessionKey(sessionKey);
                        sebean.setDate(getTime("yyyyMMdd"));
                        sessionKeyMap.put(cacheKey, sebean);
                    }
                }else{
                    logger.info("获取配置信息【getAccessToken】的数据为空");
                }
            } catch (Exception e) {
                logger.info("调订购中心获取sessionKey异常", e);
            }
        }else{
            logger.info("取缓存中的sessionKey---------sessionKey:"+sessionKey);
        }
        return sessionKey;
    }

}
