package com.ptit.b22cn539.myzing.Service.AWS;

import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AWSServiceImpl implements IAWSService {
    @Value("${aws.bucket_name}")
    private String bucketName;
    private final S3Client s3Client;

    @Override
    @Transactional
    public String uploadFile(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            if (!StringUtils.hasText(fileName)) {
                fileName = file.getName();
            }
            fileName = System.currentTimeMillis() + fileName;
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl(ObjectCannedACL.PUBLIC_READ_WRITE)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();
            this.s3Client.putObject(objectRequest, RequestBody.fromBytes(file.getBytes()));
            return fileName;
        } catch (IOException e) {
            System.out.println(e.getMessage());
            throw new DataInvalidException(AppException.AWS_ERROR);
        }
    }

    @Override
    @Transactional
    public void deleteFile(String fileName) {
        this.s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public String getUrl(String fileName) {
        if (!StringUtils.hasText(fileName)) return fileName;
        S3Utilities utilities = this.s3Client.utilities();
        GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .region(Region.AP_NORTHEAST_1)
                .build();
        return utilities.getUrl(getUrlRequest).toExternalForm();
    }
}
