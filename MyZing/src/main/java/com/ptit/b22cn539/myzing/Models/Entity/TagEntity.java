package com.ptit.b22cn539.myzing.Models.Entity;

import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagCreateRequest;
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

import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class TagEntity {
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany(mappedBy = "tags")
    private Set<SongEntity> songs;

    public TagEntity(TagCreateRequest tagRequest) {
        this.name = tagRequest.getName();
        this.description = tagRequest.getDescription();
    }
}
