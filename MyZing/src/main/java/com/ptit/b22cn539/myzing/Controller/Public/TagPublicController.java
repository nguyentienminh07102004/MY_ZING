package com.ptit.b22cn539.myzing.Controller.Public;

import com.ptit.b22cn539.myzing.DTO.Response.Tag.TagResponse;
import com.ptit.b22cn539.myzing.Service.Tag.ITagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/tags")
public class TagPublicController {
    private final ITagService tagService;

    @GetMapping()
    public ResponseEntity<PagedModel<TagResponse>> getAllTags(@RequestParam(required = false) Integer page,
                                                              @RequestParam(required = false) Integer limit) {
        PagedModel<TagResponse> tags = this.tagService.getAllTags(page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(tags);
    }
}
