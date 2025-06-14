package com.ptit.b22cn539.myzing.Controller.Public;

import com.ptit.b22cn539.myzing.DTO.Request.Song.SongSearchRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Song.SongResponse;
import com.ptit.b22cn539.myzing.Service.Song.Elasticsearch.ISongElasticsearchService;
import com.ptit.b22cn539.myzing.Service.Song.ISongService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.IOException;

@RestController
@RequestMapping(value = "/public/songs")
@RequiredArgsConstructor
@Slf4j
public class SongPublicController {
    private final ISongElasticsearchService songElasticsearchService;
    private final ISongService songService;

    @GetMapping()
    public ResponseEntity<PagedModel<SongResponse>> getSong(@ModelAttribute SongSearchRequest songSearchRequest) {
        PagedModel<SongResponse> res = this.songElasticsearchService.findSong(songSearchRequest);
        return ResponseEntity.status(200).body(res);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<SongResponse> getSongById(@PathVariable String id) {
        SongResponse songResponse = this.songElasticsearchService.findSongById(id);
        return ResponseEntity.status(200).body(songResponse);
    }

    @GetMapping(value = "/download/{id}")
    public void downloadSongById(@PathVariable String id, HttpServletResponse response) {
        ResponseInputStream<GetObjectResponse> responseInputStream = this.songService.downloadSong(id);
        ServletOutputStream sos = null;
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, responseInputStream.response().contentDisposition());
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        try {
            byte[] buffer = new byte[1024];
            sos = response.getOutputStream();
            int i = responseInputStream.read(buffer);
            while (i != -1) {
                sos.write(buffer, 0, i);
                i = responseInputStream.read(buffer);
            }
            sos.flush();
        } catch (Exception exception) {
            log.error(exception.getMessage());
        } finally {
            try {
                responseInputStream.close();
            } catch (IOException e) {
                log.error(e.getMessage());
            }
            if (sos != null) {
                try {
                    sos.close();
                } catch (Exception e) {
                    log.error(e.getMessage());
                }
            }
        }
    }
}
