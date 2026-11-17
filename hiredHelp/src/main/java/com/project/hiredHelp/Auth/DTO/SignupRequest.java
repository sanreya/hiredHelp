package com.project.hiredHelp.Auth.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String phone;

    private String address;

    private String userRole;
}
