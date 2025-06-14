package com.ptit.b22cn539.myzing.DTO.Request.Playlist;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaylistRequest {
    @NotNull(message = "PLAYLIST_NAME_NULL")
    private String name;
    private String description;
    @Builder.Default
    private boolean isPublic = true;
}
