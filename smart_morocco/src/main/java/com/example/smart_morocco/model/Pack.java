package com.example.smart_morocco.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class Pack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomPack;
    private String destination;
    private int duree;
    private double prixTotal;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String planning;

    @Column(name = "image_url", length = 1000)
    @JsonProperty("imageUrl")
    @JsonAlias({"image_url", "imageURL"})
    private String imageUrl;
    
    private Long id_hebergement;
    private Long id_restaurant;
    private Long id_activite;

    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomPack() { return nomPack; }
    public void setNomPack(String nomPack) { this.nomPack = nomPack; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public int getDuree() { return duree; }
    public void setDuree(int duree) { this.duree = duree; }

    public double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(double prixTotal) { this.prixTotal = prixTotal; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPlanning() { return planning; }
    public void setPlanning(String planning) { this.planning = planning; }

    public Long getId_hebergement() { return id_hebergement; }
    public void setId_hebergement(Long id_hebergement) { this.id_hebergement = id_hebergement; }

    public Long getId_restaurant() { return id_restaurant; }
    public void setId_restaurant(Long id_restaurant) { this.id_restaurant = id_restaurant; }
    
    public Long getId_activite() { return id_activite; }
    public void setId_activite(Long id_activite) { this.id_activite = id_activite; }
    
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    
}
