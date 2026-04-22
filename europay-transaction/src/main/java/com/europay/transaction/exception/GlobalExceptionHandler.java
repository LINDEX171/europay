package com.europay.transaction.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = ex.getMessage().equals("Access denied")
                ? HttpStatus.FORBIDDEN
                : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(Map.of("error", ex.getMessage()));
    }
}
