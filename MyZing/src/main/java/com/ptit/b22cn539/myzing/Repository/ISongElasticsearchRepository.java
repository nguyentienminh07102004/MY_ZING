package com.ptit.b22cn539.myzing.Repository;

import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISongElasticsearchRepository extends ElasticsearchRepository<SongDocument, String> {
}
