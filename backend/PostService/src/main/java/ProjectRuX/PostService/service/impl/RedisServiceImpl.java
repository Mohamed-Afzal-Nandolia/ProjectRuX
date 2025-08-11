package ProjectRuX.PostService.service.impl;

import ProjectRuX.PostService.model.PostDto;
import ProjectRuX.PostService.service.RedisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class RedisServiceImpl implements RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void set(String key, Object value, Long ttlSeconds) {
        try {
            redisTemplate.opsForValue().set(key, value, ttlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public <T> T get(String key, Class<T> type, Long ttlSeconds) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) return null;

            // Refresh TTL
            if (ttlSeconds != null) {
                redisTemplate.expire(key, ttlSeconds, TimeUnit.SECONDS);
            }

            return objectMapper.convertValue(value, type);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
