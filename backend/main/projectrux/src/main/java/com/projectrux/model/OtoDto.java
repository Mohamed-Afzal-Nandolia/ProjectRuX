package com.projectrux.model;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class OtoDto {

    private String id;

    private String userId;

    private String otpCode;

    private LocalDateTime expiryTime;

}
