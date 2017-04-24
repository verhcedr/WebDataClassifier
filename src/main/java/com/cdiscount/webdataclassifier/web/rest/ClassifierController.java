package com.cdiscount.webdataclassifier.web.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/classifier")
public class ClassifierController {

    @GetMapping
    public String index() {
        return "index";
    }

}