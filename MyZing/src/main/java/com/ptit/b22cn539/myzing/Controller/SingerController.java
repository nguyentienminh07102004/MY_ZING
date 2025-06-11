package com.ptit.b22cn539.myzing.Controller;

import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Singer.SingerResponse;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/singers")
@RequiredArgsConstructor
public class SingerController {
    private final ISingerService service;

    @PostMapping()
    public ResponseEntity<SingerResponse> createSinger(@RequestPart MultipartFile avatar,
                                                       @RequestPart(value = "singer") SingerRequest singerRequest) {
        SingerResponse response = this.service.createSinger(singerRequest, avatar);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
