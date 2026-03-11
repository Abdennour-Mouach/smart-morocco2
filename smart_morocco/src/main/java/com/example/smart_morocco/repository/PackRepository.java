package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Pack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackRepository extends JpaRepository<Pack, Integer> {
}