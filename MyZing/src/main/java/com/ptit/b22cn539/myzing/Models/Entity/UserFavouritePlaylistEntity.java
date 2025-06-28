package com.ptit.b22cn539.myzing.Models.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "user_favourite_playlist")
@Getter
@Setter
@NoArgsConstructor
public class UserFavouritePlaylistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    @JoinColumn(name = "playlistId")
    private PlaylistEntity playlist;
    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email")
    private UserEntity user;
    @CreationTimestamp
    private Date createdDate;

    public UserFavouritePlaylistEntity(PlaylistEntity playlist, UserEntity user) {
        this.playlist = playlist;
        this.user = user;
    }
}
