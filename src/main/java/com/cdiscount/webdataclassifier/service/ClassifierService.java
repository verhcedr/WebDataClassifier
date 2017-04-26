package com.cdiscount.webdataclassifier.service;

import com.cdiscount.webdataclassifier.config.WdcProperties;
import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.repository.ClassObjRepository;
import com.cdiscount.webdataclassifier.repository.ProductImageRepository;
import com.google.common.collect.Lists;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URL;
import java.util.List;

/**
 * Created by verhcedr on 17/02/2017.
 */
@Service
@Transactional
public class ClassifierService {

    @Autowired
    private WdcProperties properties;

    @Autowired
    public ClassifierService(ClassObjRepository classObjRepository, ProductImageRepository productImageRepository) {
        this.classObjRepository = classObjRepository;
        this.productImageRepository = productImageRepository;
    }

    private ClassObjRepository classObjRepository;
    private ProductImageRepository productImageRepository;

    public void store(ProductImage productImage) {
        // If option is enabled and class is specified, try to download image
        if (properties.getStorage().getDownloadImages() && !productImage.isImageDownloaded() && productImage.getClassObj() != null) {
            downloadImage(productImage.getImageUrl(), buildImageDestinationDir(properties.getStorage().getRootPath(), productImage));
            productImage.setImageDownloaded(true);
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
        if(!rootPath.endsWith("/") && !classDirectory.startsWith("/")) {
            directory.append("/");
        }
        directory.append(classDirectory);

        // Create directories if needed
        String pathToDirectory = directory.toString();
        File pathToDirectoryFile = new File(pathToDirectory);
        pathToDirectoryFile.mkdirs();

        return pathToDirectory;
    }

    public static void downloadImage(String sourceUrl, String targetDirectory) {
        try {
            URL imageUrl = new URL(sourceUrl);
            try (InputStream imageReader = new BufferedInputStream(imageUrl.openStream());
                 OutputStream imageWriter = new BufferedOutputStream(
                         new FileOutputStream(targetDirectory + File.separator
                                 + FilenameUtils.getName(sourceUrl)))) {
                int readByte;
                while ((readByte = imageReader.read()) != -1) {
                    imageWriter.write(readByte);
                }

            }
        } catch (IOException e) {
            throw new RuntimeException("error during image download", e);
        }
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
}
