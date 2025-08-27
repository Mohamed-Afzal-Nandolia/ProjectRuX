package com.projectrux.controller;

import com.projectrux.model.UserDto;
import com.projectrux.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserContoller {

    @Autowired
    private UserService userService;

//    @PostMapping("/auth/login") //Endpoint is OPEN
//    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
//        String token = userService.login(userDto);
//
//        if (!token.isEmpty()) {
//            return ResponseEntity.ok(Map.of("token", token));
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//    }

    @PutMapping("/update-user")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto){
        UserDto userObj = userService.updateUser(userDto);
        return ResponseEntity.ok(userObj);
    }

    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") String id){
        String message = userService.deleteUser(id);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") String id){
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers(){
        List<UserDto> allUsers = userService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/get-skills/{id}")
    public ResponseEntity<List<String>> getUserSkills(@PathVariable("id") String id){
        List<String> allUserSkills = userService.getUserSkills(id);
        return ResponseEntity.ok(allUserSkills);
    }

    @GetMapping("/get-all-skills")
    public ResponseEntity<List<String>> getAllSkills(){
        List<String> allUserSkills = userService.getAllSkills();
        return ResponseEntity.ok(allUserSkills);
    }

    @PutMapping("/add-skills/{id}")
    public ResponseEntity<Map<String, List<String>>> addUserSkills(@PathVariable("id") String id, @RequestBody List<String> skills){
        Map<String, List<String>> updatedUserSkills = userService.addUserSkills(id, skills);

        if (updatedUserSkills.containsKey("Invalid Skills")) {
            return ResponseEntity.badRequest().body(updatedUserSkills);
        }

        return ResponseEntity.ok(updatedUserSkills);
    }

}
