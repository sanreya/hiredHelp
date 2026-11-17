package com.project.hiredHelp.Auth.Controller;

import com.project.hiredHelp.Auth.DTO.AuthResponse;
import com.project.hiredHelp.Auth.DTO.SigninRequest;
import com.project.hiredHelp.Auth.DTO.SignupRequest;

import com.project.hiredHelp.Auth.Service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody SigninRequest request) {
        AuthResponse response = authService.signin(request);
        return ResponseEntity.ok(response);
    }
}