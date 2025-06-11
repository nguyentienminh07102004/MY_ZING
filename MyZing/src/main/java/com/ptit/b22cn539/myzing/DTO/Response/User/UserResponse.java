package com.ptit.b22cn539.myzing.DTO.Response.User;

import com.ptit.b22cn539.myzing.Commons.Enums.ROLE;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
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
    private ROLE role;

    public UserResponse(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.firstName = userEntity.getFirstName();
        this.lastName = userEntity.getLastName();
        this.email = userEntity.getEmail();
        this.phone = userEntity.getPhone();
        this.address = userEntity.getAddress();
        this.dateOfBirth = userEntity.getDateOfBirth();
        this.gender = userEntity.getGender();
        this.role = userEntity.getRole();
    }
}
