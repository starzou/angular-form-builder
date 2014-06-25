/**
 *
 */
package com.yunat.channel.controller;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.yunat.channel.util.UpYun;

/**
 * @author xiahui.zhang
 * @version 创建时间：2014-4-25 上午10:21:27
 */
@Controller
@RequestMapping("fileUpload")
public class FileUploadController {


    private Logger logger = Logger.getLogger(FileUploadController.class);

    // 运行前先设置好以下三个参数
    private static final String BUCKET_NAME = "content-management";
    private static final String USER_NAME = "content";
    private static final String USER_PWD = "ae8fdceb9b76b9394d97dad88141ad17";

    /** 绑定的域名 */
    private static final String URL = "http://" + BUCKET_NAME
            + ".b0.upaiyun.com";

    /** 根目录 */
    private static final String DIR_ROOT = "/";

    private static UpYun upyun = null;

    @ResponseBody
    @RequestMapping(value = "/imageUpload", method = RequestMethod.POST)
    public String imageUpload(HttpServletRequest request) {
        String imageUrl = "";
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        if (commonsMultipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
            MultipartFile multipart = multipartHttpServletRequest.getMultiFileMap().get("file").get(0);
            try {
                File tmpFile = new File(System.getProperty("java.io.tmpdir") + System.getProperty("file.separator") +
                        multipart.getOriginalFilename());
                multipart.transferTo(tmpFile);

                // 初始化空间
                upyun = new UpYun(BUCKET_NAME, USER_NAME, USER_PWD);
                // 设置是否开启debug模式，默认不开启
                upyun.setDebug(true);

                // 要传到upyun后的文件路径

                String fileName = ".jpg";
                if(tmpFile.getName()!=null&&tmpFile.getName().split(".").length==2){
                    fileName = new Date().getTime()+"_"+ tmpFile.getName().split(".")[1];
                }

                String filePath = DIR_ROOT + new Date().getTime()+fileName;


                // 设置缩略图的参数
                Map<String, String> params = new HashMap<String, String>();

                // 设置缩略图类型，必须搭配缩略图参数值（KEY_VALUE）使用，否则无效
                params.put(UpYun.PARAMS.KEY_X_GMKERL_TYPE.getValue(),
                        UpYun.PARAMS.VALUE_FIX_BOTH.getValue());

                // 设置缩略图参数值，必须搭配缩略图类型（KEY_TYPE）使用，否则无效
                params.put(UpYun.PARAMS.KEY_X_GMKERL_VALUE.getValue(), "150x150");

                // 设置缩略图的质量，默认 95
                params.put(UpYun.PARAMS.KEY_X_GMKERL_QUALITY.getValue(), "95");

                // 设置缩略图的锐化，默认锐化（true）
                params.put(UpYun.PARAMS.KEY_X_GMKERL_UNSHARP.getValue(), "true");

                // 若在 upyun 后台配置过缩略图版本号，则可以设置缩略图的版本名称
                // 注意：只有存在缩略图版本名称，才会按照配置参数制作缩略图，否则无效
                params.put(UpYun.PARAMS.KEY_X_GMKERL_THUMBNAIL.getValue(), "small");

                // 上传文件，并自动创建父级目录（最多10级）
                boolean result = upyun.writeFile(filePath, tmpFile, true, params);
                logger.info(filePath + " 制作缩略图" + result);
                logger.info("可以通过该路径来访问图片：" + URL + filePath);
                imageUrl = URL + filePath;
                if(tmpFile.exists()){
                    tmpFile.delete();
                }
            }catch (IOException e){
                logger.info("图片上传异常：",e);
            }

        }
        return imageUrl;
    }
}
