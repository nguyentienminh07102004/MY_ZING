package com.ptit.b22cn539.myzing.DTO.Response.User;

import com.ptit.b22cn539.myzing.Commons.Enums.ROLE;
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
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private Date dateOfBirth;
    private String gender;
    private String picture;
    private ROLE role;
    private boolean isDeleted;
}
