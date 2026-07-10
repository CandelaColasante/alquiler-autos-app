package com.alquiler.autos.repository;

import com.alquiler.autos.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByProductId(Long productId);
    List<Reservation> findByProductIdAndEndDateGreaterThanEqual(Long productId, LocalDate date);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reservation r " +
            "WHERE r.product.id = :productId " +
            "AND r.startDate < :endDate " +
            "AND r.endDate > :startDate")
    boolean existsOverlappingReservation(@Param("productId") Long productId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("DELETE FROM Reservation r WHERE r.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    @Query("SELECT DISTINCT r.product.id FROM Reservation r WHERE r.startDate <= :endDate AND r.endDate >= :startDate")
    List<Long> findProductIdsWithOverlap(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
