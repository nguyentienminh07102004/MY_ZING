package com.ptit.b22cn539.myzing.Configuration.Redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfiguration {
    @Value("${spring.data.redis.host}")
    private String host;
    @Value("${spring.data.redis.port}")
    private Integer port;

    @Bean
    public RedisConnectionFactory connectionFactory() {
        return new JedisConnectionFactory(new RedisStandaloneConfiguration(this.host, this.port));
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper = objectMapper.registerModule(new ParameterNamesModule(JsonCreator.Mode.DEFAULT));
//        objectMapper = objectMapper.registerModule(new JavaTimeModule());
//        objectMapper = objectMapper.findAndRegisterModules();
//        objectMapper = objectMapper.enable(JsonGenerator.Feature.IGNORE_UNKNOWN);
//        objectMapper = objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
//        objectMapper = objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
//                .allowIfSubType("com.ptit.b22cn539.myzing.DTO.Response")
//                // Cho phép các kiểu trong package của bạn và các kiểu List/Map của Java
//                .allowIfSubType("java.util.Date") // Cần thiết cho Date
//                .allowIfSubType("java.sql.Date")
//                .allowIfSubType("java.util.ArrayList")
//                .allowIfSubType("java.util.List")
//                .allowIfSubType("java.util.ImmutableCollections$ListN")
//                .allowIfBaseType("java.lang.Object")
//                .build();
//        objectMapper.activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
//        GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);
        JdkSerializationRedisSerializer jdkSerializationRedisSerializer = new JdkSerializationRedisSerializer();
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(this.connectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(jdkSerializationRedisSerializer);
        template.setValueSerializer(jdkSerializationRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public HashOperations<String, String, Object> hashOperations(RedisTemplate<String, Object> redisTemplate) {
        return redisTemplate.opsForHash();
    }
}
