package com.ptit.b22cn539.myzing.Service.Singer;

import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Singer.SingerResponse;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import org.springframework.data.web.PagedModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface ISingerService {
    Set<SingerEntity> findAll(List<String> ids);
    SingerEntity findById(String id);
    SingerResponse createSinger(SingerRequest singerRequest, MultipartFile avatar);
    PagedModel<SingerResponse> getAllSingers(Integer page, Integer limit);
}
