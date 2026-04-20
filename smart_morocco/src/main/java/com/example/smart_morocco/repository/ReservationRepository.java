package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByIdUtilisateurOrderByDateReservationDesc(Integer idUtilisateur);
}
