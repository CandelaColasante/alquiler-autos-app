package com.alquiler.autos.exception;

public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resourceName, String value) {
        super(String.format("Ya existe un %s con el nombre: %s", resourceName, value));
    }
}