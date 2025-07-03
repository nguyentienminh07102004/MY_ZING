package com.ptit.b22cn539.myzing.Service.Playlist;

import com.ptit.b22cn539.myzing.DTO.Request.Playlist.PlaylistRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Playlist.PlaylistResponse;
import com.ptit.b22cn539.myzing.Models.Entity.PlaylistEntity;
import org.springframework.data.web.PagedModel;

import java.util.List;

public interface IPlaylistService {
    PlaylistResponse createPlaylist(PlaylistRequest playlistRequest);
    PlaylistResponse addSongToPlaylist(String playlistId, List<String> songIds);
    PlaylistResponse removeSongFromPlaylist(String playlistId, List<String> songIds);
    PlaylistEntity getPlaylistById(String playlistId);
    PlaylistResponse getPlaylistResponseById(String id);
    PagedModel<PlaylistResponse> getAllPlaylistPublic(Integer page, Integer limit);
    void likePlaylist(String playlistId);
    PagedModel<PlaylistResponse> getMyPlaylist(Integer page, Integer limit);
}
