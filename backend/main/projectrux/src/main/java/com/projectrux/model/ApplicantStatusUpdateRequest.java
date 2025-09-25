package com.projectrux.model;

import com.projectrux.entity.Applicant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicantStatusUpdateRequest {
    private Applicant applicantStatus;
    private MailDto mailDto;
}
