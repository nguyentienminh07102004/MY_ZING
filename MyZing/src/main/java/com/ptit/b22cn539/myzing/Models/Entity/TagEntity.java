package com.ptit.b22cn539.myzing.Models.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@EqualsAndHashCode
public class TagEntity {
    @Id
    @Column(nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany(mappedBy = "tags")
    private Set<SongEntity> songs;
}
