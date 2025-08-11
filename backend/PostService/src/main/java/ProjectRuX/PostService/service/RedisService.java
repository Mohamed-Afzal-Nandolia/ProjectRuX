package ProjectRuX.PostService.service;

public interface RedisService {

    public <T> T get(String key, Class<T> type, Long ttlSeconds);

    public void set(String key, Object value, Long ttlSeconds);

}
