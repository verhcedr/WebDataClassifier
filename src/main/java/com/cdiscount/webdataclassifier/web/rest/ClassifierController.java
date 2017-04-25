package com.cdiscount.webdataclassifier.web.rest;

import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.service.ClassifierService;
import com.cdiscount.webdataclassifier.service.StorageService;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/classifier")
public class ClassifierController {

    private final ClassifierService classifierService;

    @Autowired
    public ClassifierController(ClassifierService classifierService) {
        this.classifierService = classifierService;
    }

    @PostMapping("/upload")
    public ResponseEntity storeData(@RequestParam(name="images", required=false) String imageUrls, @RequestParam(name="file", required=false) MultipartFile file, @RequestParam("classes") String classes) {
        // Check and Parse CSV file
        if (checkFile(file))
            parseFileAndSaveProductImages(file);

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
                        .build());
            }
        }
        classifierService.store(classObjs);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void parseFileAndSaveProductImages(MultipartFile file) {
        HeaderColumnNameMappingStrategy<ProductImage> strategy = new HeaderColumnNameMappingStrategy<>();
        strategy.setType(ProductImage.class);
        CsvToBean<ProductImage> csvToBean = new CsvToBean<>();

        try (InputStreamReader reader = new InputStreamReader(file.getInputStream())) {
            csvToBean.parse(strategy, new CSVReader(reader, ',')).forEach(classifierService::store);
        } catch (IOException e) {
            throw new RuntimeException("error in file parsing", e);
        }
    }

    private boolean checkFile(@RequestParam("file") MultipartFile file) {
        if(file == null) {
            return false;
        }
        if (file.isEmpty()) {
            throw new RuntimeException("file upload is empty");
        }
        if (!file.getName().endsWith(".csv")) {
            throw new RuntimeException("file must be a CSV");
        }

        return true;
    }

    @GetMapping("/nextImage")
    public ProductImage getNextImage() {
        return classifierService.getNextProductImage();
    }

    @GetMapping("/all")
    public List<ClassObj> getAllClasses() {
        return classifierService.findAllClasses();
    }

    @PostMapping("/link")
    public void saveImageClass(@RequestBody ProductImage productImage) {
        classifierService.store(productImage);
    }

}
