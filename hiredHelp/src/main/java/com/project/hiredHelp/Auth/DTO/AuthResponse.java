package com.project.hiredHelp.Auth.DTO;

import com.project.hiredHelp.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private Long userId;

    private UserRole role;
}