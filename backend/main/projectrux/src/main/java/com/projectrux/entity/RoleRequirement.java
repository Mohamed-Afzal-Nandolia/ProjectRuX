package com.projectrux.entity;


import com.projectrux.enums.Roles;
import com.projectrux.enums.Skill;
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
