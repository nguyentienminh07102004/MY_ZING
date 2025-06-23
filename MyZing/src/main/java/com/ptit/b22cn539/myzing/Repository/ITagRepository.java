package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITagRepository extends JpaRepository<TagEntity, String> {
}
