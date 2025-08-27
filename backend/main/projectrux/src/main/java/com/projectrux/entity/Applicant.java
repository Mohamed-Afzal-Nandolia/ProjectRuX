package com.projectrux.entity;


import com.projectrux.enums.ApplicantStatus;
import com.projectrux.enums.Roles;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Applicant {

    private String userId;

    private Roles roleApplied;

    private ApplicantStatus status;

}
