package ProjectRuX.UserManagement.service.impl;

import ProjectRuX.UserManagement.entity.User;
import ProjectRuX.UserManagement.enums.Skill;
import ProjectRuX.UserManagement.exception.ResourceAlreadyExists;
import ProjectRuX.UserManagement.exception.ResourceNotFoundException;
import ProjectRuX.UserManagement.model.UserDto;
import ProjectRuX.UserManagement.repository.UserRepository;
//import ProjectRuX.UserManagement.security.JwtUtil;
import ProjectRuX.UserManagement.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

//    @Autowired
//    private JwtUtil jwtUtil;

    /**
     * Registers a new user by saving their details into the database.
     * <p>
     * This method performs the following steps:
     * <ul>
     *     <li>Maps the incoming {@link UserDto} to a {@link User} entity.</li>
     *     <li>Copies the email, username, and password from the DTO to the entity.</li>
     *     <li>Saves the user entity to the database.</li>
     *     <li>Maps and returns the saved entity back as a {@link UserDto}.</li>
     * </ul>
     *
     * <strong>Note:</strong> This method currently stores the password as plain text.
     * It is recommended to encode the password using a password encoder before saving.
     *
     * @param userDto A {@link UserDto} object containing the user's registration information.
     * @return A {@link UserDto} object containing the saved user's information.
     */
    public UserDto signupTest(UserDto userDto){
        User user = modelMapper.map(userDto, User.class);
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setUsername(userDto.getUsername());

        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    /**
     * Retrieves a {@link User} entity by its unique identifier.
     *
     * <p>If a user with the given ID is not found in the database, this method throws
     * a {@link ResourceNotFoundException} indicating that the user does not exist.</p>
     *
     * @param id The unique identifier of the user to retrieve.
     * @return The {@link User} entity associated with the given ID.
     * @throws ResourceNotFoundException If no user is found with the provided ID.
     */
    private User findUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User does not exist with id: " + id));
    }

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
     * @param userDto The user data transfer object containing input details.
     * @return The created user's data transfer object.
     * @throws ResourceAlreadyExists If the email or username already exists in the database.
     */
    @Override
    public UserDto signup(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()){
            throw new ResourceAlreadyExists("Email: '" + userDto.getEmail() + "' Already Exists");
        }

        if (userRepository.findByUsername(userDto.getUsername()).isPresent()){
            throw new ResourceAlreadyExists("Username: '" + userDto.getUsername() + "' Already Exists");
        }

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        User user = modelMapper.map(userDto, User.class);
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserDto.class);
    }

    /**
     * Authenticates a user based on their email and password.
     * <p>
     * This method performs the following steps:
     * <ul>
     *     <li>Retrieves the user by email from the database.</li>
     *     <li>Verifies the provided password against the stored (hashed) password.</li>
     *     <li>Generates and returns a JWT token if authentication is successful.</li>
     * </ul>
     *
     * @param userDto A {@link UserDto} object containing the user's email and plain-text password.
     * @return A JWT token string representing the authenticated session.
     *
     * @throws ResourceNotFoundException if:
     * <ul>
     *     <li>No user is found with the given email.</li>
     *     <li>The provided password does not match the stored password.</li>
     * </ul>
     */
//    public String login(UserDto userDto){
//        User user = userRepository.findByEmail(userDto.getEmail())
//                .orElseThrow(() -> new ResourceNotFoundException("Email id: " + userDto.getEmail() + " doesn't exist"));
//
//        if(!passwordEncoder.matches(userDto.getPassword(), user.getPassword())){
//            throw new ResourceNotFoundException("Incorrect Password");
//        }
//
//        return jwtUtil.generateToken(userDto.getUsername());
//    }

    /**
     * Updates an existing user's information.
     * <p>
     * This method performs the following actions:
     * <ul>
     *     <li>Finds the user by ID. If not found, throws a {@link ResourceNotFoundException}.</li>
     *     <li>Updates the user's email with the new value provided.</li>
     *     <li>Encrypts the new password using BCrypt and updates the user entity.</li>
     *     <li>Saves the updated user entity to the database.</li>
     *     <li>Returns the updated user data as a {@link UserDto}.</li>
     * </ul>
     *
     * @param userDto The data transfer object containing the updated user information.
     * @return The updated user's data transfer object.
     * @throws ResourceNotFoundException if a user with the given ID does not exist.
     */
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

    /**
     * Deletes a user from the system based on the provided ID.
     *
     * <p>This method first attempts to retrieve the user using the provided ID.
     * If the user exists, it deletes the user record from the database and
     * returns a success message. If not found, a {@link ResourceNotFoundException} is thrown.</p>
     *
     * @param id The unique identifier of the user to delete.
     * @return A confirmation message indicating successful deletion.
     * @throws ResourceNotFoundException If no user is found with the given ID.
     */
    @Override
    public String deleteUser(String id) {
        User user = findUser(id);
        userRepository.deleteById(id);

        return "User Deleted Successfully with id: " + user.getId();
    }

    /**
     * Retrieves user details based on the provided ID.
     *
     * <p>This method fetches a user entity from the database and maps it
     * to a {@link UserDto} object to return user information in a DTO format.</p>
     *
     * @param id The unique identifier of the user to retrieve.
     * @return A {@link UserDto} containing the user's information.
     * @throws ResourceNotFoundException If no user is found with the given ID.
     */
    @Override
    public UserDto getUserById(String id) {
        User user = findUser(id);
        return modelMapper.map(user, UserDto.class);
    }

    /**
     * Adds a list of skills to a user's profile based on their unique ID.
     * <p>
     * This method performs the following:
     * <ul>
     *     <li>Validates each skill by checking against predefined {@link Skill} enum values.</li>
     *     <li>Converts skill names to uppercase before validation to ensure case-insensitive matching.</li>
     *     <li>Adds only valid and non-duplicate skills to the user's existing skill list.</li>
     *     <li>Collects and returns any invalid skill entries without modifying the user's data if invalid entries are found.</li>
     * </ul>
     *
     * @param id     The unique identifier of the user.
     * @param skills A list of skill names (case-insensitive) to be added to the user's profile.
     * @return A map containing either:
     *         <ul>
     *             <li>{@code "Updated Skills"} with the updated list of user's skills if all inputs are valid, or</li>
     *             <li>{@code "Invalid Skills"} with a list of invalid skill entries if any are found.</li>
     *         </ul>
     *
     * @throws ResourceNotFoundException if a user with the provided ID does not exist.
     */
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

    /**
     * Retrieves the list of skills for a specific user by their ID.
     *
     * @param id The unique identifier of the user.
     * @return A list of skills the user currently possesses.
     * @throws ResourceNotFoundException if the user with the given ID does not exist.
     */
    @Override
    public List<String> getUserSkills(String id) {
        User user = findUser(id);
        UserDto userDto = modelMapper.map(user, UserDto.class);

        return userDto.getSkills();
    }

    /**
     * Retrieves a list of all predefined skills available in the {@link Skill} enum.
     * <p>
     * This method converts each enum constant to its string representation (e.g., "JAVA", "REACT")
     * and returns them as a list.
     *
     * @return A list of all skill names defined in the {@link Skill} enum.
     */
    @Override
    public List<String> getAllSkills() {
        return Arrays.stream(Skill.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    /**
     * Fetches all users from the system.
     *
     * @return A list of {@link UserDto} objects representing all users.
     */
    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map((user) -> modelMapper.map(user, UserDto.class)).collect(Collectors.toList());
    }
}
