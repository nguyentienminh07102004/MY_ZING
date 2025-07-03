package com.ptit.b22cn539.myzing.Commons.Utils;

import com.ptit.b22cn539.myzing.Commons.Enums.ROLE;
import com.ptit.b22cn539.myzing.Models.Entity.PlaylistEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Service.Playlist.IPlaylistService;
import com.ptit.b22cn539.myzing.Service.Song.ISongService;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final IPlaylistService playlistService;
    private final IUserService userService;
    private final ISongService songService;

    public boolean isPlaylistOwnerByUser(String playlistId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userService.getUserByEmail(email);
        if (user.getRole().equals(ROLE.ADMIN)) {
            return true;
        }
        PlaylistEntity playlist = this.playlistService.getPlaylistById(playlistId);
        return playlist.getUser().getEmail().equals(email);
    }

    public boolean isSongOwnerByUserOrUserIsAdmin(List<String> songIds) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userService.getUserByEmail(email);
        if (user.getRole().equals(ROLE.ADMIN)) {
            return true;
        }
        for (String songId : songIds) {
            SongEntity song = this.songService.getSongById(songId);
            if (!song.getUser().getEmail().equals(email)) return false;
        }
        return true;
    }

    public boolean isPlaylistPublicOrByOwner(String playlistId) {
        PlaylistEntity playlist = this.playlistService.getPlaylistById(playlistId);
        if (playlist.getCommunal()) return true;
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userService.getUserByEmail(email);
        if (user.getRole().equals(ROLE.ADMIN)) {
            return true;
        }
        return playlist.getUser().equals(user);
    }

    public boolean isSongByAdminOrOwner(String id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userService.getUserByEmail(email);
        if (user.getRole().equals(ROLE.ADMIN)) {
            return true;
        }
        SongEntity song = this.songService.getSongById(id);
        return song.getUser().equals(user);
    }
}
