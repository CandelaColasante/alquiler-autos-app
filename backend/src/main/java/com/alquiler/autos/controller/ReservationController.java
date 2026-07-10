package com.alquiler.autos.controller;

import com.alquiler.autos.dto.ReservationRequestDTO;
import com.alquiler.autos.dto.ReservationResponseDTO;
import com.alquiler.autos.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> createReservation(
            @PathVariable Long productId,
            @RequestBody ReservationRequestDTO dto) {
        try {
            ReservationResponseDTO reservation = reservationService.createReservation(productId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}