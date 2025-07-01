package com.ptit.b22cn539.myzing.DTO.Request.Tag;

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
public class TagCreateRequest {
    private String name;
    private String description;
}
