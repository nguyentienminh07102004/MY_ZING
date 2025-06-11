package com.ptit.b22cn539.myzing.DTO.Request.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequest {
    private String firstName;
    private String lastName;
    @Email
    private String email;
    @Size(min = 6, max = 32)
    private String password;
    private String confirmPassword;
    @Pattern(regexp = "^(84|0)([35789])[0-9]{8}\\b")
    private String phone;
    private String address;
    private Date dateOfBirth;
    private String gender;
}
