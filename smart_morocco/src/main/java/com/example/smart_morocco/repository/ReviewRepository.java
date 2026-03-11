package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByUtilisateur_Id(Integer idUtilisateur);

    // Ici on utilise le nom de la propriété dans l'entité Hotel : "id_hotel"
  List<Review> findByHotel_Id(Integer idHotel);
List<Review> findByRestaurant_Id(Integer idRestaurant);
List<Review> findByEvenement_Id(Integer idEvenement);
}