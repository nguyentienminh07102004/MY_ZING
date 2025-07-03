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
        JdkSerializationRedisSerializer serializationRedisSerializer = new JdkSerializationRedisSerializer();
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(this.connectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializationRedisSerializer);
        template.setValueSerializer(serializationRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public HashOperations<String, String, Object> hashOperations(RedisTemplate<String, Object> redisTemplate) {
        return redisTemplate.opsForHash();
    }
}
