package com.alquiler.autos.service;

import com.alquiler.autos.dto.ReviewRequestDTO;
import com.alquiler.autos.dto.ReviewResponseDTO;
import com.alquiler.autos.exception.ResourceNotFoundException;
import com.alquiler.autos.model.Product;
import com.alquiler.autos.model.Review;
import com.alquiler.autos.model.User;
import com.alquiler.autos.repository.ProductRepository;
import com.alquiler.autos.repository.ReservationRepository;
import com.alquiler.autos.repository.ReviewRepository;
import com.alquiler.autos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public ReviewResponseDTO createReview(Long productId, ReviewRequestDTO dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", productId));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", dto.getUserId()));

        boolean hasFinishedReservation = reservationRepository
                .findByProductId(productId)
                .stream()
                .anyMatch(r -> r.getUser().getId().equals(dto.getUserId())
                        && r.getEndDate().isBefore(LocalDate.now()));

        if (!hasFinishedReservation) {
            throw new RuntimeException("Solo puedes reseñar productos que hayas alquilado.");
        }

        reviewRepository.findByProductIdAndUserId(productId, dto.getUserId())
                .ifPresent(r -> { throw new RuntimeException("Ya reseñaste este producto."); });

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("La puntuación debe estar entre 1 y 5.");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return convertToDTO(reviewRepository.save(review));
    }

    public List<ReviewResponseDTO> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long productId) {
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public Long getReviewCount(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    public boolean canUserReview(Long productId, Long userId) {
        boolean hasFinishedReservation = reservationRepository
                .findByProductId(productId)
                .stream()
                .anyMatch(r -> r.getUser().getId().equals(userId)
                        && r.getEndDate().isBefore(LocalDate.now()));

        boolean alreadyReviewed = reviewRepository
                .findByProductIdAndUserId(productId, userId)
                .isPresent();

        return hasFinishedReservation && !alreadyReviewed;
    }

    private ReviewResponseDTO convertToDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setUserName(review.getUser().getFullName());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}