package com.example.smart_morocco.repository;

import com.example.smart_morocco.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByEmail(String email);
    // Méthode personnalisée pour trouver les utilisateurs par rôle
    List<Utilisateur> findByRole(String role);
}