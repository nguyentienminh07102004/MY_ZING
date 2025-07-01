package com.ptit.b22cn539.myzing.Controller.Authentication;

import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Tag.TagUpdateRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Tag.TagResponse;
import com.ptit.b22cn539.myzing.Service.Tag.ITagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/auth/tags")
public class TagAuthenticationController {
    private final ITagService tagService;

    @PostMapping()
    public ResponseEntity<TagResponse> createTag(@RequestBody TagCreateRequest tagCreateRequest) {
        TagResponse tagResponse = this.tagService.createTag(tagCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(tagResponse);
    }

    @PutMapping()
    public ResponseEntity<TagResponse> updateTag(@RequestBody TagUpdateRequest tagUpdateRequest) {
        TagResponse tagResponse = this.tagService.updateTag(tagUpdateRequest);
        return ResponseEntity.status(HttpStatus.OK).body(tagResponse);
    }

    @DeleteMapping(value = "/{tagIds}")
    public ResponseEntity<Void> deleteTags(@PathVariable List<String> tagIds) {
        this.tagService.deleteTag(tagIds);
        return ResponseEntity.status(200).build();
    }
}
