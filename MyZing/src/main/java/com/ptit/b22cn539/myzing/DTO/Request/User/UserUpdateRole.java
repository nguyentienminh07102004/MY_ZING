package com.ptit.b22cn539.myzing.DTO.Request.User;

import com.ptit.b22cn539.myzing.Commons.Enums.ROLE;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRole {
    @Email(message = "EMAIL_NOT_VALID")
    private String email;
    private ROLE role;
}
