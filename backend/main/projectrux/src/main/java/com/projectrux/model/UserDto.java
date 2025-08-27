package com.projectrux.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
//@NoArgsConstructor
//@AllArgsConstructor
public class UserDto {

    private String id;

    private String username;

    private String email;

    private String password;

    private List<String> skills;

    private String bio;

    private LocalDateTime createdAt;

}