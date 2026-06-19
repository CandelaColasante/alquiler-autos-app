package com.alquiler.autos.controller;

import com.alquiler.autos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    @Autowired
    private UserService userService;

    @PostMapping("/{productId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long productId, @RequestParam Long userId) {
        try {
            userService.addFavorite(userId, productId);
            return ResponseEntity.ok(Map.of("message", "Producto agregado a favoritos"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long productId, @RequestParam Long userId) {
        try {
            userService.removeFavorite(userId, productId);
            return ResponseEntity.ok(Map.of("message", "Producto removido de favoritos"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> isFavorite(@PathVariable Long productId, @RequestParam Long userId) {
        try {
            boolean isFavorite = userService.isFavorite(userId, productId);
            return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserFavorites(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(userService.getUserFavorites(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}