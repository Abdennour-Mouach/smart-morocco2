package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Utilisateur;
import com.example.smart_morocco.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;                          // pour Optional
import java.util.Map;                               // pour Map
import java.util.HashMap;                           // pour HashMap
import org.springframework.http.HttpStatus;         // pour HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder; // pour passwordEncoder

import java.util.List;


@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final PasswordEncoder passwordEncoder;

      public UtilisateurController(UtilisateurService utilisateurService, PasswordEncoder passwordEncoder) {
        this.utilisateurService = utilisateurService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Integer id) {
        return utilisateurService.getUtilisateurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        if (utilisateur.getEmail() == null || utilisateur.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email obligatoire");
        }

        if (utilisateurService.getUtilisateurByEmail(utilisateur.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email deja utilise");
        }

        Utilisateur saved = utilisateurService.saveUtilisateur(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable Integer id, @RequestBody Utilisateur utilisateur) {
        return utilisateurService.getUtilisateurById(id)
                .map(existing -> {
                    if (utilisateur.getMot_de_passe() == null || utilisateur.getMot_de_passe().isBlank()) {
                        utilisateur.setMot_de_passe(existing.getMot_de_passe());
                    }
                    if (utilisateur.getRole() == null || utilisateur.getRole().isBlank()) {
                        utilisateur.setRole(existing.getRole());
                    }
                    if (utilisateur.getEmail() == null || utilisateur.getEmail().isBlank()) {
                        utilisateur.setEmail(existing.getEmail());
                    }
                    utilisateur.setId_utilisateur(id);
                    return ResponseEntity.ok(utilisateurService.saveUtilisateur(utilisateur));
                }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Nouveau mot de passe obligatoire");
        }
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Mot de passe trop court");
        }

        boolean updated = utilisateurService.updatePassword(id, currentPassword, newPassword);
        if (!updated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe actuel incorrect");
        }
        return ResponseEntity.ok("Mot de passe mis à jour");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Integer id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        return utilisateurService.getUtilisateurByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Utilisateur request) {
    Optional<Utilisateur> userOpt = utilisateurService.getUtilisateurByEmail(request.getEmail());

    if (userOpt.isPresent()) {
        Utilisateur user = userOpt.get();

        if (passwordEncoder.matches(request.getMot_de_passe(), user.getMot_de_passe())) {
            Map<String, Object> response = new HashMap<>();
            response.put("id_utilisateur", user.getId_utilisateur());
            response.put("email", user.getEmail());
            response.put("nom", user.getNom());
            response.put("role", user.getRole());

            // Différencier admin et client
            if ("ROLE_ADMIN".equals(user.getRole())) {
                response.put("redirect", "/admindashboard");
            } else {
                response.put("redirect", "/reservations"); // page client
            }

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Mot de passe incorrect");
        }
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Utilisateur non trouvé");
    }
}
}
