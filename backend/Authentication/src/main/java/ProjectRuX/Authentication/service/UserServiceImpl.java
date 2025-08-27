package ProjectRuX.Authentication.service;

import ProjectRuX.Authentication.entity.AuthUser;
import ProjectRuX.Authentication.exception.ResourceAlreadyExists;
import ProjectRuX.Authentication.exception.ResourceNotFoundException;
import ProjectRuX.Authentication.model.AuthUserDto;
import ProjectRuX.Authentication.repository.UserRepository;
import ProjectRuX.Authentication.security.JwtUtil;
import jakarta.ws.rs.core.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth.userService.url}")
    private String authServiceUrl;

    @Value("${auth.internalSharedKey}")
    private String internalSharedKey;

    /**
     * Creates a new user in the system.
     * <p>
     * This method performs the following actions:
     * <ul>
     *     <li>Checks if a user with the provided email already exists.</li>
     *     <li>Checks if a user with the provided username already exists.</li>
     *     <li>Encrypts the user's password using BCrypt.</li>
     *     <li>Maps the incoming UserDto to a User entity and saves it in the database.</li>
     *     <li>Returns the saved user data mapped back to a UserDto.</li>
     * </ul>
     *
     * @param authUserDto The user data transfer object containing input details.
     * @return The created user's data transfer object.
     * @throws ResourceAlreadyExists If the email or username already exists in the database.
     */
    @Override
    public Map<String, String> signup(AuthUserDto authUserDto) {

        if (userRepository.findByEmail(authUserDto.getEmail()).isPresent()){
            throw new ResourceAlreadyExists("Email: '" + authUserDto.getEmail() + "' Already Exists");
        }

        if (userRepository.findByUsername(authUserDto.getUsername()).isPresent()){
            throw new ResourceAlreadyExists("Username: '" + authUserDto.getUsername() + "' Already Exists");
        }

        String encodedPassword = passwordEncoder.encode(authUserDto.getPassword());
        AuthUser user = modelMapper.map(authUserDto, AuthUser.class);
        user.setPassword(encodedPassword);

        // Construct the payload
        Map<String, String> userData = new HashMap<>();
        userData.put("username", authUserDto.getUsername());
        userData.put("email", authUserDto.getEmail());
        userData.put("password", encodedPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.valueOf(MediaType.APPLICATION_JSON));
        headers.set("Internal-Secret", internalSharedKey);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(userData, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                authServiceUrl, request, String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("User creation in UserManagement failed");
        }
        AuthUser savedUser = userRepository.save(user);
        return Map.of("token", jwtUtil.generateToken(authUserDto.getUsername()));
    }

    public Map<String, String> login(AuthUserDto authUserDto){
        AuthUser authUser;

        if(authUserDto.getUsername().isEmpty()){
             authUser = userRepository.findByEmail(authUserDto.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Email id: '" + authUserDto.getEmail() + "' doesn't exist"));
        }
        else{
            authUser = userRepository.findByUsername(authUserDto.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Username : '" + authUserDto.getUsername() + "' doesn't exist"));
        }

        if(!passwordEncoder.matches(authUserDto.getPassword(), authUser.getPassword())){
            throw new ResourceNotFoundException("Incorrect Password");
        }

        return Map.of("token", jwtUtil.generateToken(authUserDto.getUsername()));
    }
}