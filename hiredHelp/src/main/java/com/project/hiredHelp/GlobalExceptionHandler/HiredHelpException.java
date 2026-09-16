package com.project.hiredHelp.GlobalExceptionHandler;

import lombok.Getter;

@Getter
public class HiredHelpException extends RuntimeException {

    private final ErrorType errorType;

    public HiredHelpException(ErrorType errorType) {
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}