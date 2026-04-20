package com.example.smart_morocco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nom;
    private String prenom;       // Ajouté
    private String telephone;    // Ajouté

    @Column(unique = true)
    private String email;

    private String mot_de_passe;

    private String role;

    /*@OneToMany(mappedBy = "utilisateur")
    @JsonIgnore
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "utilisateur")
    @JsonIgnore
    private List<Review> reviews;*/

    // Getters & Setters
    public Integer getId_utilisateur() { return id; }
    public void setId_utilisateur(Integer id) { this.id= id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }  
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }


    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMot_de_passe() { return mot_de_passe; }
    public void setMot_de_passe(String mot_de_passe) { this.mot_de_passe = mot_de_passe; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    /*public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }*/
}
