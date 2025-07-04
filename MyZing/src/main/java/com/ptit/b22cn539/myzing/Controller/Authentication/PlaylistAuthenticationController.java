package com.ptit.b22cn539.myzing.Controller.Authentication;

import com.ptit.b22cn539.myzing.DTO.Request.Playlist.PlaylistRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Playlist.PlaylistResponse;
import com.ptit.b22cn539.myzing.Service.Playlist.IPlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/auth/playlists")
@RequiredArgsConstructor
public class PlaylistAuthenticationController {
    private final IPlaylistService playlistService;

    @PostMapping()
    public ResponseEntity<PlaylistResponse> createPlaylist(@RequestBody PlaylistRequest playlistRequest) {
        PlaylistResponse playlist = this.playlistService.createPlaylist(playlistRequest);
        return new ResponseEntity<>(playlist, HttpStatus.CREATED);
    }

    @PutMapping(value = "/playlist/{playlistId}/songs/{songIds}")
    @PreAuthorize(value = "@securityUtils.isPlaylistOwnerByUser(#playlistId)")
    public ResponseEntity<PlaylistResponse> addSongToPlaylist(@PathVariable String playlistId, @PathVariable List<String> songIds) {
        PlaylistResponse playlist = this.playlistService.addSongToPlaylist(playlistId, songIds);
        return new ResponseEntity<>(playlist, HttpStatus.OK);
    }

    @DeleteMapping(value = "/playlist/{playlistId}/songs/{songIds}")
    @PreAuthorize(value = "@securityUtils.isPlaylistOwnerByUser(#playlistId)")
    public ResponseEntity<PlaylistResponse> removeSongFromPlaylist(@PathVariable String playlistId, @PathVariable List<String> songIds) {
        PlaylistResponse playlist = this.playlistService.removeSongFromPlaylist(playlistId, songIds);
        return new ResponseEntity<>(playlist, HttpStatus.OK);
    }

    @PostMapping(value = "/favourites/{playlistId}")
    public ResponseEntity<Void> likePlaylist(@PathVariable String playlistId) {
        this.playlistService.likePlaylist(playlistId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/my-playlists")
    public ResponseEntity<PagedModel<PlaylistResponse>> getMyPlaylist(@RequestParam(required = false) Integer page,
                                                                      @RequestParam(required = false) Integer limit) {
        PagedModel<PlaylistResponse> playlists = this.playlistService.getMyPlaylist(page, limit);
        return new ResponseEntity<>(playlists, HttpStatus.OK);
    }
}
