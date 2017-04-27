package com.cdiscount.webdataclassifier.repository;

import com.cdiscount.webdataclassifier.model.ProductImage;
import com.cdiscount.webdataclassifier.util.AppContext;
import com.google.common.collect.Lists;
import org.springframework.stereotype.Repository;

/**
 * Created by cedricverhooste on 25/04/17.
 */
@Repository
public class ProductImageRepository extends InMemoryCrudRepository<ProductImage, String> {

    @Override
    public void deleteAll() {
        super.deleteAll();
        AppContext.INSTANCE.clear();
    }

    @Override
    public String getId(ProductImage entity) {
        return entity.getImageUrl();
    }

    public ProductImage getNextProductImage() {
        ProductImage productImage = null;
        if (AppContext.INSTANCE.getIndex() < count()) {
            productImage = Lists.newArrayList(findAll()).get(AppContext.INSTANCE.getIndex());
            AppContext.INSTANCE.setIndex(AppContext.INSTANCE.getIndex() + 1);
        }
        return productImage;
    }

    public Integer calculateProgress() {
        float result = (AppContext.INSTANCE.getIndex()) * 100 / count();
        return Math.round(result);
    }

    public ProductImage getPreviousProductImage() {
        // Decrease the index number
        AppContext.INSTANCE.setIndex(AppContext.INSTANCE.getIndex() - 2);
        if (AppContext.INSTANCE.getIndex() < 0) {
            AppContext.INSTANCE.setIndex(0);
        }
        return getNextProductImage();
    }
}
