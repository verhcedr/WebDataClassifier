package com.cdiscount.webdataclassifier.model;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import java.io.Serializable;

/**
 * Created by cedricverhooste on 25/04/17.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageCsvBean implements Serializable {

    @CsvBindByName
    private String sku;

    @CsvBindByName
    private String productName;

    @CsvBindByName
    private String imageUrl;

    @CsvBindByName
    private String classObj;
}
