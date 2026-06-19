package com.alquiler.autos.controller;

import com.alquiler.autos.dto.ReviewRequestDTO;
import com.alquiler.autos.dto.ReviewResponseDTO;
import com.alquiler.autos.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@PathVariable Long productId) {
        return ResponseEntity.ok(Map.of(
                "average", reviewService.getAverageRating(productId),
                "count", reviewService.getReviewCount(productId)
        ));
    }

    @GetMapping("/can-review")
    public ResponseEntity<?> canReview(@PathVariable Long productId, @RequestParam Long userId) {
        return ResponseEntity.ok(Map.of(
                "canReview", reviewService.canUserReview(productId, userId)
        ));
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequestDTO dto) {
        try {
            ReviewResponseDTO review = reviewService.createReview(productId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}