package com.alquiler.autos.exception;

public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resourceName, String value) {
        super(String.format("Ya existe %s %s con el nombre: %s",
                resourceName.equalsIgnoreCase("Categoría") ? "una" : "un",
                resourceName,
                value));
    }
}