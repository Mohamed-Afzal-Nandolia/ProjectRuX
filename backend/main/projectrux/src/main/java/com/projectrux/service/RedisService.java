package com.projectrux.service;

import com.fasterxml.jackson.core.type.TypeReference;

public interface RedisService {

    public <T> T get(String key, Class<T> type, Long ttlSeconds);

    <T> T get(String key, TypeReference<T> typeRef, Long ttlSeconds);

    public void set(String key, Object value, Long ttlSeconds);

    public void delete(String key);

}
