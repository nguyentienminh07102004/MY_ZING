package com.ptit.b22cn539.myzing.Models.Entity;

import com.ptit.b22cn539.myzing.DTO.Request.Playlist.PlaylistRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "playlists")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(value = AuditingEntityListener.class)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PlaylistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private String id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @ManyToMany(mappedBy = "playlists")
    @Cascade(value = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<SongEntity> songs = new LinkedHashSet<>();
    @CreatedDate
    @Temporal(value = TemporalType.TIMESTAMP)
    private Date createdDate;
    private String image;
    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email")
    private UserEntity user;
    @ColumnDefault(value = "true")
    @Column(name = "isPublic")
    private Boolean communal = true;

    @OneToMany(mappedBy = "playlist", orphanRemoval = true)
    @Cascade(value = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<UserFavouritePlaylistEntity> userFavouritePlaylists = new LinkedList<>();

    public PlaylistEntity(PlaylistRequest playlistRequest, UserEntity user) {
        this.name = playlistRequest.getName();
        this.description = playlistRequest.getDescription();
        this.user = user;
    }
}
