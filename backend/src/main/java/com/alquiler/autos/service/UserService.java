package com.alquiler.autos.service;

import com.alquiler.autos.dto.LoginResponseDTO;
import com.alquiler.autos.dto.UserRegisterDTO;
import com.alquiler.autos.model.User;
import com.alquiler.autos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(UserRegisterDTO registerDTO) {

        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setRole("USER");

        return userRepository.save(user);
    }

    public LoginResponseDTO loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        return new LoginResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!newRole.equals("ADMIN") && !newRole.equals("USER")) {
            throw new RuntimeException("Rol inválido. Debe ser ADMIN o USER");
        }

        user.setRole(newRole);
        return userRepository.save(user);
    }

    public boolean isAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return "ADMIN".equals(user.getRole());
    }
}