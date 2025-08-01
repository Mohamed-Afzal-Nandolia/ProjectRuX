//package ProjectRuX.UserManagement.controller;
//
//
//import ProjectRuX.UserManagement.model.UserDto;
//import ProjectRuX.UserManagement.security.JwtUtil;
//import ProjectRuX.UserManagement.service.UserService;
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/auth")
//public class AuthController {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
//        String token = userService.login(userDto);
//
//        if (!token.isEmpty()) {
//            return ResponseEntity.ok(Map.of("token", token));
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//    }
//
////    @Setter
////    @Getter
////    static class AuthRequest {
////        private String username;
////        private String password;
////
////    }
//}
//
