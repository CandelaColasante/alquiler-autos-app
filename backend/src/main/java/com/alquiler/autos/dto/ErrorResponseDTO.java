package com.alquiler.autos.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponseDTO {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> validationErrors;
    private String path;

    public ErrorResponseDTO(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.path = path;
    }

    public ErrorResponseDTO(int status, String error, Map<String, String> validationErrors, String path) {
        this.status = status;
        this.error = error;
        this.validationErrors = validationErrors;
        this.timestamp = LocalDateTime.now();
        this.path = path;
    }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Map<String, String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
}