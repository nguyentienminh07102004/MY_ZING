package com.ptit.b22cn539.myzing.DTO.Response.Playlist;

import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaylistResponse {
    private String id;
    private String name;
    private String description;
    private String image;
    private Date createdDate;
    private String email;
    private boolean isCommunal;
    private List<SongResponse> songs;
}
