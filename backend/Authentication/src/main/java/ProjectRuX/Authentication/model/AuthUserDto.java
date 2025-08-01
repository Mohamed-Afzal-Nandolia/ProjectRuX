package ProjectRuX.Authentication.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthUserDto {

    private String id;

    private String username;

    private String email;

    private String password;

}