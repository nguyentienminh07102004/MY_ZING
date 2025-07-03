package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.PlaylistEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPlaylistRepository extends JpaRepository<PlaylistEntity, String> {
    Page<PlaylistEntity> findByCommunalIsTrue(Pageable pageable);

    Page<PlaylistEntity> findByUser_Email(String userEmail, Pageable pageable);
}
