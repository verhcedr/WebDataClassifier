package com.cdiscount.webdataclassifier.repository;

import com.cdiscount.webdataclassifier.model.ProductImage;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Map;

/**
 * Created by cedricverhooste on 25/04/17.
 */
@Repository
public class ProductImageRepository extends InMemoryCrudRepository<ProductImage, String> {

    private int index = 0;

    @Override
    public void deleteAll() {
        super.deleteAll();
        index = 0;
    }

    @Override
    public String getId(ProductImage entity) {
        return entity.getImageUrl();
    }

    public ProductImage getNextProductImage() {
        ProductImage productImage = null;
        if(index < count()) {
            productImage = Lists.newArrayList(findAll()).get(index);
            index++;
        }
        return productImage;
    }

    public Integer calculateProgress() {
        float result = (index) * 100 / count();
        return Math.round(result);
    }
}
