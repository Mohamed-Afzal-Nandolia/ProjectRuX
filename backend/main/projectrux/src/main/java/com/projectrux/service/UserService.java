package com.projectrux.service;


import com.projectrux.model.OtoDto;
import com.projectrux.model.UserDto;
import com.projectrux.model.UserProfileDto;

import java.util.List;
import java.util.Map;

public interface UserService {

    public Map<String, String> signup(UserDto authUserDto);

    public Map<String, String> getUserByEmailId(UserDto userDto);

    public Map<String, String> verifyOtp(String userId, OtoDto otp);

    public Map<String, String> resendOtp(String userId, OtoDto otp);

    public Map<String, String> login(UserDto authUserDto);

    public Map<String, String> forgotPassword(UserDto userDto);

    public Map<String, String> resetPassword(String token, UserDto userDto);

    public UserDto updateUser(UserDto userDto);

    public UserDto updateUserRoleAndSkills(UserDto userDto);

    public String deleteUser(String id);

    public UserProfileDto getUserById(String id);

    public Map<String, List<String>> addUserSkills(String id, List<String> skills);

    public List<String> getUserSkills(String id);

    public List<String> getAllSkills();

    public List<UserDto> getAllUsers();

}
