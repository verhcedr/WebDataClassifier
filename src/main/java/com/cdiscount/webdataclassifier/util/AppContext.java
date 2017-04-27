package com.cdiscount.webdataclassifier.util;

/**
 * Created by cedricverhooste on 27/04/17.
 */
public class AppContext {

    public static AppContext INSTANCE = new AppContext();

    private int index;
    private int productImageCount;
    private int errorCount;
    private boolean validationMode;

    private AppContext() {
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getProductImageCount() {
        return productImageCount;
    }

    public void setProductImageCount(int productImageCount) {
        this.productImageCount = productImageCount;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public void setErrorCount(int errorCount) {
        this.errorCount = errorCount;
    }

    public boolean isValidationMode() {
        return validationMode;
    }

    public void setValidationMode(boolean validationMode) {
        this.validationMode = validationMode;
    }

    public void clear() {
        index = 0;
        errorCount = 0;
        productImageCount = 0;
        validationMode = false;
    }
}
