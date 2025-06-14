package com.ptit.b22cn539.myzing.DTO.Request.Song;

import co.elastic.clients.elasticsearch._types.SortOrder;
import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SongSearchRequest {
    private String name;
    private List<String> singerIds;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdDateTo;
    @Builder.Default
    private String sortBy = SongDocument.NUMBER_OF_LISTENS;
    @Builder.Default
    private SortOrder sortOrder = SortOrder.Desc;
    private List<String> tags;
    private String email;
    @Builder.Default
    private Integer page = 1;
    @Builder.Default
    private Integer limit = 10;
}
