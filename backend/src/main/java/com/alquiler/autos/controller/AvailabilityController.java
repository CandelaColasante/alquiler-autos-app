package com.alquiler.autos.controller;

import com.alquiler.autos.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:5173")
public class AvailabilityController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/unavailable")
    public ResponseEntity<List<Long>> getUnavailableProducts(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(reservationService.getUnavailableProductIds(start, end));
    }
}