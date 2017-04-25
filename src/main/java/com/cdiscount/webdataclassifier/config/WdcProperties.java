package com.cdiscount.webdataclassifier.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "wdc", ignoreUnknownFields = false)
public class WdcProperties {

    private final Storage storage = new Storage();

    public Storage getStorage() {
        return storage;
    }

    public static class Storage {
        private String rootPath;

        public String getRootPath() {
            return rootPath;
        }

        public void setRootPath(String rootPath) {
            this.rootPath = rootPath;
        }
    }

}
