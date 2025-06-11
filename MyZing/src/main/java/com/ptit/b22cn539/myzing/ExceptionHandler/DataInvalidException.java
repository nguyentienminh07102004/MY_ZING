package com.ptit.b22cn539.myzing.ExceptionHandler;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class DataInvalidException extends RuntimeException {
    private AppException exception;
}
