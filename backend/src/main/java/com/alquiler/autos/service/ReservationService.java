package com.alquiler.autos.service;

import com.alquiler.autos.dto.ReservationRequestDTO;
import com.alquiler.autos.dto.ReservationResponseDTO;
import com.alquiler.autos.exception.ResourceNotFoundException;
import com.alquiler.autos.model.Product;
import com.alquiler.autos.model.Reservation;
import com.alquiler.autos.model.User;
import com.alquiler.autos.repository.ProductRepository;
import com.alquiler.autos.repository.ReservationRepository;
import com.alquiler.autos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public ReservationResponseDTO createReservation(Long productId, ReservationRequestDTO dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", productId));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", dto.getUserId()));

        if (dto.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("La fecha de inicio no puede ser en el pasado.");
        }
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new RuntimeException("La fecha de fin no puede ser anterior a la de inicio.");
        }

        boolean hasOverlap = reservationRepository.existsOverlappingReservation(
                productId, dto.getStartDate(), dto.getEndDate()
        );
        if (hasOverlap) {
            throw new RuntimeException("El rango de fechas seleccionado incluye fechas no disponibles.");
        }

        Reservation reservation = new Reservation();
        reservation.setProduct(product);
        reservation.setUser(user);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setNotes(dto.getNotes());

        Reservation saved = reservationRepository.save(reservation);
        emailService.sendReservationConfirmation(
                user.getEmail(),
                user.getFullName(),
                convertToDTO(saved)
        );
        return convertToDTO(saved);
    }

    public List<ReservationResponseDTO> getUserReservations(Long userId) {
        return reservationRepository.findAll()
                .stream()
                .filter(r -> r.getUser().getId().equals(userId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReservationResponseDTO convertToDTO(Reservation r) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(r.getId());
        dto.setProductId(r.getProduct().getId());
        dto.setProductName(r.getProduct().getName());
        dto.setUserId(r.getUser().getId());
        dto.setUserName(r.getUser().getFullName());
        dto.setStartDate(r.getStartDate());
        dto.setEndDate(r.getEndDate());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setNotes(r.getNotes());
        return dto;
    }

    public List<Long> getUnavailableProductIds(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findProductIdsWithOverlap(startDate, endDate);
    }
}