package ProjectRuX.PostService.entity;

import ProjectRuX.PostService.enums.Roles;
import ProjectRuX.PostService.enums.Skill;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoleRequirement {
    private Roles role;
    private List<Skill> requiredSkills;
    private Integer openings;
}
