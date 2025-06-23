package com.ptit.b22cn539.myzing.Fake;

import com.github.javafaker.Faker;
import com.ptit.b22cn539.myzing.Commons.EnvProperties.KafkaEnvProperties;
import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import com.ptit.b22cn539.myzing.Models.Entity.SingerEntity;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Repository.ISongRepository;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final IUserService userService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

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
        UserEntity user = this.userService.getUserByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        for (int i = 0; i < 10; i++) {
            Set<SingerEntity> singers = new HashSet<>();
            for (int j = 0; j < 2; j++) {
                singers.add(singerIds.get(faker.number().numberBetween(0, numberOfSingers - 1)));
            }
            SongEntity song = SongEntity.builder()
                    .name(faker.book().title())
                    .url(faker.book().genre())
                    .description(faker.lorem().paragraph())
                    .singers(singers)
                    .user(user)
                    .build();
            songs.add(song);
        }
        this.songRepository.saveAll(songs);
        for (SongEntity song : songs) {
            SongDocument songDocument = new SongDocument(song);
            this.kafkaTemplate.send(KafkaEnvProperties.CREATE_UPDATE_TOPIC, songDocument);
        }
    }
}
