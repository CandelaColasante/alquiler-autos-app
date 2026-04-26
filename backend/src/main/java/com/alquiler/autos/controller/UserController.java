package com.alquiler.autos.controller;

import com.alquiler.autos.dto.UserLoginDTO;
import com.alquiler.autos.dto.UserRegisterDTO;
import com.alquiler.autos.dto.UserRoleUpdateDTO;
import com.alquiler.autos.model.User;
import com.alquiler.autos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @CrossOrigin(origins = "https://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO registerDTO) {

        Map<String, String> errors = new HashMap<>();

        if (registerDTO.getFirstName() == null || registerDTO.getFirstName().trim().isEmpty()) {
            errors.put("firstName", "El nombre es obligatorio");
        } else if (registerDTO.getFirstName().length() < 2) {
            errors.put("firstName", "El nombre debe tener al menos 2 caracteres");
        }

        if (registerDTO.getLastName() == null || registerDTO.getLastName().trim().isEmpty()) {
            errors.put("lastName", "El apellido es obligatorio");
        } else if (registerDTO.getLastName().length() < 2) {
            errors.put("lastName", "El apellido debe tener al menos 2 caracteres");
        }

        if (registerDTO.getEmail() == null || registerDTO.getEmail().trim().isEmpty()) {
            errors.put("email", "El email es obligatorio");
        } else if (!registerDTO.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            errors.put("email", "Ingrese un email válido");
        }

        if (registerDTO.getPassword() == null || registerDTO.getPassword().isEmpty()) {
            errors.put("password", "La contraseña es obligatoria");
        } else if (registerDTO.getPassword().length() < 6) {
            errors.put("password", "La contraseña debe tener al menos 6 caracteres");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            User newUser = userService.registerUser(registerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO loginDTO) {

        Map<String, String> errors = new HashMap<>();

        if (loginDTO.getEmail() == null || loginDTO.getEmail().trim().isEmpty()) {
            errors.put("email", "El email es obligatorio");
        }

        if (loginDTO.getPassword() == null || loginDTO.getPassword().isEmpty()) {
            errors.put("password", "La contraseña es obligatoria");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            User user = userService.loginUser(loginDTO.getEmail(), loginDTO.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            users.forEach(user -> user.setPassword(null));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/role")
    public ResponseEntity<?> updateUserRole(@RequestBody UserRoleUpdateDTO roleUpdateDTO) {
        try {
            User updatedUser = userService.updateUserRole(roleUpdateDTO.getUserId(), roleUpdateDTO.getRole());
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}