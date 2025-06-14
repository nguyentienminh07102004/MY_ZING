package com.ptit.b22cn539.myzing.Service.AWS;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

public interface IAWSService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileName);
    String getUrl(String fileName);
    ResponseInputStream<GetObjectResponse> downloadFile(String fileName);
}
