package com.yunat.channel.cache;

import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GlobalCache {

	protected Logger logger = Logger.getLogger(getClass());


	private static GlobalCache globalCache = new GlobalCache();
    private Map<String,List<Map<String,String>>> shopMap ;


	private GlobalCache() {
        shopMap = new HashMap<String,List<Map<String,String>>>();
	}


	public static GlobalCache getGlobalCache() {
		return globalCache;
	}

    public Map<String, List<Map<String, String>>> getShopMap() {
        return shopMap;
    }

    public void setShopMap(Map<String, List<Map<String, String>>> shopMap) {
        this.shopMap = shopMap;
    }
}
