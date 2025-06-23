package com.ptit.b22cn539.myzing.Service.Singer;

import com.ptit.b22cn539.myzing.Commons.Utils.PaginationUtils;
import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import com.ptit.b22cn539.myzing.DTO.Response.Singer.SingerResponse;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Repository.ISingerRepository;
import com.ptit.b22cn539.myzing.Service.AWS.IAWSService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SingerServiceImpl implements ISingerService {
    private final ISingerRepository singerRepository;
    private final IAWSService awsService;

    @Override
    @Transactional(readOnly = true)
    public Set<SingerEntity> findAll(List<String> ids) {
        Set<SingerEntity> result = new HashSet<>();
        ids.forEach(id -> result.add(this.findById(id)));
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public SingerEntity findById(String id) {
        return singerRepository.findById(id)
                .orElseThrow(() -> new DataInvalidException(AppException.SINGER_NOT_FOUND));
    }

    @Override
    public SingerResponse createSinger(SingerRequest singerRequest, MultipartFile avatar) {
        SingerEntity singerEntity = new SingerEntity(singerRequest);
        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = this.awsService.uploadFile(avatar);
            singerEntity.setAvatar(avatarUrl);
        }
        this.singerRepository.save(singerEntity);
        return new SingerResponse(singerEntity);
    }

    @Override
    public List<SingerEntity> findAll() {
        return this.singerRepository.findAll();
    }

    @Override
    @Transactional
    public PagedModel<SingerResponse> getAllSingers(Integer page, Integer limit) {
        Pageable pageable = PaginationUtils.getPageRequest(page, limit);
        Page<SingerEntity> pageEntities = this.singerRepository.findAll(pageable);
        Page<SingerResponse> pageResponses = pageEntities.map(SingerResponse::new);
        return new PagedModel<>(pageResponses);
    }
}
