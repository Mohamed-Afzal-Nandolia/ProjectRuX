package com.projectrux.entity;


import com.projectrux.enums.ApplicantStatus;
import com.projectrux.enums.Roles;
import com.projectrux.enums.Skill;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Applicant {

    private String userId;

    private Roles roleApplied;

    private List<Skill> skills;

    private ApplicantStatus status;

    private String applicantPitch;

}
