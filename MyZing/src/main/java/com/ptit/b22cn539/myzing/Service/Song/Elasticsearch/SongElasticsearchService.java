package com.ptit.b22cn539.myzing.Service.Song.Elasticsearch;

import co.elastic.clients.elasticsearch._types.FieldSort;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.ScoreSort;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.IdsQuery;
import com.ptit.b22cn539.myzing.Commons.EnvProperties.KafkaEnvProperties;
import com.ptit.b22cn539.myzing.Commons.Mappers.SongMapper;
import com.ptit.b22cn539.myzing.Commons.Utils.PaginationUtils;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongSearchRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.DeleteQuery;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.web.PagedModel;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class SongElasticsearchService implements ISongElasticsearchService {
    private final ElasticsearchOperations elasticsearchOperations;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SongMapper songMapper;
    private final HashOperations<String, String, Object> hashOperations;

    @Transactional
    @KafkaListener(topics = KafkaEnvProperties.CREATE_UPDATE_TOPIC, groupId = "createUpdateSong", concurrency = "5")
    public void createSong(List<SongDocument> songs) {
        List<IndexQuery> indexQueries = new LinkedList<>();
        for (SongDocument song : songs) {
            IndexQuery indexQuery = IndexQuery.builder()
                    .withId(song.getId())
                    .withOpType(IndexQuery.OpType.INDEX)
                    .withObject(song)
                    .build();
            indexQueries.add(indexQuery);
            log.info("Create document {}", song.getId());
        }
        this.elasticsearchOperations.bulkIndex(indexQueries, SongDocument.class);
        log.info("Created document elasticsearch");
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public PagedModel<SongResponse> findSong(SongSearchRequest songSearchRequest) {
        String key = this.getSearchKey(songSearchRequest);
        log.info("Find song elasticsearch {}", key);
        if (this.redisTemplate.hasKey(this.getSearchKey(songSearchRequest))) {
            log.info("Data redis");
            Object data = this.hashOperations.get(key, "list");
            if (data == null) {
                throw new DataInvalidException(AppException.SERVER_ERROR);
            }
            if (data instanceof List<?>) {
                List<SongResponse> songResponses = (List<SongResponse>) data;
                long totalElements = Long.parseLong(String.valueOf(this.hashOperations.get(key, "totalElements")));
                Pageable pageable = PaginationUtils.getPageRequest(songSearchRequest.getPage(), songSearchRequest.getLimit());
                return new PagedModel<>(new PageImpl<>(songResponses, pageable, totalElements));
            }
        }
        List<SortOptions> sortOptions = new LinkedList<>();
        sortOptions.add(SortOptions.of(builder -> builder.score(new ScoreSort.Builder().order(SortOrder.Desc).build())));
        if (songSearchRequest.getSortBy().equalsIgnoreCase(SongDocument.NAME)) {
            sortOptions.add(SortOptions.of(builder -> builder
                    .field(new FieldSort.Builder()
                            .field("%s.keyword".formatted(songSearchRequest.getSortBy()))
                            .order(songSearchRequest.getSortOrder()).build())
            ));
        } else {
            sortOptions.add(SortOptions.of(builder -> builder.field(new FieldSort.Builder()
                    .field(songSearchRequest.getSortBy())
                    .order(songSearchRequest.getSortOrder())
                    .build())));
        }
        Pageable pageable = PaginationUtils.getPageRequest(songSearchRequest.getPage(), songSearchRequest.getLimit());
        log.info("request is {}", songSearchRequest);
        NativeQuery querySearch = NativeQuery.builder()
                //.withSuggester(suggester)
                .withQuery(query -> query
                        .bool(builder -> {
                            if (StringUtils.hasText(songSearchRequest.getName())) {
                                builder = builder
                                        .must(m1 -> m1.match(m -> m
                                                .field(SongDocument.NAME)
                                                .query(songSearchRequest.getName())
                                                .fuzziness("AUTO")
                                        ));
                            }
                            if (songSearchRequest.getSingerIds() != null && !songSearchRequest.getSingerIds().isEmpty()) {
                                builder = builder.must(m2 -> m2.terms(m -> m.field(SongDocument.SINGER_IDS)
                                        .terms(t -> t.value(songSearchRequest.getSingerIds().stream().map(FieldValue::of).toList()))));
                            }
                            if (songSearchRequest.getCreatedDateFrom() != null) {
                                builder = builder.must(m3 -> m3.range(r -> r.date(d -> d.field(SongDocument.CREATED_DATE)
                                        .gte(songSearchRequest.getCreatedDateFrom().toInstant().toString()))));
                            }
                            if (songSearchRequest.getCreatedDateTo() != null) {
                                builder = builder.must(m4 -> m4.range(r -> r.date(d -> d.field(SongDocument.CREATED_DATE)
                                        .lte(songSearchRequest.getCreatedDateTo().toInstant().toString()))));
                            }
                            if (StringUtils.hasText(songSearchRequest.getEmail())) {
                                builder = builder
                                        .must(m5 -> m5.matchPhrase(t -> t.field(SongDocument.EMAIL)
                                                .query(songSearchRequest.getEmail())));
                            }
                            if (!CollectionUtils.isEmpty(songSearchRequest.getTags())) {
                                builder = builder.must(m -> m.terms(t -> t.field(SongDocument.TAGS)
                                        .terms(v -> v.value(songSearchRequest.getTags().stream()
                                                .map(FieldValue::of).toList()))));
                            }
                            return builder;
                        }))
                .withPageable(pageable)
                .withSort(sortOptions)
                .build();
        SearchHits<SongDocument> searchHits = this.elasticsearchOperations.search(querySearch, SongDocument.class);
        List<SongResponse> list = searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .map(this.songMapper::toResponse)
                .toList();
        long totalElements = searchHits.getTotalHits();
        this.hashOperations.put(key, "list", list);
        this.hashOperations.put(key, "totalElements", totalElements);
        return new PagedModel<>(new PageImpl<>(list, pageable, totalElements));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedModel<SongResponse> findMySong(SongSearchRequest searchRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        searchRequest.setEmail(email);
        return this.findSong(searchRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public SongResponse findSongById(String id) {
        String key = getKeyBySongId(id);
        Object song = this.redisTemplate.opsForValue().get(key);
        if (song != null) {
            log.info("Song id = {} has in redis", id);
            return (SongResponse) song;
        }
        Query query = NativeQuery.builder()
                .withQuery(q -> q.ids(IdsQuery.of(ids -> ids.values(id))))
                .build();
        SearchHits<SongDocument> searchHits = this.elasticsearchOperations.search(query, SongDocument.class);
        if (searchHits.isEmpty()) {
            throw new DataInvalidException(AppException.SONG_NOT_FOUND);
        }
        SongDocument songDocument = searchHits.getSearchHit(0).getContent();
        SongResponse songResponse = this.songMapper.toResponse(songDocument);
        this.redisTemplate.opsForValue().set(key, songResponse);
        log.info("Song id = {} has set into redis", id);
        return songResponse;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SongResponse> findRelatedSong(String songId, Integer limit) {
        String key = getKeyRelatedSong(songId);
        if (this.redisTemplate.hasKey(key)) {
            Object data = this.redisTemplate.opsForValue().get(key);
            return (List<SongResponse>) data;
        }
        SongDocument songDocument = this.elasticsearchOperations.get(songId, SongDocument.class);
        if (songDocument == null) {
            throw new DataInvalidException(AppException.SONG_NOT_FOUND);
        }
        List<String> singerIds = songDocument.getSingerIds();
        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.bool(b -> b.should(s -> s.terms(
                                terms -> terms
                                        .terms(v -> v
                                                .value(singerIds.stream()
                                                        .map(FieldValue::of)
                                                        .toList())
                                        )
                                        .field(SongDocument.SINGER_IDS)
                        ))
                        .mustNot(s -> s.ids(id -> id.values(songId)))))
                .withPageable(PaginationUtils.getPageRequest(1, limit))
                .build();
        SearchHits<SongDocument> searchHits = this.elasticsearchOperations.search(query, SongDocument.class);
        List<SongResponse> songResponses = searchHits.stream()
                .map(SearchHit::getContent)
                .map(this.songMapper::toResponse)
                .toList();
        this.redisTemplate.opsForValue().set(key, songResponses);
        return songResponses;
    }

    @KafkaListener(topics = KafkaEnvProperties.DELETE_TOPIC, groupId = "deleteTopic", concurrency = "5")
    public void deleteSong(List<String> ids) {
        this.elasticsearchOperations.delete(DeleteQuery.builder(NativeQuery.builder()
                        .withQuery(builder -> builder.ids(id -> id.values(ids)))
                        .build())
                .build(), SongDocument.class);
    }

    private String getSearchKey(SongSearchRequest songSearchRequest) {
        Pageable pageable = PaginationUtils.getPageRequest(songSearchRequest.getPage(), songSearchRequest.getLimit());
        return "song:%s:%s:%s:%s:%s:%s:%d:%d".formatted(
                Objects.toString(songSearchRequest.getName(), "_"),
                Objects.toString(songSearchRequest.getSingerIds(), "_"),
                Objects.toString(songSearchRequest.getCreatedDateFrom(), "_"),
                Objects.toString(songSearchRequest.getCreatedDateTo(), "_"),
                Objects.toString(songSearchRequest.getSortBy(), "_"),
                Objects.toString(songSearchRequest.getSortOrder(), "_"),
                pageable.getPageNumber(),
                pageable.getPageSize()
        );
    }

    public static String getKeyBySongId(String songId) {
        return "song:id:%s:email:%s".formatted(songId, SecurityContextHolder.getContext().getAuthentication().getName());
    }

    public static String getKeyRelatedSong(String songId) {
        return "song:related:%s".formatted(songId);
    }
}
