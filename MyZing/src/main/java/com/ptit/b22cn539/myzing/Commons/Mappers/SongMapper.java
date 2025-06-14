package com.ptit.b22cn539.myzing.Commons.Mappers;

import com.ptit.b22cn539.myzing.DTO.Response.Singer.SingerResponse;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Repository.IUserFavouriteSongRepository;
import com.ptit.b22cn539.myzing.Service.AWS.IAWSService;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SongMapper {
    private final IAWSService awsService;
    private final ISingerService singerService;
    private final IUserFavouriteSongRepository userFavouriteSongRepository;

    public SongResponse toResponse(SongEntity song) {
        List<SingerResponse> singers = song.getSingers().stream()
                .map(SingerResponse::new)
                .toList();
        SongResponse response = SongResponse.builder()
                .id(song.getId())
                .name(song.getName())
                .description(song.getDescription())
                .createdDate(song.getCreatedDate())
                .numberOfListens(song.getNumberOfListens())
                .url(this.awsService.getUrl(song.getUrl()))
                .imageUrl(this.awsService.getUrl(song.getImageUrl()))
                .singers(singers)
                .build();
        if (SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            response.setIsLike(this.userFavouriteSongRepository.existsByUser_EmailAndSong_Id(email, song.getId()));
        }
        return response;
    }

    public SongResponse toResponse(SongDocument song) {
        List<SingerResponse> singers = song.getSingerIds().stream()
                .map(this.singerService::findById)
                .map(SingerResponse::new)
                .toList();
        SongResponse response = SongResponse.builder()
                .id(song.getId())
                .name(song.getName())
                .description(song.getDescription())
                .createdDate(song.getCreatedDate())
                .numberOfListens(song.getNumberOfListens())
                .imageUrl(this.awsService.getUrl(song.getImageUrl()))
                .url(this.awsService.getUrl(song.getUrl()))
                .singers(singers)
                .build();
        if (SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            response.setIsLike(this.userFavouriteSongRepository.existsByUser_EmailAndSong_Id(email, song.getId()));
        }
        return response;
    }
}
