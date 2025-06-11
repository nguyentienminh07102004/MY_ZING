package com.ptit.b22cn539.myzing.Commons.Validate.FileNotNullOrEmpty;

import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class FileNotNullOrEmptyValidator implements ConstraintValidator<FileNotNullOrEmpty, MultipartFile> {
    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext constraintValidatorContext) {
        if (file == null || file.isEmpty()) {
            setMessages(constraintValidatorContext, String.valueOf(AppException.FILE_MP3_NOT_NULL_OR_EMPTY));
            return false;
        }
        return true;
    }

    private void setMessages(ConstraintValidatorContext constraintValidatorContext, String messages) {
        constraintValidatorContext.disableDefaultConstraintViolation(); // vô hiệu messages mặc định
        constraintValidatorContext.buildConstraintViolationWithTemplate(messages).addConstraintViolation(); // thêm messages
    }
}
