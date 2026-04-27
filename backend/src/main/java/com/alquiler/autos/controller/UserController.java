package com.alquiler.autos.controller;

import com.alquiler.autos.dto.UserLoginDTO;
import com.alquiler.autos.dto.UserRegisterDTO;
import com.alquiler.autos.dto.UserRoleUpdateDTO;
import com.alquiler.autos.model.User;
import com.alquiler.autos.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody UserRegisterDTO registerDTO) {
        User newUser = userService.registerUser(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@Valid @RequestBody UserLoginDTO loginDTO) {
        User user = userService.loginUser(loginDTO.getEmail(), loginDTO.getPassword());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/role")
    public ResponseEntity<User> updateUserRole(@RequestBody UserRoleUpdateDTO roleUpdateDTO) {
        User updatedUser = userService.updateUserRole(roleUpdateDTO.getUserId(), roleUpdateDTO.getRole());
        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }
}