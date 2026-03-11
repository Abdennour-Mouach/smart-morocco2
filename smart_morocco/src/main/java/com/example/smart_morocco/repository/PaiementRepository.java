package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Integer> {
    // avant : findByReservationId_reservation
    List<Paiement> findByReservation_Id(Integer id); // corrige ici
}