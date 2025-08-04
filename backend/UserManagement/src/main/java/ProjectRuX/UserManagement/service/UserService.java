package ProjectRuX.UserManagement.service;

import ProjectRuX.UserManagement.model.UserDto;

import java.util.List;
import java.util.Map;

public interface UserService {

    public UserDto signup(UserDto userDto);

    public UserDto signupTest(UserDto userDto);

    public String login(UserDto userDto);

    public UserDto updateUser(UserDto userDto);

    public String deleteUser(String id);

    public UserDto getUserById(String id);

    public Map<String, List<String>> addUserSkills(String id, List<String> skills);

    public List<String> getUserSkills(String id);

    public List<String> getAllSkills();

    public List<UserDto> getAllUsers();

}
