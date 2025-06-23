package com.ptit.b22cn539.myzing.DTO.Request.Song;

import com.ptit.b22cn539.myzing.Commons.Validate.NotListEmpty.NotListEmpty;
import jakarta.validation.constraints.NotNull;
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
public class SongUpdateRequest {
    @NotNull
    private String id;
    @NotNull
    private String name;
    @NotListEmpty
    private List<String> singers;
    private String description;
    private String imageUrl;
    @NotNull
    private Date createdDate;
    @NotNull
    private Long numberOfListens;
    private String url;
    private List<String> tags;
}
