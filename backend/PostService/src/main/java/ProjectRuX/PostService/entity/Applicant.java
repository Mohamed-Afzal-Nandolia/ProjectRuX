package ProjectRuX.PostService.entity;

import ProjectRuX.PostService.enums.ApplicantStatus;
import ProjectRuX.PostService.enums.Roles;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Applicant {

    private String userId;

    private Roles roleApplied;

    private ApplicantStatus status;

}
