package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.UserFavouritePlaylistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserFavouritePlaylistRepository extends JpaRepository<UserFavouritePlaylistEntity, String> {
    boolean existsByPlaylist_IdAndUser_Email(String playlistId, String userEmail);
    void deleteByPlaylist_IdAndUser_Email(String playlistId, String userEmail);
}
