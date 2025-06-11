package com.ptit.b22cn539.myzing.DTO.Response.Song;

import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
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
    private List<String> singers;

    public SongResponse(SongEntity song, String url, String imageUrl) {
        this.id = song.getId();
        this.name = song.getName();
        this.description = song.getDescription();
        this.url = url;
        this.imageUrl = imageUrl;
        this.createdDate = song.getCreatedDate();
        this.numberOfListens = song.getNumberOfListens();
        this.singers = song.getSingers().stream()
                .map(SingerEntity::getId)
                .toList();
    }

    public SongResponse(SongDocument songDocument) {
        this.id = songDocument.getId();
        this.name = songDocument.getName();
        this.description = songDocument.getDescription();
        this.url = songDocument.getUrl();
        this.imageUrl = songDocument.getImageUrl();
        this.createdDate = songDocument.getCreatedDate();
        this.numberOfListens = songDocument.getNumberOfListens();
        this.singers = songDocument.getSingerIds();
    }
}
