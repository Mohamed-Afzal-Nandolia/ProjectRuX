package com.projectrux.repository;

import com.projectrux.entity.PlatformStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Map;

public interface PlatformStatsRepository extends MongoRepository<PlatformStats, String> {

}
