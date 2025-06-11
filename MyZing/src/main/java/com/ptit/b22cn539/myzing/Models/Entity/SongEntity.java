package com.ptit.b22cn539.myzing.Models.Entity;

import com.ptit.b22cn539.myzing.DTO.Request.Song.SongCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(value = AuditingEntityListener.class)
public class SongEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private String id;
    @Column(nullable = false)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(nullable = false)
    private String url;
    private String imageUrl;
    @CreatedDate
    @Temporal(value = TemporalType.TIMESTAMP)
    private Date createdDate;
    @Builder.Default
    private Long numberOfListens = 0L;
    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email")
    private UserEntity user;
    @ManyToMany
    @JoinTable(name = "singer_music",
    joinColumns = @JoinColumn(name = "songId"),
    inverseJoinColumns = @JoinColumn(name = "singerId"))
    private Set<SingerEntity> singers;

    @OneToMany(mappedBy = "song", orphanRemoval = true)
    @Cascade(value = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE})
    private List<UserSongFavouriteEntity> userSongFavourites;

    @ManyToMany(mappedBy = "songs")
    private List<PlaylistEntity> playlists;

    public SongEntity(SongCreateRequest songRequest) {
        this.name = songRequest.getName();
        this.description = songRequest.getDescription();
        this.imageUrl = songRequest.getImageUrl();
        this.url = songRequest.getUrl();
        this.numberOfListens = 0L;
        this.createdDate = new Date(System.currentTimeMillis());
    }

    public SongEntity(SongCreateRequest songRequest, Set<SingerEntity> singers) {
        this(songRequest);
        this.singers = singers;
    }

    public SongEntity(SongUpdateRequest songRequest, Set<SingerEntity> singers) {
        this.id = songRequest.getId();
        this.name = songRequest.getName();
        this.description = songRequest.getDescription();
        this.imageUrl = songRequest.getImageUrl();
        this.url = songRequest.getUrl();
        this.numberOfListens = songRequest.getNumberOfListens();
        this.createdDate = songRequest.getCreatedDate();
        this.singers = singers;
    }
}
