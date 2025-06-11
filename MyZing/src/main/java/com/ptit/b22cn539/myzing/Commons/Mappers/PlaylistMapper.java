package com.ptit.b22cn539.myzing.Commons.Mappers;

import com.ptit.b22cn539.myzing.DTO.Response.Playlist.PlaylistResponse;
import com.ptit.b22cn539.myzing.Models.Entity.PlaylistEntity;
import com.ptit.b22cn539.myzing.Service.AWS.IAWSService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PlaylistMapper {
    private final IAWSService awsService;
    private final SongMapper songMapper;

    public PlaylistResponse toResponse(PlaylistEntity playlist) {
        return PlaylistResponse.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .description(playlist.getDescription())
                .songs(playlist.getSongs().stream().map(songMapper::toResponse).toList())
                .createdDate(playlist.getCreatedDate())
                .isCommunal(playlist.getCommunal())
                .image(this.awsService.getUrl(playlist.getImage()))
                .email(playlist.getUser().getEmail())
                .build();
    }
}
