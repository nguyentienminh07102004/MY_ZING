package com.ptit.b22cn539.myzing.Controller.Public;

import com.ptit.b22cn539.myzing.DTO.Response.Singer.SingerResponse;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/public/singers")
@RequiredArgsConstructor
public class SingerPublicController {
    private final ISingerService singerService;

    @GetMapping()
    public ResponseEntity<PagedModel<SingerResponse>> findAllSingers(@RequestParam(required = false) Integer page,
                                                                     @RequestParam(required = false) Integer limit) {
        PagedModel<SingerResponse> singerResponses = this.singerService.getAllSingers(page, limit);
        return ResponseEntity.status(200).body(singerResponses);
    }
}
