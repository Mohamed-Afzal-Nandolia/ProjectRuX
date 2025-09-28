package com.projectrux.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "platform_stats")
public class PlatformStats {
    @Id
    private String id;

    private Integer developers;

    private Integer activeProjects;

    public PlatformStats(Integer developers, Integer activeProjects){
        this.developers = developers;
        this.activeProjects = activeProjects;
    }

}
