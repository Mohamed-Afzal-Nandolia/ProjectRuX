package com.projectrux.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "otp")
public class Otp {

    @Id
    private String id;

    private String userId;

    private String otpCode;

    private LocalDateTime expiryTime;

}
