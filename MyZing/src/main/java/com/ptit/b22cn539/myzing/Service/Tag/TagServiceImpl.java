package com.ptit.b22cn539.myzing.Service.Tag;

import com.ptit.b22cn539.myzing.Commons.Utils.PaginationUtils;
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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements ITagService {
    private final ITagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedModel<TagResponse> getAllTags(Integer page, Integer limit) {
        Pageable pageable = PaginationUtils.getPageRequest(page, limit);
        Page<TagEntity> tags = this.tagRepository.findAll(pageable);
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
}
