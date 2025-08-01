package ProjectRuX.UserManagement.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "user")
public class User {

    @Id
    private String id;

    private String username;

    private String email;

    private String password;

    private List<String> skills;

    private String bio;

    private LocalDateTime createdAt;

}
