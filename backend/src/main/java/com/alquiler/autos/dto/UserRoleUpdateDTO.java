package com.alquiler.autos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class UserRoleUpdateDTO {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;

    @NotNull(message = "El rol es obligatorio")
    @Pattern(regexp = "^(ADMIN|USER)$", message = "El rol debe ser ADMIN o USER")
    private String role;

    public UserRoleUpdateDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}