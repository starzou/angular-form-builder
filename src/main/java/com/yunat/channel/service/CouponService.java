package com.yunat.channel.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.taobao.api.TaobaoClient;
import com.yunat.channel.cache.InitPlatClient;
import com.yunat.channel.common.MybatisDao;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.tools.ant.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.taobao.api.domain.Activity;
import com.taobao.api.domain.Coupon;
import com.taobao.api.request.PromotionActivityGetRequest;
import com.taobao.api.request.PromotionCouponsGetRequest;
import com.taobao.api.response.PromotionActivityGetResponse;
import com.taobao.api.response.PromotionCouponsGetResponse;
import com.yunat.channel.util.TaobaoLoginUtils;
import com.yunat.channel.controller.vo.SellerCouponActivityVo;

@Component
public class CouponService {
	
	Logger logger = Logger.getLogger(CouponService.class);
	
    @Autowired
    private MybatisDao mybatisDao;

    public InitPlatClient platClient = InitPlatClient.getPlatClient();


    public Map<String, Object> spliceCouponInfo(Long shopId,String url){
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            Long activityId = getActivityIdByContent(url);
            if(activityId!=null){
                SellerCouponActivityVo seActivityVo = getPlatCouponActivity(shopId,activityId);
                if(seActivityVo!=null){
                    map.put("condition", seActivityVo.getCondition()/100);
                    map.put("discountAmount", seActivityVo.getDenominations()/100);
                    String expire_start = DateUtils.format(seActivityVo.getCreateTime(), "yyyy.MM.dd");
                    String expire_end   = DateUtils.format(seActivityVo.getEndTime(), "yyyy.MM.dd");
                    map.put("expire", expire_start+"-"+expire_end);
                }
            }
        } catch (Exception e) {
            logger.error("获取店铺--shopId: " + shopId + " 优惠券信息失败!", e);
        }
        return map;
    }

	
	/**
     * 解析优惠券活动ID
     *
     * @param url
     * @return activityId
     */
    public Long getActivityIdByContent(String url) {
        if (StringUtils.isEmpty(url)) {
            logger.info("优惠券领取链接不能为空!");
            return null;
        }
        Long activityId = getActivityId(url, "activity_id=");
        if (activityId == null) {
            activityId = getActivityId(url, "activityId=");
        }
        return activityId;
    }
    
    
    private Long getActivityId(String url, String activityIdStr) {
    	
    	String newUrl = StringUtils.isNotBlank(url)?url.trim():null;
    	
    	if(StringUtils.isBlank(newUrl)){
    		return null;
    	}
    	
        Integer index_str = newUrl.indexOf(activityIdStr);
        if (index_str <= -1) {
            return null;
        }
        
        String str_ = newUrl.substring(index_str + activityIdStr.length(), newUrl.length());
        StringBuffer subStr = new StringBuffer();
        for (int i = 0; i < str_.length(); i++) {
            String strInt_ = str_.substring(i, i + 1);
            if (isNumeric(strInt_)) {
                subStr.append(strInt_);
            } else {
                break;
            }
        }
        if (StringUtils.isEmpty(subStr.toString())) {
            return null;
        }
        return Long.valueOf(subStr.toString());
    }
    
    /**
     * 获取优惠券信息
     *
     * @param shopId,activityId
     * @param activityId
     */
    public SellerCouponActivityVo getPlatCouponActivity(Long shopId, Long activityId) {
        try {
            if(shopId==null){
                logger.info("店铺Id不能为空!");
                return null;
            }

            TaobaoClient client = platClient.getClient();
            String sessionKey = platClient.getSessionKey(shopId);

            if(StringUtils.isBlank(sessionKey)){
                logger.info("未获取到店铺["+shopId+"]sessionkey!");
                return null;
            }

            PromotionActivityGetRequest requestAct = new PromotionActivityGetRequest();
            requestAct.setActivityId(activityId);
            PromotionActivityGetResponse responseAct = TaobaoLoginUtils.afterExecuteRequest(requestAct, client,sessionKey);
            if (responseAct != null && responseAct.isSuccess()) {
                SellerCouponActivityVo activityVo = new SellerCouponActivityVo();
                List<Activity> acts = responseAct.getActivitys();
                if (CollectionUtils.isEmpty(acts)) {
                    logger.info("shopId:" + shopId + ",activityId:" + activityId + " 淘宝平台没有找到对应的优惠券活动！");
                    return null;
                }

                Activity activity = acts.get(0);

                Coupon coupon = getCoupon(activity.getCouponId(), sessionKey);
                if (coupon != null) {
                    activityVo.setCondition(Double.valueOf(coupon.getCondition().toString()));
                    activityVo.setDenominations(Integer.valueOf(coupon.getDenominations().toString()));
                    activityVo.setCreateTime(coupon.getCreatTime());
                    activityVo.setEndTime(coupon.getEndTime());
                }
                return activityVo;
            }
            logger.error("获取优惠券信息失败！--code:" + responseAct.getErrorCode() + ",msg:" + responseAct.getMsg() + ",subCode:" + responseAct.getSubCode() + ",subMsg:" + responseAct.getSubMsg() + ",body:" + responseAct.getBody());
            return null;
        } catch (Exception e) {
            logger.error("获取优惠券信息出错--dpId:" + shopId + ",activityId:" + activityId + "!", e);
        }
        return null;
    }

    /**
     * 查询优惠券
     *
     * @param couponId
     * @param sessionKey
     * @return coupon
     */
    private Coupon getCoupon(Long couponId, String sessionKey) {
        PromotionCouponsGetRequest request = new PromotionCouponsGetRequest();
        request.setCouponId(couponId);
        try {
            TaobaoClient client = platClient.getClient();
            PromotionCouponsGetResponse res = TaobaoLoginUtils.afterExecuteRequest(request, client,sessionKey);
            if (res != null && res.isSuccess() && res.getCoupons().size() == 1) {
                List<Coupon> coupons = res.getCoupons();
                return coupons.get(0);
            } else {
                logger.error("responseCoupon:" + res);
            }
        } catch (Exception e) {
        	logger.error("查询优惠券出错，couponId:"+couponId,e);
        }
        return null;
    }
    
    /***
     * 判断是否为数字
     * @param val
     * @return boolean
     */
    public Boolean isNumeric(String val){
    	try {
			Integer.parseInt(val);
			return true;
		} catch (Exception e) {
			logger.error("将val转化成Integer类型失败!",e);
			return false;
		}
    }

    /**
     * 调订购中心获取sessionKey密码
     * @param name
     */
    public Map<String, Object> getNameToConfig(String name){
        return mybatisDao.getSingleRow("Content.getNameToConfig", name);
    }
}
