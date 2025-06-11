package com.ptit.b22cn539.myzing.Commons.Mappers;

import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Service.AWS.IAWSService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SongMapper {
    private final IAWSService awsService;

    public SongResponse toResponse(SongEntity song) {
        return SongResponse.builder()
                .id(song.getId())
                .name(song.getName())
                .description(song.getDescription())
                .createdDate(song.getCreatedDate())
                .numberOfListens(song.getNumberOfListens())
                .url(this.awsService.getUrl(song.getUrl()))
                .imageUrl(this.awsService.getUrl(song.getImageUrl()))
                .singers(song.getSingers().stream().map(SingerEntity::getId).toList())
                .build();
    }
}
