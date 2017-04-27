package com.cdiscount.webdataclassifier.util;

import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.service.ClassifierService;
import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by cedricverhooste on 26/04/17.
 */
public abstract class Utils {

    public static void parseFileAndSaveProductImages(MultipartFile file, ClassifierService classifierService) {
        HeaderColumnNameMappingStrategy<ProductImage> strategy = new HeaderColumnNameMappingStrategy<>();
        strategy.setType(ProductImage.class);
        CsvToBean<ProductImage> csvToBean = new CsvToBean<>();

        try (InputStreamReader reader = new InputStreamReader(file.getInputStream())) {
            csvToBean.parse(strategy, new CSVReader(reader, ',')).forEach(classifierService::store);
        } catch (IOException e) {
            throw new RuntimeException("error in file parsing", e);
        }
    }

    public static String writeProductImagesToCsv(String target, List<ProductImage> productImages, List<ClassObj> classes) throws IOException {
        final FileWriter sw = new FileWriter(target);
        // Define headers
        List<String> columnNames = classes.stream().map(classObj -> classObj.getCname().trim()).collect(Collectors.toList());
        columnNames.add(0, "url");
        // Instanciate csv printer with header
        CSVPrinter csvPrinter = CSVFormat.DEFAULT.withHeader(columnNames.toArray(new String[columnNames.size()])).print(sw);

        for (ProductImage productImage : productImages) {
            // Write only classified images
            if (productImage.getClassObj() != null) {
                // Write image url
                csvPrinter.print(productImage.getImageUrl());
                // Write class
                for (ClassObj classObj : classes) {
                    csvPrinter.print(classObj.getCname().equals(productImage.getClassObj().getCname()) ? 1 : 0);
                }
                csvPrinter.println();
            }
        }
        csvPrinter.flush();
        csvPrinter.close();

        return target;
    }


    public static boolean checkFile(MultipartFile file) {
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

}
