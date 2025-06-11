package com.ptit.b22cn539.myzing.DTO.Request.Playlist;

import com.ptit.b22cn539.myzing.Commons.Validate.NotListEmpty.NotListEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaylistRequest {
    @NotNull(message = "PLAYLIST_NAME_NULL")
    private String name;
    private String description;
    @NotListEmpty
    private List<String> songs;
    @Builder.Default
    private boolean isPublic = true;
}
