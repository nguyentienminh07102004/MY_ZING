package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface ISongRepository extends JpaRepository<SongEntity, String> {

    Page<SongEntity> findAllByCreatedDateAfter(Date createdDateAfter, Pageable pageable);
}
