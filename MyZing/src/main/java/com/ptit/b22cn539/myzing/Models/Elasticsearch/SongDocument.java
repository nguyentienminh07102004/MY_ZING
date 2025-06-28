package com.ptit.b22cn539.myzing.Models.Elasticsearch;

import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Models.Entity.TagEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Date;
import java.util.List;

@Document(indexName = "songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SongDocument {
    @Id
    @Field(type = FieldType.Keyword)
    private String id;
    @Field(type = FieldType.Text)//analyzer = "vietnamese_ngram_analyzer", searchAnalyzer = "vietnamese_search_analyzer"
    private String name;
    @Field(type = FieldType.Text)
    private String description;
    @Field(type = FieldType.Text)
    private String url;
    @Field(type = FieldType.Text)
    private String imageUrl;
    @Field(type = FieldType.Date)
    private Date createdDate;
    @Field(type = FieldType.Long)
    private Long numberOfListens = 0L;
    @Field(type = FieldType.Keyword) // Constant_Keyword là keyword const + keyword (mọi document)
    private List<String> singerIds;
    @Field(type = FieldType.Keyword)
    private String email;
    @Field(type = FieldType.Keyword)
    private List<String> tags;

    public SongDocument(SongEntity song) {
        this.id = song.getId();
        this.name = song.getName();
        this.description = song.getDescription();
        this.imageUrl = song.getImageUrl();
        this.createdDate = song.getCreatedDate();
        this.email = song.getUser().getEmail();
        this.numberOfListens = song.getNumberOfListens();
        this.url = song.getUrl();
        if (song.getTags() != null) {
            this.tags = song.getTags().stream()
                    .map(TagEntity::getName)
                    .toList();
        }
        this.singerIds = song.getSingers().stream()
                .map(SingerEntity::getId)
                .toList();
    }

    public static final String NAME = "name";
    public static final String EMAIL = "email";
    public static final String CREATED_DATE = "createdDate";
    public static final String NUMBER_OF_LISTENS = "numberOfListens";
    public static final String SINGER_IDS = "singerIds";
    public static final String TAGS = "tags";

    // có thể tìm hiểu thêm về complete suggest
}
