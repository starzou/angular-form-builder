package com.yunat.channel.controller.base;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.yunat.channel.common.MybatisDao;

/**
 * 简单CRUD通用的Controller
 */
@Controller
public class BaseController {
    Logger logger = Logger.getLogger(this.getClass());

    @Autowired
    private MybatisDao myBatisDao;

    @RequestMapping("/")
    public String defaultView() {
        return "index";
    }

    @SuppressWarnings({"rawtypes"})
    @RequestMapping("query")
    public ModelAndView query(BaseMapBean mapBean) {
        Map map = mapBean.getMap();

        List<Map> resultMap = myBatisDao.getList((String) map.get("key"), map);
        logger.info("resultMap:" + resultMap);

        return new ModelAndView((String) map.get("path"), "list", resultMap);
    }

    @SuppressWarnings({"rawtypes"})
    @RequestMapping("save")
    public String save(BaseMapBean mapBean) {
        Map map = mapBean.getMap();

        logger.info(map);

        myBatisDao.save((String) map.get("key"), map);

        return (String) map.get("path");
    }
}
