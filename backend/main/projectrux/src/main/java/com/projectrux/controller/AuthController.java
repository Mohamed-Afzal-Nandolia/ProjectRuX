package com.projectrux.controller;

import com.projectrux.model.OtoDto;
import com.projectrux.model.UserDto;
import com.projectrux.security.JwtUtil;
import com.projectrux.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth") // Endpoints are OPEN in this CLASS
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody UserDto authUserDto){
        Map<String, String> message = userService.signup(authUserDto);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/verify-otp/{userId}")
    public ResponseEntity<Map<String, String>> verifyOtp(@PathVariable String userId, @RequestBody OtoDto otp){
        Map<String, String> token = userService.verifyOtp(userId, otp);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/resend-otp/{userId}")
    public ResponseEntity<Map<String, String>> resendOtp(@PathVariable String userId, @RequestBody OtoDto otp){
        Map<String, String> token = userService.resendOtp(userId, otp);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserDto authUserDto) {
        Map<String, String> token = userService.login(authUserDto);

        if (!token.isEmpty()) {
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, String>> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Auth Header received: " + authHeader);
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            String username = jwtUtil.validateToken(token);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("username", username);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "failed");
            errorResponse.put("message", "Invalid or expired token: " + e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody UserDto userDto){
        Map<String, String> message = userService.forgotPassword(userDto);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestParam("token") String token, @RequestBody UserDto userDto){
        Map<String, String> message = userService.resetPassword(token, userDto);
        return ResponseEntity.ok(message);
    }

}
