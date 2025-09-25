package com.projectrux.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserProfileDto {

    private String username;

    private String email;

    private List<String> skills;

    private String bio;
}
