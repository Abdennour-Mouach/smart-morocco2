package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Utilisateur;
import com.example.smart_morocco.repository.UtilisateurRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ----------------- Méthodes CRUD -----------------
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Integer id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
        if (utilisateur.getRole() == null || utilisateur.getRole().isBlank()) {
            utilisateur.setRole("ROLE_USER");
        }

        String password = utilisateur.getMot_de_passe();
        if (password != null && !password.isBlank() && !isBcryptHash(password)) {
            utilisateur.setMot_de_passe(passwordEncoder.encode(password));
        }

        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Integer id) {
        utilisateurRepository.deleteById(id);
    }

    public Optional<Utilisateur> getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    public boolean updatePassword(Integer id, String currentPassword, String newPassword) {
        return utilisateurRepository.findById(id).map(user -> {
            if (currentPassword == null || currentPassword.isBlank()) return false;
            if (newPassword == null || newPassword.isBlank()) return false;
            if (!passwordEncoder.matches(currentPassword, user.getMot_de_passe())) {
                return false;
            }
            user.setMot_de_passe(passwordEncoder.encode(newPassword));
            utilisateurRepository.save(user);
            return true;
        }).orElse(false);
    }

    // ----------------- Méthode pour Spring Security -----------------
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));

        // Ici, on mappe le rôle de l'utilisateur en GrantedAuthority
        GrantedAuthority authority = new SimpleGrantedAuthority(utilisateur.getRole());

        // User est une classe de Spring Security
        return new User(utilisateur.getEmail(), utilisateur.getMot_de_passe(), Collections.singletonList(authority));
    }
    private boolean isBcryptHash(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }
}
