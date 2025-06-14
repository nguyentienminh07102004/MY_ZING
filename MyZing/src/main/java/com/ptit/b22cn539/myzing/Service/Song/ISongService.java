package com.ptit.b22cn539.myzing.Service.Song;

import com.ptit.b22cn539.myzing.DTO.Request.Song.SongCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongUpdateRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import org.springframework.data.web.PagedModel;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.List;

public interface ISongService {
    SongResponse createSong(MultipartFile file, MultipartFile image, SongCreateRequest request);
    SongResponse updateSong(MultipartFile file, MultipartFile image, SongUpdateRequest request);
    SongEntity getSongById(String id);
    void likeSong(String id);
    void deleteSong(List<String> ids);
    PagedModel<SongResponse> getMySongFavourites(Integer page, Integer limit);
    ResponseInputStream<GetObjectResponse> downloadSong(String id);
}
