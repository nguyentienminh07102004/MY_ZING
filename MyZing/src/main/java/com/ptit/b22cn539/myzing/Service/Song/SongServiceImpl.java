package com.ptit.b22cn539.myzing.Service.Song;

import com.ptit.b22cn539.myzing.Commons.Events.SongCreateUpdateEvent;
import com.ptit.b22cn539.myzing.Commons.Events.SongDeleteEvent;
import com.ptit.b22cn539.myzing.Commons.Mappers.SongMapper;
import com.ptit.b22cn539.myzing.Commons.Utils.PaginationUtils;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongCreateRequest;
import com.ptit.b22cn539.myzing.DTO.Request.Song.SongUpdateRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserSongFavouriteEntity;
import com.ptit.b22cn539.myzing.Repository.ISongRepository;
import com.ptit.b22cn539.myzing.Repository.IUserFavouriteSongRepository;
import com.ptit.b22cn539.myzing.Service.AWS.IAWSService;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SongServiceImpl implements ISongService {
    private final ISongRepository songRepository;
    private final IUserFavouriteSongRepository userFavouriteSongRepository;
    private final ISingerService singerService;
    private final IAWSService awsService;
    private final IUserService userService;
    private final SongMapper songMapper;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    @Transactional
    public SongResponse createSong(MultipartFile file, MultipartFile image, SongCreateRequest request) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = this.awsService.uploadFile(image);
            request.setImageUrl(imageUrl);
        }
        List<String> singerIds = request.getSingers();
        Set<SingerEntity> singers = this.singerService.findAll(singerIds);
//        String fileKey = this.awsService.uploadFile(file);
        String fileKey = "Link to file";
        request.setUrl(fileKey);
        SongEntity song = new SongEntity(request, singers);
        this.songRepository.save(song);
        SongCreateUpdateEvent event = new SongCreateUpdateEvent(List.of(song));
        this.applicationEventPublisher.publishEvent(event);
        return this.songMapper.toResponse(song);
    }

    @Override
    @Transactional
    public SongResponse updateSong(MultipartFile file, MultipartFile image, SongUpdateRequest request) {
        SongEntity song = this.getSongById(request.getId());
        if (image != null && !image.isEmpty()) {
            if (StringUtils.hasText(song.getImageUrl())) {
                this.awsService.deleteFile(song.getImageUrl());
            }
            String imageUrl = this.awsService.uploadFile(image);
            request.setImageUrl(imageUrl);
        }
        Set<SingerEntity> singers = this.singerService.findAll(request.getSingers());
        this.awsService.deleteFile(song.getUrl());
        String fileKey = song.getUrl();
        if (file != null && !file.isEmpty()) {
            fileKey = this.awsService.uploadFile(file);
        }
        request.setUrl(fileKey);
        song = new SongEntity(request, singers);
        this.songRepository.save(song);
        SongCreateUpdateEvent event = new SongCreateUpdateEvent(List.of(song));
        this.applicationEventPublisher.publishEvent(event);
        return this.songMapper.toResponse(song);
    }

    @Override
    @Transactional
    public SongEntity getSongById(String id) {
        return this.songRepository.findById(id)
                .orElseGet(() -> {
                    log.warn("Song id {} not found", id);
                    throw new DataInvalidException(AppException.SONG_NOT_FOUND);
                });
    }

    @Override
    @Transactional
    public void likeSong(String id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userService.getUserByEmail(email);
        SongEntity song = this.getSongById(id);
        if (!this.userFavouriteSongRepository.existsByUser_EmailAndSong_Id(email, id)) {
            UserSongFavouriteEntity userSongFavouriteEntity = new UserSongFavouriteEntity();
            userSongFavouriteEntity.setUser(user);
            userSongFavouriteEntity.setSong(song);
            song.getUserSongFavourites().add(userSongFavouriteEntity);
            this.songRepository.save(song);
        } else {
            this.userFavouriteSongRepository.deleteByUser_EmailAndSong_Id(email, id);
        }
    }

    @Override
    @Transactional
    public void deleteSong(List<String> ids) {
        this.songRepository.deleteAllById(ids);
        SongDeleteEvent event = new SongDeleteEvent(ids);
        this.applicationEventPublisher.publishEvent(event);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedModel<SongResponse> getMySongFavourites(Integer page, Integer limit) {
        Pageable pageable = PaginationUtils.getPageRequest(page, limit);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<UserSongFavouriteEntity> songFavourites = this.userFavouriteSongRepository.findByUser_Email(email, pageable);
        Page<SongResponse> songResponses = songFavourites
                .map(UserSongFavouriteEntity::getSong)
                .map(this.songMapper::toResponse);
        return new PagedModel<>(songResponses);
    }

    @Override
    @Transactional
    public ResponseInputStream<GetObjectResponse> downloadSong(String id) {
        SongEntity song = this.getSongById(id);
        return this.awsService.downloadFile(song.getUrl());
    }
}
