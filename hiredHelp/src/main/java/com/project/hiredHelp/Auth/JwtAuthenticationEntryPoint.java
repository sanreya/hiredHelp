package com.project.hiredHelp.Auth;

import com.project.hiredHelp.GlobalExceptionHandler.ErrorResponse;
import com.project.hiredHelp.GlobalExceptionHandler.ErrorType;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {

        ErrorType errorType = ErrorType.UNAUTHORIZED;

        ErrorResponse errorResponse = new ErrorResponse(
                errorType.getStatus().value(),
                errorType.getMessage(),
                LocalDateTime.now()
        );

        response.setStatus(errorType.getStatus().value());
        response.setContentType("application/json");

        response.getWriter().write(
                objectMapper.writeValueAsString(errorResponse)
        );
    }
}