package com.alquiler.autos.controller;

import com.alquiler.autos.dto.ReservationResponseDTO;
import com.alquiler.autos.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/{userId}/reservations")
    public ResponseEntity<List<ReservationResponseDTO>> getUserReservations(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }
}
