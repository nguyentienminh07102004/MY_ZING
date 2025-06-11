package com.ptit.b22cn539.myzing.Service.AWS;

import org.springframework.web.multipart.MultipartFile;

public interface IAWSService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileName);
    String getUrl(String fileName);
}
