/**
 * Created by Administrator on 2014/6/10.
 */
package com.yunat.channel.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.WebUtils;

import com.yunat.base.util.JackSonMapper;
import com.yunat.channel.controller.vo.ContentVo;
import com.yunat.channel.service.ContentService;
import com.yunat.channel.util.SysConvert;
import com.yunat.utility.sign.SignParameters;
import com.yunat.utility.sign.Signer;
import com.yunat.utility.sign.Signer.ResultType;
import com.yunat.utility.sign.SignerImpl;


/**
 * 客户端页面渲染
 * Created by xiahui.zhang on 2014/06/10 15:21.
 *
 * @author xiahui.zhang
 */
@Controller
@RequestMapping("content")
public class ContentController {

    Logger logger = Logger.getLogger(ContentController.class);

    @Resource
    private ContentService contentService;

    /**
     * 添加内容信息
     *
     * @param contentVo
     * @return map
     */
    @ResponseBody
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public Map<String, Object> insertContentInfo(@RequestBody ContentVo contentVo) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("code", 0);
        map.put("msg", "保存失败！");
        if (contentVo != null) {
            try {
                String componentsStr = "[]";
                if (contentVo.getComponents() != null) {
                    List<Object> list = contentVo.getComponents();
                    componentsStr = JackSonMapper.toJsonString(list);
                    logger.info("保存的页面json数据为：" + componentsStr);
                }
                contentVo.setComponentsStr(componentsStr);
                //未发布
                contentVo.setStatus(0);

                if (contentVo.getUserId() == null || contentVo.getUserName() == null) {
                    map.put("msg", "用户为空，保存失败！");
                    return map;
                }

                if (contentVo.getTitle() == null) {
                    map.put("msg", "标题为空，保存失败！");
                    return map;
                }

                if (contentVo.getType() == null) {
                    map.put("msg", "系统参数错误，保存失败！");
                    return map;
                }

                if (contentVo.getCid() == null) {
                    contentService.insertContentInfo(contentVo);
                } else {
                    contentService.updateContentInfo(contentVo);
                }
                if (contentVo.getCid() != null) {
                    map.put("code", 1);
                    map.put("cid", contentVo.getCid());
                    map.put("msg", "保存成功！");
                }
            } catch (Exception e) {
                logger.error("保存数据异常!", e);
            }
        } else {
            logger.info("参数为空，请检查");
        }
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/get/{cid}", method = RequestMethod.GET)
    public Map<String, Object> getIdToContent(@PathVariable Long cid) {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> data = contentService.getIdToContent(cid);
        map.put("code", 1);
        map.put("data", data);
        map.put("msg", "查询成功！");
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/delete/{cid}", method = RequestMethod.DELETE)
    public Map<String, Object> deleteContent(@PathVariable Long cid) {
        Map<String, Object> map = new HashMap<String, Object>();
        contentService.deleteContent(cid);
        map.put("code", 1);
        map.put("msg", "操作成功！");
        return map;
    }

    @ResponseBody
    @RequestMapping(value = "/query", method = RequestMethod.GET)
    public Map<String, Object> queryContent(String type, String userId) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, Object>> list = contentService.queryContent(type, userId);
        map.put("code", 1);
        map.put("data", list);
        map.put("msg", "查询成功！");
        return map;
    }

    @RequestMapping(value = "/contentManage", method = RequestMethod.GET)
    public String contentManage(HttpServletRequest request, HttpServletResponse response,RedirectAttributes attr) throws ServletException, IOException {
        response.setCharacterEncoding("UTF-8");
        ResultType type = contentService.checkSigner(request);
        String msg = "";
        if (type == ResultType.SUCCESS) {
            logger.info("==内容管理系统签名认证成功=");
            String opt_name = request.getParameter("username");
            String interface_name = request.getParameter("interface");
            if (StringUtils.isEmpty(interface_name)) {
                interface_name = "page";
            }
            logger.info("==用户【" + opt_name + "】已经登入内容管理系统=");
            WebUtils.setSessionAttribute(request, "opt_name", opt_name);
            if ("page".equals(interface_name)) {//CCMS嵌入
                String set_id = request.getParameter("set_id");
                request.setAttribute("msg", "签名验证成功");
                List<Map<String,String>> list = new ArrayList<Map<String,String>>();
                String data  = request.getParameter("data");
                if(data!=null&&!"".equals(data)) {
                    String[] dataes = data.split(String.valueOf((char) 1));
                    for (String shopStr : dataes) {
                        String[] shops = shopStr.split(String.valueOf((char) 2));
                        if (shops.length == 2) {
                            Map<String, String> map = new HashMap<String, String>();
                            map.put("userId", shops[0]);
                            map.put("userName", shops[1]);
                            logger.info("==用户【" + opt_name + "】已经登入内容管理系统【" + shops[0] + "】【" + shops[1] + "】=");
                            list.add(map);
                        }
                    }
                }else{
                    list = contentService.getUserSource(opt_name);
                }
                if(list.size()>0) {
                    String shops = JackSonMapper.toJsonString(list);
                    Cookie cookie = new Cookie("shops", URLEncoder.encode(shops,"UTF-8"));
                    //cookie.setDomain("localhost");
                    //todo
                    cookie.setPath("/channel-content");
                    response.addCookie(cookie);
                }
                return "redirect:/";
            } else {
                msg = "Interface name error";
            }
        } else if (type == ResultType.EXPIRED) {
            logger.info("==内容管理系统签名认证过期==");
            msg = "Signature validity expired";
        } else {
            logger.info("==内容管理系统签名认证失败==");
            msg = "Signature verification failed";
        }
        attr.addAttribute("msg", msg);
        return "redirect:/fail.jsp";

    }


