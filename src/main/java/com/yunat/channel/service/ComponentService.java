package com.yunat.channel.service;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yunat.channel.common.MybatisDao;

@Component
public class ComponentService {
	
	@Autowired
	MybatisDao mybatisDao;
	
	Logger logger = Logger.getLogger(ComponentService.class);
	
	public List<Map<String, String>> getComponentList(String appType){
		return mybatisDao.getList("Component.getComponentList", appType);
	}
	

}
