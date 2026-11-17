package com.project.hiredHelp.GlobalExceptionHandler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HiredHelpException.class)
    public ResponseEntity<ErrorResponse> handleHiredHelpException(
            HiredHelpException ex
    ) {

        ErrorType errorType = ex.getErrorType();

        ErrorResponse response = new ErrorResponse(
                errorType.getStatus().value(),
                errorType.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(errorType.getStatus())
                .body(response);
    }
}