package com.example.smart_morocco.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pack")
public class Pack {

        @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // plus simple

    private String nom_pack;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double prix;

    private Double promotion;

    @OneToMany(mappedBy = "pack")
    private List<Hotel> hotels;

    @OneToMany(mappedBy = "pack")
    private List<Restaurant> restaurants;

    @OneToMany(mappedBy = "pack")
    private List<Evenement> evenements;

    @OneToMany(mappedBy = "pack")
    private List<Reservation> reservations;

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNom_pack() { return nom_pack; }
    public void setNom_pack(String nom_pack) { this.nom_pack = nom_pack; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    public Double getPromotion() { return promotion; }
    public void setPromotion(Double promotion) { this.promotion = promotion; }

    public List<Hotel> getHotels() { return hotels; }
    public void setHotels(List<Hotel> hotels) { this.hotels = hotels; }

    public List<Restaurant> getRestaurants() { return restaurants; }
    public void setRestaurants(List<Restaurant> restaurants) { this.restaurants = restaurants; }

    public List<Evenement> getEvenements() { return evenements; }
    public void setEvenements(List<Evenement> evenements) { this.evenements = evenements; }

    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
}