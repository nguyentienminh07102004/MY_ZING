package com.ptit.b22cn539.myzing.Service.Tag;

import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagUpdateRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Tag.TagResponse;
import com.ptit.b22cn539.myzing.Models.Entity.TagEntity;
import org.springframework.data.web.PagedModel;

import java.util.List;
import java.util.Set;

public interface ITagService {
    PagedModel<TagResponse> getAllTags(String name, Integer page, Integer limit);
    Set<TagEntity> getTagsByIds(List<String> ids);
    TagEntity getTagById(String id);
    TagResponse createTag(TagCreateRequest tagCreateRequest);
    TagResponse updateTag(TagUpdateRequest tagUpdateRequest);
    void deleteTag(List<String> ids);
}
