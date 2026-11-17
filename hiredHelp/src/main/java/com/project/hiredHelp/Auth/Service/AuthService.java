package com.project.hiredHelp.Auth.Service;

import com.project.hiredHelp.Auth.DTO.AuthResponse;
import com.project.hiredHelp.Auth.DTO.SigninRequest;
import com.project.hiredHelp.Auth.DTO.SignupRequest;
import com.project.hiredHelp.Entity.User;
import com.project.hiredHelp.Enum.UserRole;

import com.project.hiredHelp.GlobalExceptionHandler.ErrorType;
import com.project.hiredHelp.GlobalExceptionHandler.HiredHelpException;
import com.project.hiredHelp.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(SignupRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new HiredHelpException(ErrorType.EMAIL_ALREADY_EXISTS);
        }

        // Create user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .password(
                        passwordEncoder.encode(request.getPassword())
                )
                .role(UserRole.valueOf(request.getUserRole() != null ? request.getUserRole() : "USER"))
                .active(true)
                .build();

        // Save user
        User savedUser = userRepository.save(user);

        // Generate JWT
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getUserId(),
                savedUser.getRole()
        );
    }


    public AuthResponse signin(SigninRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new HiredHelpException(
                                ErrorType.INVALID_CREDENTIALS
                        )
                );

        if (!user.getActive()) {
            throw new HiredHelpException(
                    ErrorType.ACCOUNT_INACTIVE
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new HiredHelpException(
                    ErrorType.INVALID_CREDENTIALS
            );
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getRole()
        );
    }
}