package com.example.smart_morocco.model;
import jakarta.persistence.*;

@Entity
public class Hebergement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; //riad,hotel,appremtement
    private String nomHibergement;
    private String adresse;
    private String lieu;
    private int etoiles;
    private int capacite;
    private double prixParNuit;
    private String description;
    private String imageUrl;

    public Hebergement() {}

    public Hebergement(Long id, String type, String nomHibergement, String adresse, String lieu, int etoiles, int capacite,
            double prixParNuit, String description, String imageUrl) {
        this.id = id;
        this.type = type;
        this.nomHibergement = nomHibergement;
        this.adresse = adresse;
        this.lieu = lieu;
        this.etoiles = etoiles;
        this.capacite = capacite;
        this.prixParNuit = prixParNuit;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getNomHibergement() {
        return nomHibergement;
    }

    public void setNomHibergement(String nomHibergement) {
        this.nomHibergement = nomHibergement;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public int getEtoiles() {
        return etoiles;
    }

    public void setEtoiles(int etoiles) {
        this.etoiles = etoiles;
    }

    public int getCapacite() {
        return capacite;
    }

    public void setCapacite(int capacite) {
        this.capacite = capacite;
    }

    public double getPrixParNuit() {
        return prixParNuit;
    }

    public void setPrixParNuit(double prixParNuit) {
        this.prixParNuit = prixParNuit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
