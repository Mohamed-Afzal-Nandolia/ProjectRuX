package com.projectrux.model;

import com.projectrux.entity.Applicant;
import com.projectrux.entity.RoleRequirement;
import com.projectrux.enums.PostStatus;
import com.projectrux.enums.Skill;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostDto {

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

    private long applied;

}
