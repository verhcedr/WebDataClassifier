package com.cdiscount.webdataclassifier.model;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * Created by cedricverhooste on 25/04/17.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImage implements Serializable {

    @Id
    @CsvBindByName
    private String imageUrl;
    private String sku;
    private String productName;
    private String imageName;
    private boolean imageDownloaded;
    private ClassObj classObj;
    private boolean isValid;

    private String realPath;
}
