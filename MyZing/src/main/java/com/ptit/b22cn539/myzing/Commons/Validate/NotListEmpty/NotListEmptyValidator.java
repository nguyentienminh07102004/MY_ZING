package com.ptit.b22cn539.myzing.Commons.Validate.NotListEmpty;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class NotListEmptyValidator implements ConstraintValidator<NotListEmpty, List<?>> {
    @Override
    public boolean isValid(List<?> objects, ConstraintValidatorContext constraintValidatorContext) {
        return !objects.isEmpty();
    }
}
