package com.project.hiredHelp.GlobalExceptionHandler;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorType {

    INVALID_CREDENTIALS(
            "Invalid email or password",
            HttpStatus.UNAUTHORIZED
    ),

    ACCOUNT_INACTIVE(
            "Your account is inactive",
            HttpStatus.FORBIDDEN
    ),

    EMAIL_ALREADY_EXISTS(
            "Email already registered",
            HttpStatus.CONFLICT
    ),

    USER_NOT_FOUND(
            "User not found",
            HttpStatus.NOT_FOUND
    ),

    UNAUTHORIZED(
            "You are not authorized to perform this action",
            HttpStatus.UNAUTHORIZED
    ),

    FORBIDDEN(
            "You do not have permission to access this resource",
            HttpStatus.FORBIDDEN
    ),

    RESOURCE_NOT_FOUND(
            "Resource not found",
            HttpStatus.NOT_FOUND
    ),

    PHONE_ALREADY_EXISTS(
            "Phone number already exists",
            HttpStatus.CONFLICT
    ),

    SERVICE_REQUEST_NOT_FOUND(
            "Requested service was not found",
            HttpStatus.NOT_FOUND
    ),

    ASSIGNMENT_NOT_FOUND(
            "Assignment not found",
            HttpStatus.NOT_FOUND
    ),

    INVALID_STATUS(
            "Invalid status",
            HttpStatus.BAD_REQUEST
    ),

    INVALID_PRICE(
            "Please enter valid price",
            HttpStatus.BAD_REQUEST
    ),

    REVIEW_ALREADY_EXISTS(
            "Review already exists",
            HttpStatus.BAD_REQUEST
    ),

    INVALID_RATING(
            "Invalid Rating",
            HttpStatus.BAD_REQUEST
    );

    private final String message;
    private final HttpStatus status;

    ErrorType(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

}