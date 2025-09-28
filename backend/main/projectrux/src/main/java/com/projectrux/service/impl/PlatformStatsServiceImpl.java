package com.projectrux.service.impl;

import com.projectrux.entity.PlatformStats;
import com.projectrux.repository.PlatformStatsRepository;
import com.projectrux.service.PlatformStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PlatformStatsServiceImpl implements PlatformStatsService {

    @Autowired
    private PlatformStatsRepository platformStatsRepository;

    @Override
    public List<Map<String, Integer>> getAllStats() {

        return platformStatsRepository.findAll()
                .stream()
                .map(s -> Map.of(
                        "developers", s.getDevelopers(),
                        "activeProjects", s.getActiveProjects()
                )).toList();

    }
}
