package com.ptit.b22cn539.myzing.DTO.Request.User;

import jakarta.validation.constraints.Pattern;
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
public class UserUpdateInfoRequest {
    private String firstName;
    private String lastName;
    @Pattern(regexp = "^(84|0)([35789])[0-9]{8}$")
    private String phone;
    private String address;
    private Date dateOfBirth;
    private String gender;
}
