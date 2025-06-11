package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.UserSongFavouriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserFavouriteSongRepository extends JpaRepository<UserSongFavouriteEntity, String> {
    boolean existsByUser_EmailAndSong_Id(String userEmail, String songId);

    void deleteByUser_EmailAndSong_Id(String userEmail, String songId);
}
