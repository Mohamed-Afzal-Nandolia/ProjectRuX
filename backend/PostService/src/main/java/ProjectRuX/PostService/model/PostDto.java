package ProjectRuX.PostService.model;

import ProjectRuX.PostService.entity.Applicant;
import ProjectRuX.PostService.entity.RoleRequirement;
import ProjectRuX.PostService.enums.PostStatus;
import ProjectRuX.PostService.enums.Skill;
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

    private List<String> likes;

}
