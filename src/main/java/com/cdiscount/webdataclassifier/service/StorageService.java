package com.cdiscount.webdataclassifier.service;

import com.cdiscount.webdataclassifier.config.WdcProperties;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * Created by verhcedr on 17/02/2017.
 */
@Service
@Transactional
public class StorageService {

    @Autowired
    private WdcProperties config;

    public String store(MultipartFile file, String dirName, List<String> rootToDirectory) {
        if (file.isEmpty()) {
            throw new RuntimeException("file upload is empty");
        }

        // Create directories if needed
        String pathToDirectory = buildPathToDirectory(dirName, rootToDirectory);
        File pathToDirectoryFile = new File(pathToDirectory);
        pathToDirectoryFile.mkdirs();

        File fileToWrite = new File(pathToDirectory + "/" + file.getOriginalFilename());
        if (fileToWrite.exists()) {
            throw new RuntimeException("file already exist");
        }

//        try {
//            FileUtils.writeByteArrayToFile(fileToWrite, file.getBytes());
//        } catch (IOException e) {
//            throw new RuntimeException(e.getMessage(), e);
//        }
        return fileToWrite.getAbsolutePath();
    }

    public Resource loadAsResource(String absolutePathToFile) {
        FileSystemResource fsr = new FileSystemResource(absolutePathToFile);

        if (!fsr.exists()) {
            throw new RuntimeException("File not found path=" + absolutePathToFile);
        }
        return new FileSystemResource(absolutePathToFile);
    }

    private String buildPathToDirectory(String directoryName, List<String> rootToDirectory) {
        StringBuilder path = new StringBuilder(config.getStorage().getRootPath());
        if (rootToDirectory != null && rootToDirectory.size() > 0) {
            Collections.reverse(rootToDirectory);
            rootToDirectory.forEach(item -> path.append("/").append(item));
        } else {
            path.append("/").append(directoryName);
        }
        return path.toString();

    }
}
