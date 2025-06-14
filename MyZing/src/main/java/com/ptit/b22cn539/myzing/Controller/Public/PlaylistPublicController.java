package com.ptit.b22cn539.myzing.Controller.Public;

import com.ptit.b22cn539.myzing.DTO.Response.Playlist.PlaylistResponse;
import com.ptit.b22cn539.myzing.Service.Playlist.IPlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/public/playlists")
@RequiredArgsConstructor
public class PlaylistPublicController {
    private final IPlaylistService playlistService;

    @GetMapping()
    public ResponseEntity<PagedModel<PlaylistResponse>> getAllPublicPlaylists(@RequestParam(required = false) Integer page,
                                                                              @RequestParam(required = false) Integer limit) {
        PagedModel<PlaylistResponse> playlists = this.playlistService.getAllPlaylistPublic(page, limit);
        return new ResponseEntity<>(playlists, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    @PreAuthorize(value = "@securityUtils.isPlaylistPublicOrByOwner(#id)")
    public ResponseEntity<PlaylistResponse> getPlaylistById(@PathVariable String id) {
        PlaylistResponse playlistResponse = this.playlistService.getPlaylistResponseById(id);
        return ResponseEntity.status(200).body(playlistResponse);
    }
}
