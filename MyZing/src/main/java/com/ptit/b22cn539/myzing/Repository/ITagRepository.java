package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.TagEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ITagRepository extends JpaRepository<TagEntity, String> {
    @Query(value = "select * from tags where :name is null or name like %:name%", nativeQuery = true)
    Page<TagEntity> findAll(@Param("name") String name, Pageable pageable);
}
