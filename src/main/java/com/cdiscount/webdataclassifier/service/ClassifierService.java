package com.cdiscount.webdataclassifier.service;

import com.cdiscount.webdataclassifier.config.WdcProperties;
import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.repository.ClassObjRepository;
import com.cdiscount.webdataclassifier.repository.ProductImageRepository;
import com.cdiscount.webdataclassifier.util.AppContext;
import com.google.common.collect.Lists;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URL;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by verhcedr on 17/02/2017.
 */
@Service
@Transactional
public class ClassifierService {

    private static Pattern CDS_IMAGE_PATTERN = Pattern.compile("http://i..cdscdn.com/pdt2/./././(.)/");
    @Autowired
    private WdcProperties properties;
    private ClassObjRepository classObjRepository;
    private ProductImageRepository productImageRepository;
    @Autowired
    public ClassifierService(ClassObjRepository classObjRepository, ProductImageRepository productImageRepository) {
        this.classObjRepository = classObjRepository;
        this.productImageRepository = productImageRepository;
    }

    public static void downloadImage(String sourceUrl, String targetDirectory) {
        try {
            URL imageUrl = new URL(sourceUrl);
            try (InputStream imageReader = new BufferedInputStream(imageUrl.openStream());
                 OutputStream imageWriter = new BufferedOutputStream(
                         new FileOutputStream(buildFullPathToImage(sourceUrl, targetDirectory)))) {
                int readByte;
                while ((readByte = imageReader.read()) != -1) {
                    imageWriter.write(readByte);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("error during image download", e);
        }
    }

    private static String buildFullPathToImage(String sourceUrl, String targetDirectory) {
        String fileName = FilenameUtils.getBaseName(sourceUrl);

        // Try to suffix filename with image number
        Matcher matcher = CDS_IMAGE_PATTERN.matcher(sourceUrl);
        if (matcher.find()) {
            fileName += "_" + matcher.group(matcher.groupCount());
        }

        return targetDirectory + File.separator
                + fileName + "." + FilenameUtils.getExtension(sourceUrl);
    }

    public void store(ProductImage productImage) {
        if (productImage.getClassObj() != null) {
            if (AppContext.INSTANCE.isValidationMode()) {
                // Check previous image class
                ProductImage previousProduct = productImageRepository.findOne(productImage.getImageUrl());
                if (previousProduct.getClassObj() != null && !previousProduct.getClassObj().equals(productImage.getClassObj())) {
                    AppContext.INSTANCE.setErrorCount(AppContext.INSTANCE.getErrorCount() + 1);
                }
            }

            // If option is enabled and class is specified, try to download image
            if (properties.getStorage().getDownloadImages() && !productImage.isImageDownloaded() && productImage.getClassObj() != null) {
                downloadImage(productImage.getImageUrl(), buildImageDestinationDir(properties.getStorage().getRootPath(), productImage));
                productImage.setImageDownloaded(true);
            }
        }
        productImageRepository.save(productImage);
    }

    public List<ClassObj> findAllClasses() {
        return Lists.newArrayList(classObjRepository.findAll());
    }

    public ProductImage getNextProductImage() {
        return productImageRepository.getNextProductImage();
    }

    public void store(List<ClassObj> classObjs) {
        classObjRepository.save(classObjs);
    }

    private String buildImageDestinationDir(String rootPath, ProductImage productImage) {
        StringBuilder directory = new StringBuilder(rootPath);
        String classDirectory = productImage.getClassObj().getDirectory();
        if (!rootPath.endsWith(File.separator) && !classDirectory.startsWith(File.separator)) {
            directory.append(File.separator);
        }
        directory.append(classDirectory);

        // Create directories if needed
        String pathToDirectory = directory.toString();
        File pathToDirectoryFile = new File(pathToDirectory);
        pathToDirectoryFile.mkdirs();

        return pathToDirectory;
    }

    public void deleteAll() {
        productImageRepository.deleteAll();
        classObjRepository.deleteAll();
    }

    public Integer calculateProgress() {
        return productImageRepository.calculateProgress();
    }

    public List<ProductImage> findAllProducts() {
        return Lists.newArrayList(productImageRepository.findAll());
    }

    public ProductImage getPreviousProductImage() {
        return productImageRepository.getPreviousProductImage();
    }
}
