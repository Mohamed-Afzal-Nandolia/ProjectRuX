package com.projectrux.service.impl;


import com.projectrux.entity.Otp;
import com.projectrux.entity.User;
import com.projectrux.enums.Skill;
import com.projectrux.enums.UserStatus;
import com.projectrux.exception.ResourceAlreadyExists;
import com.projectrux.exception.ResourceNotFoundException;
import com.projectrux.model.OtoDto;
import com.projectrux.model.UserDto;
import com.projectrux.repository.OtpRepository;
import com.projectrux.repository.UserRepository;
import com.projectrux.security.JwtUtil;
import com.projectrux.service.MailService;
import com.projectrux.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    OtpRepository otpRepository;

    @Autowired
    MailService mailService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    private User findUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User does not exist with id: " + id));
    }

    @Override
    public Map<String, String> signup(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()){
            throw new ResourceAlreadyExists("Email: '" + userDto.getEmail() + "' Already Exists");
        }

        if (userRepository.findByUsername(userDto.getUsername()).isPresent()){
            throw new ResourceAlreadyExists("Username: '" + userDto.getUsername() + "' Already Exists");
        }

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        User user = modelMapper.map(userDto, User.class);
        user.setPassword(encodedPassword);
        user.setStatus(UserStatus.PENDING);
        User savedUser = userRepository.save(user);

        Otp otpEntity = new Otp();
        otpEntity.setUserId(savedUser.getId());
        otpEntity.setOtpCode(generateOtp());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otpEntity);

        mailService.sendOtpMail(savedUser.getEmail(), "", otpEntity.getOtpCode());
        return Map.of("success", "OTP has been sent to your Email");
    }

    private String generateOtp() {
        int otp = (int)(Math.random() * 900000) + 100000; // 6-digit random
        return String.valueOf(otp);
    }

    @Override
    public Map<String, String> verifyOtp(String userId, OtoDto otp) {
        User user = findUser(userId);

        if (user.getStatus() != UserStatus.PENDING) {
            return Map.of("error", "Otp verification is already done");
        }

        Otp otpEntity = otpRepository.findByUserId(userId);
        if (otpEntity == null) {
            return Map.of("error", "Otp not found or already used");
        }

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            return Map.of("error", "Otp expired");
        }

        if (!otpEntity.getOtpCode().equals(otp.getOtpCode())) {
            return Map.of("error", "Wrong Otp");
        }

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        otpRepository.delete(otpEntity);

        return Map.of("token", jwtUtil.generateToken(Map.of("username", user.getUsername())));
    }

    @Override
    public Map<String, String> resendOtp(String userId, OtoDto otp) {
        User user = findUser(userId);

        Otp otpEntity = otpRepository.findByUserId(userId);
        if(otpEntity == null) {
            return Map.of("error", "No OTP found");
        }
        otpEntity.setOtpCode(generateOtp());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otpEntity);

        mailService.sendOtpMail(user.getEmail(), "", otpEntity.getOtpCode());
        return Map.of("success", "New OTP has been sent to your Email");
    }

    public Map<String, String> login(UserDto userDto){
        User user;
        if(userDto.getEmail() != null){
            user = userRepository.findByEmail(userDto.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Email id: '" + userDto.getEmail() + "' not found"));
        }
        else if(userDto.getUsername() != null){
            user = userRepository.findByUsername(userDto.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Username: '" + userDto.getUsername() + "' not found"));
        }
        else{
            return Map.of("error", "Email Id or Username not provided");
        }


        if(!passwordEncoder.matches(userDto.getPassword(), user.getPassword())){
            throw new ResourceNotFoundException("Incorrect Password");
        }

        return Map.of("token", jwtUtil.generateToken(Map.of("username", user.getUsername())));
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        User user = findUser(userDto.getId());

        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setSkills(userDto.getSkills());
        user.setBio(userDto.getBio());
        user.setCreatedAt(userDto.getCreatedAt());

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        user.setPassword(encodedPassword);

        User updatedUser = userRepository.save(user);

        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    public String deleteUser(String id) {
        User user = findUser(id);
        userRepository.deleteById(id);

        return "User Deleted Successfully with id: " + user.getId();
    }

    @Override
    public UserDto getUserById(String id) {
        User user = findUser(id);
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public Map<String, List<String>> addUserSkills(String id, List<String> skills){
        User user = findUser(id);

        List<String> existingSkills = user.getSkills() == null ? new ArrayList<>() : user.getSkills();
        Set<Skill> validSkills = new HashSet<>();
        List<String> invalidSkills = new ArrayList<>();

        for (String skill : skills) {
            try {
                Skill s = Skill.valueOf(skill.toUpperCase());
                validSkills.add(s);
                if(!existingSkills.contains(skill)){
                    existingSkills.add(skill);
                }
            } catch (Exception e) {
                invalidSkills.add(skill);
            }
        }

        if (!invalidSkills.isEmpty()){
            return Map.of("Invalid Skills", invalidSkills);
        }
        user.setSkills(existingSkills);
        userRepository.save(user);
        return Map.of("Updated Skills", existingSkills);
    }

    @Override
    public List<String> getUserSkills(String id) {
        User user = findUser(id);
        UserDto userDto = modelMapper.map(user, UserDto.class);

        return userDto.getSkills();
    }

    @Override
    public List<String> getAllSkills() {
        return Arrays.stream(Skill.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map((user) -> modelMapper.map(user, UserDto.class)).collect(Collectors.toList());
    }
}
