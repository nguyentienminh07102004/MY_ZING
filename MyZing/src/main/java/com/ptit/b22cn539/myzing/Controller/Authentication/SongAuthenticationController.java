package com.ptit.b22cn539.myzing.Controller.Authentication;

import com.ptit.b22cn539.myzing.Commons.Validate.FileNotNullOrEmpty.FileNotNullOrEmpty;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongSearchRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongUpdateRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.Service.Song.Elasticsearch.ISongElasticsearchService;
import com.ptit.b22cn539.myzing.Service.Song.ISongService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/auth/songs")
@RequiredArgsConstructor
public class SongAuthenticationController {
    private final ISongService songService;
    private final ISongElasticsearchService songElasticsearchService;

    @PostMapping()
    public ResponseEntity<SongResponse> createSong(@Valid @RequestPart(value = "file") @FileNotNullOrEmpty MultipartFile file,
                                                   @RequestPart(value = "image", required = false) MultipartFile image,
                                                   @Valid @RequestPart(value = "data") SongCreateRequest request) {
        SongResponse songResponse = this.songService.createSong(file, image, request);
        return ResponseEntity.status(201).body(songResponse);
    }

    @PutMapping()
    @PreAuthorize("@securityUtils.isSongByAdminOrOwner(#request.id)")
    public ResponseEntity<SongResponse> updateSong(@RequestPart(value = "file", required = false) MultipartFile file,
                                                   @RequestPart(value = "image", required = false) MultipartFile image,
                                                   @Valid @RequestPart(value = "data") SongUpdateRequest request) {
        SongResponse songResponse = this.songService.updateSong(file, image, request);
        return ResponseEntity.status(200).body(songResponse);
    }

    @GetMapping(value = "my-song")
    public ResponseEntity<PagedModel<SongResponse>> getMySong(@ModelAttribute SongSearchRequest songSearchRequest) {
        PagedModel<SongResponse> res = this.songElasticsearchService.findMySong(songSearchRequest);
        return ResponseEntity.status(200).body(res);
    }

    @DeleteMapping("/{ids}")
    @PreAuthorize(value = "@securityUtils.isSongOwnerByUserOrUserIsAdmin(#ids)")
    public ResponseEntity<Void> deleteSong(@PathVariable List<String> ids) {
        this.songService.deleteSong(ids);
        return ResponseEntity.status(200).build();
    }

    @PostMapping(value = "/favourites/{id}")
    public ResponseEntity<Void> likeSong(@PathVariable String id) {
        this.songService.likeSong(id);
        return ResponseEntity.status(200).build();
    }

    @GetMapping(value = "/my-favourites")
    public ResponseEntity<PagedModel<SongResponse>> getMySongFavourites(@RequestParam(required = false) Integer page,
                                                                        @RequestParam(required = false) Integer limit) {
        PagedModel<SongResponse> songResponses = this.songService.getMySongFavourites(page, limit);
        return ResponseEntity.status(200).body(songResponses);
    }
}
