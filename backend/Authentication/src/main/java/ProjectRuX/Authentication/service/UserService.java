package ProjectRuX.Authentication.service;

import ProjectRuX.Authentication.model.AuthUserDto;
import java.util.Map;

public interface UserService {

    public Map<String, String> signup(AuthUserDto authUserDto);

    public Map<String, String> login(AuthUserDto authUserDto);

}
