package com.projectrux.entity;


import com.projectrux.enums.PostStatus;
import com.projectrux.enums.Skill;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String title;

    private String description;

    private List<Skill> techStack;

    private List<RoleRequirement> rolesRequired;

    private List<String> tags;

    private PostStatus status;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<Applicant> applicants;

    private List<String> likes;

}

