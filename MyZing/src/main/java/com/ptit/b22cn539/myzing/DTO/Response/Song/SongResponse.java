package com.ptit.b22cn539.myzing.DTO.Response.Song;

import com.ptit.b22cn539.myzing.DTO.Response.Singer.SingerResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class SongResponse implements Serializable {
    private String id;
    private String name;
    private String description;
    private String url;
    private String imageUrl;
    private Date createdDate;
    private Long numberOfListens;
    @Builder.Default
    private Boolean isLike = false;
    private List<SingerResponse> singers;
}
