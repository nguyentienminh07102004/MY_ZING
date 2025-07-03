package com.ptit.b22cn539.myzing.Service.Tag;

import com.ptit.b22cn539.myzing.Commons.Utils.PaginationUtils;
import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagUpdateRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Tag.TagResponse;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.TagEntity;
import com.ptit.b22cn539.myzing.Repository.ITagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements ITagService {
    private final ITagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedModel<TagResponse> getAllTags(String name, Integer page, Integer limit) {
        Pageable pageable = PaginationUtils.getPageRequest(page, limit);
        if (!StringUtils.hasText(name)) name = null;
        Page<TagEntity> tags = this.tagRepository.findAll(name, pageable);
        return new PagedModel<>(tags.map(TagResponse::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Set<TagEntity> getTagsByIds(List<String> ids) {
        Set<TagEntity> tags = new HashSet<>();
        for (String id : ids) {
            TagEntity tag = this.getTagById(id);
            tags.add(tag);
        }
        return tags;
    }

    @Override
    @Transactional(readOnly = true)
    public TagEntity getTagById(String id) {
        return this.tagRepository.findById(id)
                .orElseThrow(() -> new DataInvalidException(AppException.TAG_NOT_FOUND));
    }

    @Override
    @Transactional
    public TagResponse createTag(TagCreateRequest tagCreateRequest) {
        TagEntity tag = new TagEntity(tagCreateRequest);
        this.tagRepository.save(tag);
        return new TagResponse(tag);
    }

    @Override
    @Transactional
    public TagResponse updateTag(TagUpdateRequest tagUpdateRequest) {
        TagEntity tag = this.getTagById(tagUpdateRequest.getId());
        tag.setDescription(tagUpdateRequest.getDescription());
        this.tagRepository.save(tag);
        return new TagResponse(tag);
    }

    @Override
    @Transactional
    public void deleteTag(List<String> ids) {
        for (String id : ids) {
            TagEntity tag = this.getTagById(id);
            this.tagRepository.delete(tag);
        }
    }
}
