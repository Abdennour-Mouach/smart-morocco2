package com.example.smart_morocco.model;

import jakarta.persistence.*;

@Entity
public class Restauration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomRestauration;
    private String typeCuisine;
    private String repasInclus;
    private String lieu;
    private double prix;
    private String description;
    private String imageurl;

    public Restauration() {}

    public Restauration(Long id, String nomRestauration, String typeCuisine, String repasInclus, String lieu, double prix,
            String description, String imageurl) {
        this.id = id;
        this.nomRestauration = nomRestauration;
        this.typeCuisine = typeCuisine;
        this.repasInclus = repasInclus;
        this.lieu = lieu;
        this.prix = prix;
        this.description = description;
        this.imageurl = imageurl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomRestauration() {
        return nomRestauration;
    }

    public void setNomRestauration(String nomRestauration) {
        this.nomRestauration = nomRestauration;
    }

    public String getTypeCuisine() {
        return typeCuisine;
    }

    public void setTypeCuisine(String typeCuisine) {
        this.typeCuisine = typeCuisine;
    }

    public String getRepasInclus() {
        return repasInclus;
    }

    public void setRepasInclus(String repasInclus) {
        this.repasInclus = repasInclus;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageurl() {
        return imageurl;
    }

    public void setImageurl(String imageurl) {
        this.imageurl = imageurl;
    }
}
