package com.cdiscount.webdataclassifier.service;

import com.cdiscount.webdataclassifier.config.WdcProperties;
import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.repository.ClassObjRepository;
import com.cdiscount.webdataclassifier.repository.ProductImageRepository;
import com.google.common.collect.Lists;
import org.apache.commons.io.FilenameUtils;
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
        // If class is specified and
        if (productImage.isImageDownloaded() && productImage.getClassObj() != null) {
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

        // Build image path
        if(!pathToDirectory.endsWith("/")) {
            pathToDirectory += "/";
        }
        pathToDirectory += productImage.getImageName();
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

}
