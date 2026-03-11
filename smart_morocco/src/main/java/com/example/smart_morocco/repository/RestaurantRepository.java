package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    List<Restaurant> findByVille(String ville);
    List<Restaurant> findByPack_Id(Integer idPack);
}