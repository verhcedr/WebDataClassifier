package com.cdiscount.webdataclassifier.model;

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
public class ClassObj implements Serializable {

    @Id
    private String cname;
    private String directory;

//    private Set<ProductImage> productImages;

}
