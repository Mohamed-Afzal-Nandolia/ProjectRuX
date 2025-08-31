package com.projectrux.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "reset_token")
public class PasswordResetToken {

    @Id
    private String id;

    private String userId;

    private String resetToken;

    private LocalDateTime expiryTime;

}
