/**
 * @项目名称: ruma-web
 * @文件名称: ImageUtils.java
 * @Date: 2016年2月24日
 * @Copyright: 2015-2016 www.neunn.com All rights reserved. 注意：本内容仅限于东网科技有限公司内部传阅，禁止外泄以及用于其他的商业目的
 */
package com.neunn.ruma.utils;

import java.awt.Image;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

/**
 * 图片压缩工具类（通用） 本java类能将jpg、bmp、png、gif图片文件，进行等比或非等比的大小转换
 * 
 * @author 东网科技-移动互联与应用-何立洋
 * @date 2016年2月24日 
 * @since 1.0
 */
public class ImageUtils {
    private String outputDir; // 输出图路径  

    private String outputFileName; // 输出图文件名  

    private int outputWidth = 200; // 默认输出图片宽  

    private int outputHeight = 200; // 默认输出图片高  

    private boolean proportion = true; // 是否等比缩放标记(默认为等比缩放)  

    public ImageUtils() { // 初始化变量  
        outputDir = "";
        outputFileName = "";
        outputWidth = 200;
        outputHeight = 200;
    }

    public void setOutputDir(String outputDir) {
        this.outputDir = outputDir;
    }

    public void setOutputFileName(String outputFileName) {
        this.outputFileName = outputFileName;
    }

    public void setOutputWidth(int outputWidth) {
        this.outputWidth = outputWidth;
    }

    public void setOutputHeight(int outputHeight) {
        this.outputHeight = outputHeight;
    }

    public void setWidthAndHeight(int width, int height) {
        this.outputWidth = width;
        this.outputHeight = height;
    }

    /**
     * 将生成的压缩图片存储到指定目录
     * 
     * @param file
     * @throws IOException
     */
    public void compressPicToLocal(File file) throws IOException {
        BufferedImage tag = compressPic(file);
        File dir = new File(outputDir + outputFileName);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        ImageIO.write(tag, "jpeg", dir);
    }

    /**
     * 压缩图片
     * 
     * @param file
     * @return
     * @throws IOException
     */
    public BufferedImage compressPic(File file) throws IOException {
        BufferedImage tag = null;
        if (!file.exists()) {
            return tag;
        }
        Image img = ImageIO.read(file);
        // 判断图片格式是否正确   
        if (img.getWidth(null) == -1) {
            return tag;
        } else {
            int newWidth;
            int newHeight;
            // 判断是否是等比缩放   
            if (this.proportion == true) {
                // 为等比缩放计算输出的图片宽度及高度   
                double rate1 = ((double) img.getWidth(null)) / (double) outputWidth + 0.1;
                double rate2 = ((double) img.getHeight(null)) / (double) outputHeight + 0.1;
                // 根据缩放比率大的进行缩放控制   
                double rate = rate1 > rate2 ? rate1 : rate2;
                newWidth = (int) (((double) img.getWidth(null)) / rate);
                newHeight = (int) (((double) img.getHeight(null)) / rate);
            } else {
                newWidth = outputWidth; // 输出的图片宽度   
                newHeight = outputHeight; // 输出的图片高度   
            }
            tag = new BufferedImage((int) newWidth, (int) newHeight, BufferedImage.TYPE_INT_RGB);
            /*
             * Image.SCALE_SMOOTH 的缩略算法 生成缩略图片的平滑度的 优先级比速度高 生成的图片质量比较好 但速度慢
             */
            tag.getGraphics().drawImage(img.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH), 0, 0, null);
        }
        return tag;
    }

    /**
     * 按照默认高度和宽度压缩图片
     * 
     * @param outputDir
     * @param outputFileName
     * @param file
     * @throws IOException
     */
    public void compressPic(String outputDir, String outputFileName, File file) throws IOException {
        // 输出图路径   
        this.outputDir = outputDir;
        // 输出图文件名  
        this.outputFileName = outputFileName;
        compressPicToLocal(file);
    }

    /**
     * 按照指定高度和宽度压缩图片
     * 
     * @param outputDir
     * @param outputFileName
     * @param width
     * @param height
     * @param gp
     * @param file
     * @throws IOException
     */
    public void compressPic(String outputDir, String outputFileName, int width, int height, File file) throws IOException {
        // 输出图路径   
        this.outputDir = outputDir;
        // 输出图文件名   
        this.outputFileName = outputFileName;
        // 设置图片长宽  
        setWidthAndHeight(width, height);
        compressPicToLocal(file);
    }
}
