package com.ptit.b22cn539.myzing.Service.Song.Elasticsearch;

import com.ptit.b22cn539.myzing.DTO.Request.Song.SongSearchRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import org.springframework.data.web.PagedModel;

public interface ISongElasticsearchService {
    PagedModel<SongResponse> findSong(SongSearchRequest searchRequest);
    PagedModel<SongResponse> findMySong(SongSearchRequest searchRequest);
    SongResponse findSongById(String id);
}
