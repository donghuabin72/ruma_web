/**
 * @项目名称: ruma-web
 * @文件名称: LoginController.java
 * @Date: 2016年3月3日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.controller;

import java.awt.Color;

import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.math.NumberUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.neunn.ruma.common.config.Global;
import com.neunn.ruma.common.web.BaseController;
import com.neunn.ruma.entity.UserEntity;
import com.neunn.ruma.service.UserService;
import com.neunn.ruma.utils.DateUtils;
import com.neunn.ruma.utils.ObjectUtils;
import com.neunn.ruma.utils.StringUtils;
import com.neunn.ruma.utils.cache.CacheUtils;

/**
 * 登录Controller
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年3月3日
 * @since 1.0
 */
@Controller
public class LoginController extends BaseController {
    
    public static final String VALIDATE_CODE = "validateCode";

    private int w = 70;

    private int h = 26;
    
    @Autowired
    private UserService userService;

    /**
     * 登录
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年3月4日
     * @param user
     * @param request
     * @param response
     * @param model
     * @return 返回的resultMap信息中包括:提示信息msg,返回状态status, 登录成功后的用户信息user
     *         session中的用户信息key=userSession,redis中的用户信息key=userCache
     * @since 1.0
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(HttpServletRequest request, HttpServletResponse response) {
        UserEntity user = new UserEntity();
        user.setUsername(request.getParameter("username"));
        user.setPasswd(request.getParameter("password"));
        Map<String, Object> resultMap = new HashMap<String, Object>();
        try {
            //redis缓存密码错误次数的key
            String redisKey = "";
            UserEntity findUser = userService.findUser(user);
            if (ObjectUtils.isEmpty(findUser)) {
                //用户不存在
                resultMap.put(Global.MSG, Global.getConfig("login.notexist"));
                resultMap.put(Global.STATUS, Global.FAIL);
            } else if ("1".equals(findUser.getLockFlag())) {
                //用户被冻结
                resultMap.put(Global.MSG, Global.getConfig("login.lock"));
                resultMap.put(Global.STATUS, Global.FAIL);
            } else {
                //允许用户输入密码错误几次
                int validatePasswordCount =
                        StringUtils.toInteger(Global.getConfig("validate.password.error.count"));
                redisKey = user.getUsername() + "_validatecount";
                if (!user.getPasswd().equals(findUser.getPasswd())) {
                    //密码错误，根据前台提交的次数校验
                    resultMap.put(Global.STATUS, Global.FAIL);
                    int scount = 0;
                    String count = CacheUtils.getInstance().get(redisKey);
                    if (StringUtils.isNotBlank(count)) {
                        scount = validatePasswordCount - StringUtils.toInteger(count) - 1;
                        CacheUtils.getInstance().set(redisKey, String.valueOf(StringUtils.toInteger(count) + 1),
                                0);
                        if (scount == 0) {
                            resultMap.put(Global.MSG, Global.getConfig("login.lock"));
                            CacheUtils.getInstance().del(redisKey);
                            userService.lockUser(findUser);
                        } else {
                            resultMap.put(Global.MSG,
                                    Global.getConfig("login.passworderror") + scount + "次");
                        }
                    } else {
                        scount = validatePasswordCount - 1;
                        CacheUtils.getInstance().set(redisKey, String.valueOf(1), 0);
                        resultMap.put(Global.MSG,
                                Global.getConfig("login.passworderror") + scount + "次");
                    }
                } else {
                    //登录成功
                    resultMap.put(Global.MSG, Global.getConfig("login.success"));
                    resultMap.put(Global.STATUS, Global.SUCCESS);
                    CacheUtils.getInstance().del(redisKey);
                    CacheUtils.getInstance().setObject(Global.USER_CACHE+findUser.getUsername(), findUser, 600);
                    CacheUtils.getInstance().del(request.getSession().getId()+"-"+VALIDATE_CODE);
                    SecurityUtils.getSubject().login(new UsernamePasswordToken(
                            findUser.getUsername(), findUser.getPasswd()));
                    logger.info(user.getUsername() + "在 " + DateUtils.getDateTime() + " 成功登录系统！");
                }
            }
        } catch (Exception e) {
            resultMap.put(Global.MSG, Global.getConfig("login.error"));
            resultMap.put(Global.STATUS, Global.FAIL);
            logger.error("系统登录异常", e);
        }
        return renderString(response, resultMap);
    }

    /**
     * 系统启动初始页面
     * 
     * @author 东网科技-移动互联与应用-何立洋
     * @date 2016年3月4日
     * @param request
     * @param response
     * @param model
     * @return
     * @since 1.0
     */
    @RequestMapping(value = "${adminPath}")
    public String login(HttpServletRequest request, HttpServletResponse response, Model model) {
        return "modules/sys/login";
    }
    
    
    
    
  
