package com.example.smart_morocco.model;

import jakarta.persistence.*;

@Entity
@Table(name = "activite")
public class Activite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_activity") 
    private String nomActivity;

    private String description;
    private String lieu;
    private String duree;
    private double prix;
    private String imageUrl;

    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomActivity() { return nomActivity; }
    public void setNomActivity(String nomActivity) { this.nomActivity = nomActivity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }

    public String getDuree() { return duree; }
    public void setDuree(String duree) { this.duree = duree; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
