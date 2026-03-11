package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    List<Hotel> findByVille(String ville);
    List<Hotel> findByPack_Id(Integer idPack);
}