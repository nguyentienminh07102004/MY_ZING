package com.ptit.b22cn539.myzing.Models.Entity;

import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "singers")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SingerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private String id;
    @Column(nullable = false)
    private String fullName;
    private String avatar;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String gender;
    private Date dateOfBirth;

    @ManyToMany(mappedBy = "singers")
    private List<SongEntity> songs;

    public SingerEntity(SingerRequest singerRequest) {
        this.fullName = singerRequest.getFullName();
        this.description = singerRequest.getDescription();
        this.gender = singerRequest.getGender();
        this.dateOfBirth = singerRequest.getDateOfBirth();
    }
}
