package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.UserSongFavouriteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserFavouriteSongRepository extends JpaRepository<UserSongFavouriteEntity, String> {
    boolean existsByUser_EmailAndSong_Id(String userEmail, String songId);

    void deleteByUser_EmailAndSong_Id(String userEmail, String songId);

    Page<UserSongFavouriteEntity> findByUser_Email(String userEmail, Pageable pageable);
}
