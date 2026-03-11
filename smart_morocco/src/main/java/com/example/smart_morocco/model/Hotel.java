package com.example.smart_morocco.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hotel")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hotel")
    private Integer id;

    private String nom;
    private String adresse;
    private String ville;
    private Integer etoiles;
    private Double prix_nuit;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    @ManyToOne
    @JoinColumn(name = "id_pack")
    private Pack pack;

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public Integer getEtoiles() { return etoiles; }
    public void setEtoiles(Integer etoiles) { this.etoiles = etoiles; }

    public Double getPrix_nuit() { return prix_nuit; }
    public void setPrix_nuit(Double prix_nuit) { this.prix_nuit = prix_nuit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Pack getPack() { return pack; }
    public void setPack(Pack pack) { this.pack = pack; }
}