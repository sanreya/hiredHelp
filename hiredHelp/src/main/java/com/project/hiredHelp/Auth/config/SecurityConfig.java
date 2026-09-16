package com.project.hiredHelp.Auth.config;

import com.project.hiredHelp.Auth.GoogleAuth.OAuth2SuccessHandler;
import com.project.hiredHelp.Auth.JwtAuthenticationEntryPoint;
import com.project.hiredHelp.Auth.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtFilter, OAuth2SuccessHandler oAuth2SuccessHandler
    ) {
        this.jwtFilter = jwtFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint authenticationEntryPoint
    ) throws Exception {

        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/partner/**")
                        .hasRole("PARTNER")

                        .requestMatchers("/api/user/**")
                        .hasRole("USER")

                        .anyRequest()
                        .authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2SuccessHandler)
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
