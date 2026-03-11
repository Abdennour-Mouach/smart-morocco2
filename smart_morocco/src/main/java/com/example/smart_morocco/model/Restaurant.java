package com.example.smart_morocco.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurant")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nom;
    private String adresse;
    private String ville;
    private String type_cuisine;
    private Double note;

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

    public String getType_cuisine() { return type_cuisine; }
    public void setType_cuisine(String type_cuisine) { this.type_cuisine = type_cuisine; }

    public Double getNote() { return note; }
    public void setNote(Double note) { this.note = note; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Pack getPack() { return pack; }
    public void setPack(Pack pack) { this.pack = pack; }
}