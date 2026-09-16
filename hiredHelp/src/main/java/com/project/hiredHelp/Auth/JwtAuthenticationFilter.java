package com.project.hiredHelp.Auth;

import com.project.hiredHelp.Auth.DTO.UserPrincipal;
import com.project.hiredHelp.Auth.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static reactor.netty.http.HttpConnectionLiveness.log;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            if (jwtService.isTokenValid(token) &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                Long userId =
                        jwtService.extractUserId(token);

                String role =
                        jwtService.extractRole(token);

                String name =
                        jwtService.extractName(token);

                var authentication = getUsernamePasswordAuthenticationToken(role, userId, name);

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception e) {
            log.error("JWT authentication failed", e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private static @NonNull UsernamePasswordAuthenticationToken getUsernamePasswordAuthenticationToken(String role, Long userId, String name) {
        var authorities = List.of(
                new SimpleGrantedAuthority(
                        "ROLE_" + role
                )
        );

        UserPrincipal principal =
                new UserPrincipal(
                        userId,
                        name,
                        authorities
                );

        var authentication =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        authorities
                );
        return authentication;
    }
}
