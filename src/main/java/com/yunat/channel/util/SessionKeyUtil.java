package com.yunat.channel.util;/**
 * Created by Administrator on 2014/6/19.
 */

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import org.apache.log4j.Logger;

import javax.ws.rs.core.MediaType;

/**
 * Created by xiahui.zhang on 2014/06/19 15:31.
 *
 * @author xiahui.zhang
 */
public class SessionKeyUtil {
    private String app_id_ucenter ;
    private String ticket ;
    private String ucenter_rest_url ;


    Logger logger = Logger.getLogger(SessionKeyUtil.class);

    public SessionKeyUtil(String app_id,String ticket,String url){
        this.app_id_ucenter = app_id;
        this.ticket = ticket;
        this.ucenter_rest_url = url;
    }

    private String baseSubscribeMethod(String paramUrl){
        String url_get = ucenter_rest_url+paramUrl;
        logger.info("调用订购中心接口, url = " +url_get);
        String result = null;
        try {
            Client client = Client.create();
            WebResource resource = client.resource(url_get);
            ClientResponse response = resource.type(MediaType.APPLICATION_JSON_TYPE).accept(MediaType.APPLICATION_JSON_TYPE).get(ClientResponse.class);
            if (null != response && 200!=response.getStatus()) {
                logger.error("调用订购中心接口失败!url=["+url_get+"];http_error_code:='"+response.getStatus()+"'");
                throw new RuntimeException("Failed : HTTP Error Code:"+ response.getStatus());
            }
            result = response.getEntity(String.class);
        }catch (Exception e) {
            logger.info("调订购中心客户端异常", e);
        }


        return result;
    }

    /***
     * 获取accessToken
     * @param shopId
     * @return
     */
    public String getAccessToken(Long shopId){
        String montage_url = "/rest/services/access_token_service/action/find/invoke?ticket="+ticket+"&app_id="+app_id_ucenter+"&shop_id=taobao_"+shopId+"";
        String output = baseSubscribeMethod(montage_url);
        return output;
    }

    /***
     * 根据店铺id获取sessionkey
     * @param shopId
     * @return
     */
    public String getSessionKey(Long shopId){
        String sessionKey = null;
        String result = getAccessToken(shopId);
        if(result!=null){
            try {
                JSONArray array = JSONObject.parseObject(result).getJSONArray("data");
                if(array.isEmpty()){
                    logger.info("获取["+shopId+"]店铺的sessionKey接口未返回数据data:"+array);
                    return null;
                }else{
                    JSONObject jsonObj = JSONObject.parseObject(array.get(0).toString());
                    logger.info("获取["+shopId+"]店铺的session成功,sessionkey=["+jsonObj.getString("accessToken")+"]");
                    sessionKey = jsonObj.getString("accessToken");
                }
            } catch (Exception e) {
                logger.info("调订购中心返回数据解析错误", e);
            }
        }
        return sessionKey;
    }
}
