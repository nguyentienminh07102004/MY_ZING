package com.ptit.b22cn539.myzing.DTO.Response.Singer;

import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
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
public class SingerResponse {
    private String id;
    private String fullName;
    private String avatar;
    private String gender;
    private Date dateOfBirth;
    private String description;

    public SingerResponse(SingerEntity singerEntity) {
        this.id = singerEntity.getId();
        this.fullName = singerEntity.getFullName();
        this.avatar = singerEntity.getAvatar();
        this.gender = singerEntity.getGender();
        this.dateOfBirth = singerEntity.getDateOfBirth();
        this.description = singerEntity.getDescription();
    }
}
