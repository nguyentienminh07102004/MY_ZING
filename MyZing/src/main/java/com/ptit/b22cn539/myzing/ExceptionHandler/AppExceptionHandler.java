package com.ptit.b22cn539.myzing.ExceptionHandler;

import com.ptit.b22cn539.myzing.DTO.Response.AppResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler(DataInvalidException.class)
    public ResponseEntity<AppResponse> appExceptionHandler(DataInvalidException ex) {
        AppResponse response = AppResponse.builder()
                .status(ex.getException().getStatus())
                .message(ex.getException().getMessage())
                .build();
        return new ResponseEntity<>(response, ex.getException().getHttpStatus());
    }
}
