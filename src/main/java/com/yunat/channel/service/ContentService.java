package com.yunat.channel.service;/**
 * Created by Administrator on 2014/6/10.
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yunat.channel.util.HttpUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yunat.base.util.JackSonMapper;
import com.yunat.channel.common.MybatisDao;
import com.yunat.channel.controller.vo.ContentVo;
import com.yunat.utility.sign.SignParameters;
import com.yunat.utility.sign.Signer;
import com.yunat.utility.sign.Signer.ResultType;
import com.yunat.utility.sign.SignerHelper;
import com.yunat.utility.sign.SignerImpl;

/**
 * Created by xiahui.zhang on 2014/06/10 15:23.
 *
 * @author xiahui.zhang
 */
@Component
public class ContentService {

    Logger logger = Logger.getLogger(ContentService.class);

    @Autowired
    private MybatisDao mybatisDao;


    /**
     * 通过短链获取要渲染的内容
     * @param url
     * @return  内容对象
     * */
    public Map<String,Object> getUrlToContent(String url){
        Map<String,Object> map = mybatisDao.getSingleRow("Content.getUrlToContent",url);
        if(map!=null&&map.get("components")!=null){
            JsonNode resultJson = JackSonMapper.toJsonNode(map.get("components").toString());
            map.put("components",resultJson);
        }
        return map;
    }

    //getIdToContent
    /**
     * 通过cid获取要渲染的内容
     * @param cid
     * @return  内容对象
     * */
    public Map<String,Object> getIdToContent(Long cid){
        Map<String,Object> map = mybatisDao.getSingleRow("Content.getIdToContent",cid);
        if(map!=null&&map.get("components")!=null){
            JsonNode resultJson = JackSonMapper.toJsonNode(map.get("components").toString());
            map.put("components",resultJson);
        }
        return map;
    }

    /**
     * 获取链接配置信息
     * @param client_id
     * @return  配置信息
     * */
    public Map<String,Object> getContentConfig(String client_id){
        return mybatisDao.getSingleRow("Content.getContentConfig", client_id);
    }

    /**
     * 验证签名
     * @param request
     * @return  签名类型
     * */
    public ResultType checkSigner(HttpServletRequest request){
        if(SignerHelper.checkRequiredParameters(request, Signer.TIMESTAMP_ARG_NAME, Signer.SIGN_ARG_NAME)){
            String sign = SignerHelper.getSign(request);
            String clientId = request.getParameter(Signer.CLIENT_ID);
            if (StringUtils.isEmpty(clientId)) {
                clientId = "200021";
            }
            SignParameters signParameters = SignerHelper.getSignParameters(request);
            Map<String,Object> map = getContentConfig(clientId);
            if(map==null){
                return ResultType.FAILURE;
            }
            if(map.get("secret")!=null){
                signParameters.setSecret(map.get("secret").toString());
            }
            Signer signer = new SignerImpl();
            String time = "30";
            Long timeL = 10l;
            if(time!=null){
                timeL = Long.parseLong(time);
            }
            //如果出现签名不通过，或者乱码，请改tomcat字符配置
            /*if(signParameters.getArguments().get("data")!=null){
                try {
                    signParameters.getArguments().put("data",new String(signParameters.getArguments().get("data").getBytes("ISO-8859-1"), "UTF-8"));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }*/
            //测试用签名有效期一天,时间参数应该可配置
            return  signer.validateSign(signParameters, timeL*60*1000, sign);
        }else{
            return ResultType.FAILURE;
        }
    }

    /**
     * 查询内容
     * @param type,user_id,status
     * @return  签名类型
     * */
    public List<Map<String,Object>> queryContent(String type,String user_id){
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        parameterMap.put("type", type);
        parameterMap.put("user_id", user_id);
        return mybatisDao.getList("Content.queryContent",parameterMap);
    }

    /**
     * 新增内容
     * @param contentVo
     * */
    public void insertContentInfo(ContentVo contentVo){
        mybatisDao.save("Content.insertContentInfo", contentVo);
    }

    /**
     * 更新内容
     * @param contentVo
     * */
    public void updateContentInfo(ContentVo contentVo){
        mybatisDao.save("Content.updateContentInfo", contentVo);
    }

    /**
     * 删除内容
     * @param cid
     * */
    public void deleteContent(Long cid){
        mybatisDao.save("Content.deleteContent", cid);
    }
    
    /***
     * 根据cid更新url和status
     * @param param
     */
    public void updateContentUrlByCid(Map<String, Object> param){
    	mybatisDao.save("Content.updateContentUrlByCid", param);
    }

    public List<Map<String, String>> getUserSource(String accountName) {
        List<Map<String, String>> returnList = new ArrayList<Map<String, String>>();
        Map<String, Object> ucenterMap = mybatisDao.getSingleRow("Content.getNameToConfig", "getNewShopsByAccount");
        if (ucenterMap != null && ucenterMap.get("secret") != null && ucenterMap.get("url") != null) {
            String url = (String) ucenterMap.get("url");
            String ticket = (String) ucenterMap.get("secret");
            StringBuilder smsUrl = new StringBuilder();
            smsUrl.append(url);
            smsUrl.append("?account_name=" + accountName);
            smsUrl.append("&ticket=" + ticket);
            logger.info("调订购中心:" + smsUrl.toString());
            String resStr = HttpUtil.connectURLGET(smsUrl.toString());
            if (resStr != null) {
                JsonNode resultJson = JackSonMapper.toJsonNode(resStr);
                List<JsonNode> dataList = resultJson.findParents("platNick");
                for (JsonNode node : dataList) {
                    Map<String, String> returnMap = new HashMap<String, String>();
                    String platNick = JackSonMapper.findValue(node, "platNick");
                    String shopId = JackSonMapper.findValue(node, "shopId");
                    returnMap.put("userId",shopId);
                    returnMap.put("userName",platNick);
                    logger.info("==用户【" + accountName + "】已经登入内容管理系统【"+shopId+"】【"+platNick+"】=");
                    returnList.add(returnMap);
                }
            }
        }
        return returnList;
    }
}
