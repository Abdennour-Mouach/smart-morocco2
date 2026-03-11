package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Evenement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, Integer> {

    List<Evenement> findByLieu(String lieu);

    List<Evenement> findByDate(LocalDate date);

    // Correct pour le champ id de Pack
    List<Evenement> findByPack_Id(Integer idPack);

}