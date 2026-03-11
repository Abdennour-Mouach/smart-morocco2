package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUtilisateur_Id(Integer idUtilisateur); // note le _Id
    List<Reservation> findByPack_Id(Integer idPack);
}