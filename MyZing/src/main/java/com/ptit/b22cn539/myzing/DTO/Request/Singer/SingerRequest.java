package com.ptit.b22cn539.myzing.DTO.Request.Singer;

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
public class SingerRequest {
    private String fullName;
    private String description;
    private String gender;
    private Date dateOfBirth;
}
