package com.ptit.b22cn539.myzing.DTO.Response.Tag;

import com.ptit.b22cn539.myzing.Models.Entity.TagEntity;
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
public class TagResponse {
    private String id;
    private String name;
    private String description;

    public TagResponse(TagEntity tag) {
        this.id = tag.getId();
        this.name = tag.getName();
        this.description = tag.getDescription();
    }
}
