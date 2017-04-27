package com.cdiscount.webdataclassifier.web.rest;

import com.cdiscount.webdataclassifier.config.WdcProperties;
import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.service.ClassifierService;
import com.cdiscount.webdataclassifier.util.AppContext;
import com.cdiscount.webdataclassifier.util.Utils;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/classifier")
public class ClassifierController {

    private final ClassifierService classifierService;

    @Autowired
    private WdcProperties properties;

    @Autowired
    public ClassifierController(ClassifierService classifierService) {
        this.classifierService = classifierService;
    }

    @PostMapping("/upload")
    public ResponseEntity storeData(
            @RequestParam(name = "images", required = false) String imageUrls,
            @RequestParam(name = "file", required = false) MultipartFile file,
            @RequestParam("classes") String classes,
            @RequestParam(name = "validationMode", required = false) Boolean validationMode) {

        // Reset images
        classifierService.deleteAll();

        // Check and Parse CSV file
        if (Utils.checkFile(file))
            Utils.parseFileAndSaveProductImages(file, classifierService);

        // Manage urls from textarea
        if(StringUtils.isNoneEmpty(imageUrls) && imageUrls.contains("http"))
            Arrays.stream(imageUrls.split("\r\n"))
                .map(url -> ProductImage.builder().imageUrl(url).build())
                .forEach(classifierService::store);

        // Manage classes
        List<ClassObj> classObjs = Lists.newArrayList();
        JSONArray classesArray = new JSONArray(classes);
        for (int i = 0; i < classesArray.length(); i++) {
            JSONObject current = classesArray.getJSONObject(i);
            if(current.keySet().contains("cname")) {
                classObjs.add(ClassObj.builder()
                        .cname(current.getString("cname"))
                        .directory(current.getString("directory"))
                        .shortcut(current.getString("shortcut"))
                        .build());
            }
        }
        classifierService.store(classObjs);

        // Init AppContext
        AppContext.INSTANCE.setProductImageCount(classifierService.findAllProducts().size());
        AppContext.INSTANCE.setValidationMode(validationMode);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/nextImage")
    public ProductImage getNextImage() {
        return classifierService.getNextProductImage();
    }

    @GetMapping("/previousImage")
    public ProductImage getPreviousImage() {
        return classifierService.getPreviousProductImage();
    }

    @GetMapping("/all")
    public List<ClassObj> getAllClasses() {
        return classifierService.findAllClasses();
    }

    @PostMapping("/link")
    public void saveImageClass(@RequestBody ProductImage productImage) {
        classifierService.store(productImage);
    }

    @GetMapping("/calculateProgress")
    public Integer calculateProgress() {
        return classifierService.calculateProgress();
    }

    @GetMapping("/export")
    public ResponseEntity<FileSystemResource> exportResult() throws IOException {
        String pathToExportedCsv = Utils.writeProductImagesToCsv(
                properties.getStorage().getRootPath() + "/export.csv",
                classifierService.findAllProducts(),
                classifierService.findAllClasses()
        );
        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_PDF);
        header.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=export.csv");

        return new ResponseEntity<>(new FileSystemResource(pathToExportedCsv),
                header, HttpStatus.OK);
    }
}
