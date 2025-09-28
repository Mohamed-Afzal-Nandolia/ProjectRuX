package com.projectrux.controller;

import com.projectrux.service.PlatformStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/platform")
public class PlatformController {

    @Autowired
    PlatformStatsService platformStatsService;

    @GetMapping("/stats")
    public ResponseEntity<List<Map<String, Integer>>> getAllStats(){
        List<Map<String, Integer>> allStats = platformStatsService.getAllStats();
        return ResponseEntity.ok(allStats);
    }

}
