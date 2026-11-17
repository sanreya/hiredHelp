package com.project.hiredHelp.Auth.GoogleAuth;
import com.project.hiredHelp.Auth.Service.JwtService;
import com.project.hiredHelp.Entity.User;
import com.project.hiredHelp.Enum.UserRole;
import com.project.hiredHelp.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            @NonNull HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        assert oauthUser != null;
        String email =
                oauthUser.getAttribute("email");

        String firstName =
                oauthUser.getAttribute("given_name");

        String lastName =
                oauthUser.getAttribute("family_name");

        String picture =
                oauthUser.getAttribute("picture");

        User user =
                userRepository.findByEmail(email)
                        .orElseGet(() -> {

                            User newUser = User.builder()
                                    .firstName(firstName)
                                    .lastName(lastName)
                                    .email(email)
                                    .role(UserRole.USER)
                                    .active(true)
                                    .build();

                            return userRepository.save(newUser);
                        });

        String token =
                jwtService.generateToken(user);

        response.sendRedirect(
                "http://localhost:3000/oauth-success?token="
                        + token
        );
    }
}
