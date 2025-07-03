package com.ptit.b22cn539.myzing.Service.Playlist;

import com.ptit.b22cn539.myzing.Commons.Mappers.PlaylistMapper;
import com.ptit.b22cn539.myzing.Commons.Utils.PaginationUtils;
import com.ptit.b22cn539.myzing.DTO.Request.Playlist.PlaylistRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Playlist.PlaylistResponse;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.PlaylistEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserFavouritePlaylistEntity;
import com.ptit.b22cn539.myzing.Repository.IPlaylistRepository;
import com.ptit.b22cn539.myzing.Repository.IUserFavouritePlaylistRepository;
import com.ptit.b22cn539.myzing.Service.Song.ISongService;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements IPlaylistService {
    private final ISongService songService;
    private final IUserService userService;
    private final IPlaylistRepository playlistRepository;
    private final PlaylistMapper playlistMapper;
    private final IUserFavouritePlaylistRepository userFavouritePlaylistRepository;

    @Override
    @Transactional
    public PlaylistResponse createPlaylist(PlaylistRequest playlistRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userService.getUserByEmail(email);
        PlaylistEntity playlistEntity = new PlaylistEntity(playlistRequest, user);
        this.playlistRepository.save(playlistEntity);
        return this.playlistMapper.toResponse(playlistEntity);
    }

    @Override
    @Transactional
    public PlaylistResponse addSongToPlaylist(String playlistId, List<String> songIds) {
        PlaylistEntity playlist = this.getPlaylistById(playlistId);
        Set<SongEntity> songs = playlist.getSongs();
        songIds.forEach(songId -> {
            SongEntity song = this.songService.getSongById(songId);
            song.getPlaylists().add(playlist);
            songs.add(song);
        });
        playlist.setSongs(songs);
        this.playlistRepository.save(playlist);
        return this.playlistMapper.toResponse(playlist);
    }


    @Override
    @Transactional
    public PlaylistResponse removeSongFromPlaylist(String playlistId, List<String> songIds) {
        PlaylistEntity playlist = this.getPlaylistById(playlistId);
        Set<SongEntity> songs = playlist.getSongs();
        songIds.forEach(songId -> {
            SongEntity song = this.songService.getSongById(songId);
            songs.remove(song);
        });
        playlist.setSongs(songs);
        this.playlistRepository.save(playlist);
        return this.playlistMapper.toResponse(playlist);
    }

    @Override
    @Transactional(readOnly = true)
    public PlaylistEntity getPlaylistById(String playlistId) {
        return this.playlistRepository.findById(playlistId)
                .orElseThrow(() -> new DataInvalidException(AppException.PLAYLIST_NOT_FOUND));

    }

    @Override
    @Transactional(readOnly = true)
    public PlaylistResponse getPlaylistResponseById(String id) {
        return this.playlistMapper.toResponse(this.getPlaylistById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedModel<PlaylistResponse> getAllPlaylistPublic(Integer page, Integer limit) {
        Pageable pageable = PaginationUtils.getPageRequest(page, limit);
        Page<PlaylistEntity> playlists = this.playlistRepository.findByCommunalIsTrue(pageable);
        return new PagedModel<>(playlists.map(this.playlistMapper::toResponse));
    }

    @Override
    @Transactional
    public void likePlaylist(String playlistId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!this.userFavouritePlaylistRepository.existsByPlaylist_IdAndUser_Email(playlistId, email)) {
            PlaylistEntity playlist = this.getPlaylistById(playlistId);
            UserEntity user = this.userService.getUserByEmail(email);
            UserFavouritePlaylistEntity userFavouritePlaylist = new UserFavouritePlaylistEntity(playlist, user);
            playlist.getUserFavouritePlaylists().add(userFavouritePlaylist);
            this.playlistRepository.save(playlist);
        } else {
            this.userFavouritePlaylistRepository.deleteByPlaylist_IdAndUser_Email(playlistId, email);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PagedModel<PlaylistResponse> getMyPlaylist(Integer page, Integer limit) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Pageable pageable = PaginationUtils.getPageRequest(page, limit);
        Page<PlaylistEntity> playlistEntities = this.playlistRepository.findByUser_Email(email, pageable);
        return new PagedModel<>(playlistEntities.map(this.playlistMapper::toResponse));
    }
}