package com.ptit.b22cn539.myzing.Fake;

import com.github.javafaker.Faker;
import com.ptit.b22cn539.myzing.Commons.EnvProperties.KafkaEnvProperties;
import com.ptit.b22cn539.myzing.DTO.Request.Singer.SingerRequest;
import com.ptit.b22cn539.myzing.Models.Elasticsearch.SongDocument;
import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import com.ptit.b22cn539.myzing.Repository.ISongRepository;
import com.ptit.b22cn539.myzing.Service.Singer.ISingerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping(value = "fakes")
@RequiredArgsConstructor
@Slf4j
public class FakeDataController {
    private final ISingerService singerService;
    private final ISongRepository songRepository;
    private final ChatClient.Builder chatClient;
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
        List<SongEntity> songs = this.songRepository.findAll();
        for (SongEntity song : songs) {
            SongDocument songDocument = new SongDocument(song);
            this.kafkaTemplate.send(KafkaEnvProperties.CREATE_UPDATE_TOPIC, songDocument);
        }
    }

    @GetMapping(value = "/chat")
    public String chat(@RequestParam String message) {
        return this.chatClient.build().prompt(message)
                .call().content();
    }
}
