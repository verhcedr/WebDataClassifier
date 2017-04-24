package com.cdiscount.webdataclassifier;

import com.cdiscount.webdataclassifier.config.WdcProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableAutoConfiguration
@EnableConfigurationProperties({WdcProperties.class})
@SpringBootApplication
public class WdcApplication {

    public static void main(String[] args) {
        SpringApplication.run(WdcApplication.class, args);
    }
}
