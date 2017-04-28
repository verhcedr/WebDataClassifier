package com.cdiscount.webdataclassifier.util;

import com.cdiscount.webdataclassifier.model.ClassObj;
import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.service.ClassifierService;
import com.opencsv.CSVReader;
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

    public static void parseFileAndSaveProductImages(List<ClassObj> classes, MultipartFile file, ClassifierService classifierService) {
        try (InputStreamReader reader = new InputStreamReader(file.getInputStream())) {
            CSVReader csvreader = new CSVReader(reader);
            // if the first line is the header
            String[] headers = csvreader.readNext();
            // read line by line
            String[] record;
            while ((record = csvreader.readNext()) != null) {
                classifierService.store(ProductImage.builder()
                        .imageUrl(record[0])
                        .classObj(getClassObjFromCname(classes, headers, record))
                        .build());
            }
        } catch (IOException e) {
            throw new RuntimeException("error in file parsing", e);
        }
    }

    private static ClassObj getClassObjFromCname(List<ClassObj> classes, String[] headers, String[] record) {
        ClassObj result = null;

        for (int index = 1; index < headers.length; index++) {
            if ("1".equals(record[index])) {
                for (ClassObj classObj : classes) {
                    if (headers[index].equals(classObj.getCname())) {
                        result = classObj;
                        break;
                    }
                }
            }
        }
        return result;
    }

    public static String writeProductImagesToCsv(String target, List<ProductImage> productImages, List<ClassObj> classes) throws IOException {
        final FileWriter sw = new FileWriter(target);
        // Define headers
        List<String> columnNames = classes.stream().map(classObj -> classObj.getCname().trim()).collect(Collectors.toList());
        columnNames.add(0, "url");
        columnNames.add("path");
        if (AppContext.INSTANCE.isValidationMode()) {
            columnNames.add("isValid");
        }

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
                // Write real path
                csvPrinter.print(productImage.getRealPath());
                // Write validation state if needed
                if (AppContext.INSTANCE.isValidationMode()) {
                    csvPrinter.print(productImage.isValid() ? 1 : 0);
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
        if (!file.getOriginalFilename().endsWith(".csv")) {
            throw new RuntimeException("file must be a CSV");
        }
        return true;
    }

}
