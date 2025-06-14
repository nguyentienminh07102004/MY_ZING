package com.ptit.b22cn539.myzing.Fake;

import com.github.javafaker.Faker;
import com.ptit.b22cn539.myzing.Commons.Events.SongCreateUpdateEvent;
import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Repository.ISongRepository;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "fakes")
@RequiredArgsConstructor
@Slf4j
public class FakeDataController {
    private final ISingerService singerService;
    private final ISongRepository songRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @PostMapping(value = "singer")
    @Transactional
    public void createSinger() {
        Faker faker = new Faker();
        for (int i = 0; i < 1000; i++) {
            this.singerService.createSinger(SingerRequest.builder()
                    .fullName(faker.artist().name())
                    .dateOfBirth(new Date(faker.date().birthday(18, 40).getTime()))
                    .description(faker.lorem().paragraph())
                    .gender(faker.bool().bool() ? "M" : "F")
                    .build(), null);
        }
    }

    @PostMapping(value = "/songs")
    @Transactional
    public void createSong() {
        Faker faker = new Faker();
        List<SingerEntity> singerIds = this.singerService.findAll();
        int numberOfSingers = singerIds.size();
        List<SongEntity> songs = new ArrayList<>();

        for (int i = 0; i < 10000; i++) {
            Set<SingerEntity> singers = new HashSet<>();
            for (int j = 0; j < 2; j++) {
                singers.add(singerIds.get(faker.number().numberBetween(0, numberOfSingers - 1)));
            }
            SongEntity song = SongEntity.builder()
                    .name(faker.book().title())
                    .url(faker.book().genre())
                    .description(faker.lorem().paragraph())
                    .singers(singers)
                    .build();
            songs.add(song);
        }
        SongCreateUpdateEvent event = new SongCreateUpdateEvent(songs);
        this.applicationEventPublisher.publishEvent(event);
        this.songRepository.saveAll(songs);
    }
}
