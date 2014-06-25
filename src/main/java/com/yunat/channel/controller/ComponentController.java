package com.yunat.channel.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yunat.channel.service.ComponentService;
import com.yunat.channel.service.CouponService;

@Controller
@RequestMapping("component")
public class ComponentController {

    @Autowired
    ComponentService componentService;
    
    @Autowired
    CouponService couponService;

    Logger logger = Logger.getLogger(ComponentController.class);

    /**
     * 根据应用类型获取组件列表
     *
     * @param appType
     * @return map
     */
    @ResponseBody
    @RequestMapping(value = "/{appType}", method = RequestMethod.GET)
    public Map<String, Object> getComponentList(@PathVariable String appType) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, String>> list = componentService.getComponentList(appType);
        map.put("data", list);
        return map;
    }
    
    /**
     * 根据平台店铺，获取coupon详细信息
     *
     * @param dpId
     * @return
     */
	@ResponseBody
    @RequestMapping(value = "/getCouponDescription", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getCouponDescription(@RequestParam Long shopId,@RequestParam String url) {
		Map<String, Object> returnMap = new HashMap<String, Object>();
		Map<String, Object> dataMap = new HashMap<String, Object>();
		
		String decodeUrl = null;
		try {
			decodeUrl = URLDecoder.decode(url, "UTF-8");
			if (shopId != null && StringUtils.isNotBlank(decodeUrl)) {
				String filterStr = ".taobao.com";
				if(decodeUrl.indexOf(filterStr)>0){
					dataMap = couponService.spliceCouponInfo(shopId, decodeUrl);
				}
			} else {
				logger.info("参数不可为空，请检查参数地正确性，shopId: " + shopId + " , url: " + decodeUrl + ".");
			}
		} catch (UnsupportedEncodingException e1) {
			logger.error("url解码出错!",e1);
		}
		
		dataMap.put("link", url);
		returnMap.put("data", dataMap);
		return returnMap;
    }
	

}