    @ResponseBody
    @RequestMapping(value = "getUrlToContent", method = RequestMethod.GET)
    public Map<String, Object> getUrlToContent(@RequestParam String url) {
        return contentService.getUrlToContent(url);
    }

    /**
     * 发布
     *
     * @param cid
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "publish/{cid}", method = RequestMethod.GET)
    public Map<String, Object> publish(@PathVariable Long cid) {

        Map<String, Object> returnMap = new HashMap<String, Object>();
        returnMap.put("code", 0);
        returnMap.put("msg", "发布失败！");

        if (cid != null) {
            //生成短链接
            String url = null;
            try {
                url = SysConvert.generateShortUrl(cid, null);
                
                logger.info("生成短链接url ＝ " + url);
                
                if (StringUtils.isNotBlank(url)) {
                    Map<String, Object> param = new HashMap<String, Object>();
                    param.put("url", url);
                    param.put("status", 1);
                    param.put("cid", cid);
                    contentService.updateContentUrlByCid(param);

                    returnMap.put("code", 1);
                    returnMap.put("url", url);
                    returnMap.put("msg", "发布成功!");
                }
            } catch (Exception e) {
                logger.error("生成短链接出现异常!", e);
            }
        } else {
            logger.info("cid不可为空，请检查参数得正确性!");
        }
        return returnMap;
    }


    @ResponseBody
    @RequestMapping(value = "/getUrl", method = RequestMethod.GET)
    public String getUrl(@RequestParam String opt_name,String set_id,String data) throws ServletException,IOException {
        String url = "";
        Map<String, Object> map = contentService.getContentConfig("200021");
        Long time = new Date().getTime();
        String c1 = String.valueOf((char) 1);
        String c2 = String.valueOf((char) 2);
        String shop = "";
        String [] shopstr = data.split("\\|");
        if(shopstr.length>0){
            for(String shopId : shopstr){
                String [] shopT = shopId.split(",");
                if(shopT.length==2){
                    shop = shop+shopT[0]+c2+shopT[1]+c1;
                }
            }
        }
        /*String shop = "toabao_256485"+c2+"何建伟的店铺"+c1
                +"71677914"+c2+"朱渺的店铺"+c1
                +"toabao_256483"+c2+"刘奎的店铺"+c1
                +"toabao_256482"+c2+"满刚的店铺"+c1
                +"toabao_256481"+c2+"小也中山店"+c1
                +"toabao_256454"+c2+"张正彦的店铺";*/
        //shop = URLEncoder.encode(shop);
        if (map.get("secret") != null && map.get("url") != null && map.get("interface_name") != null) {
            SignParameters signParameters = new SignParameters();
            //signParameters.setClientId("200021");//账户系统提供
            signParameters.setHttpMethod("GET");
            signParameters.setSecret(map.get("secret").toString());//账户系统提供
            //signParameters.setInterfaceName(map.get("interface_name").toString());//账户系统提供，根据调用接口定义
            signParameters.setTimestamp(time);//时间戳
            Map<String, String> arguments = new HashMap<String, String>();
            arguments.put("username", opt_name);
            arguments.put("data", shop);
            //arguments.put("set_id", set_id);
            //arguments.put("client_id", "200021");
            //arguments.put("interface", map.get("interface_name").toString());
            arguments.put("timestamp", time.toString());
            signParameters.setArguments(arguments);
            Signer signer = new SignerImpl();
            String sign = signer.generateSign(signParameters);
            System.out.println("==用户【qiushi】进入账户管理系统的签名为【" + sign + "】==");
            url = map.get("url").toString()
                    + "?username="+opt_name
                    + "&data="+shop
                   // + "&set_id="+set_id
                   // + "&client_id=200021"
                   // + "&interface=" + map.get("interface_name").toString()
                    + "&timestamp=" + time.toString()
                    + "&sign=" + sign;
            System.out.println("url:" + url);
        }
        /*request.setAttribute("url", url);
        request.getRequestDispatcher("/test.jsp").forward(request,response);*/
        return url;
    }

}