    @RequestMapping(value = "/checkValidateCode")
    public void checkValidateCode(HttpServletRequest request, HttpServletResponse response, Model model) throws IOException {
        String validateCode = request.getParameter(VALIDATE_CODE);
        String cacheCode = CacheUtils.getInstance().get(request.getSession().getId()+"-"+VALIDATE_CODE);
        if(StringUtils.isNotEmpty(validateCode) && StringUtils.isNotEmpty(cacheCode)){
            response.getOutputStream().print(validateCode.toUpperCase().equals(cacheCode)? true : false);
        }else{
            response.getOutputStream().print(false);
        }
    }
    
    @RequestMapping(value = "/createValidateCode")
    public void createValidateCode(HttpServletRequest request, HttpServletResponse response, Model model) {
        try {
            createImage(request, response);
        } catch (IOException e) {
            logger.error("创建验证码异常", e);
        }
    }
    
    
    private void createImage(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/jpeg");

        /*
         * 得到参数高，宽，都为数字时，则使用设置高宽，否则使用默认值
         */
        String width = request.getParameter("width");
        String height = request.getParameter("height");
        if (StringUtils.isNumeric(width) && StringUtils.isNumeric(height)) {
            w = NumberUtils.toInt(width);
            h = NumberUtils.toInt(height);
        }

        BufferedImage image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics g = image.getGraphics();

        /*
         * 生成背景
         */
        createBackground(g);

        /*
         * 生成字符
         */
        String s = createCharacter(g);
        CacheUtils.getInstance().set(request.getSession().getId()+"-"+VALIDATE_CODE, s, 300);
        g.dispose();
        OutputStream out = response.getOutputStream();
        ImageIO.write(image, "JPEG", out);
        out.close();

    }

    private Color getRandColor(int fc, int bc) {
        int f = fc;
        int b = bc;
        Random random = new Random();
        if (f > 255) {
            f = 255;
        }
        if (b > 255) {
            b = 255;
        }
        return new Color(f + random.nextInt(b - f), f + random.nextInt(b - f), f + random.nextInt(b - f));
    }

    private void createBackground(Graphics g) {
        // 填充背景
        g.setColor(getRandColor(220, 250));
        g.fillRect(0, 0, w, h);
        // 加入干扰线条
        for (int i = 0; i < 8; i++) {
            g.setColor(getRandColor(40, 150));
            Random random = new Random();
            int x = random.nextInt(w);
            int y = random.nextInt(h);
            int x1 = random.nextInt(w);
            int y1 = random.nextInt(h);
            g.drawLine(x, y, x1, y1);
        }
    }

    private String createCharacter(Graphics g) {
        char[] codeSeq =
                {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
                        'Z', '2', '3', '4', '5', '6', '7', '8', '9'};
        String[] fontTypes = {"Arial", "Arial Black", "AvantGarde Bk BT", "Calibri"};
        Random random = new Random();
        StringBuilder s = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            String r = String.valueOf(codeSeq[random.nextInt(codeSeq.length)]);//random.nextInt(10));
            g.setColor(new Color(50 + random.nextInt(100), 50 + random.nextInt(100), 50 + random.nextInt(100)));
            g.setFont(new Font(fontTypes[random.nextInt(fontTypes.length)], Font.BOLD, 26));
            g.drawString(r, 15 * i + 5, 19 + random.nextInt(8));
            s.append(r);
        }
        return s.toString();
    }

}
