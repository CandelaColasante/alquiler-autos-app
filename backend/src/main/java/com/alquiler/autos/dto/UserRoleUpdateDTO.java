package com.alquiler.autos.dto;

public class UserRoleUpdateDTO {
    private Long userId;
    private String role;

    public UserRoleUpdateDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}