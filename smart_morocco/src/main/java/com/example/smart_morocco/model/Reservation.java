package com.example.smart_morocco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate date_reservation;
    private LocalDate date_voyage;
    private Integer nombre_personnes;
    private String statut;
    private Double montant_total;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "id_pack")
    private Pack pack;

    @OneToMany(mappedBy = "reservation")
    @JsonIgnore
    private List<Paiement> paiements;

    // Getters & Setters
    public Integer getId_reservation() { return id; }
    public void setId_reservation(Integer id_reservation) { this.id = id_reservation; }

    public LocalDate getDate_reservation() { return date_reservation; }
    public void setDate_reservation(LocalDate date_reservation) { this.date_reservation = date_reservation; }

    public LocalDate getDate_voyage() { return date_voyage; }
    public void setDate_voyage(LocalDate date_voyage) { this.date_voyage = date_voyage; }

    public Integer getNombre_personnes() { return nombre_personnes; }
    public void setNombre_personnes(Integer nombre_personnes) { this.nombre_personnes = nombre_personnes; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Double getMontant_total() { return montant_total; }
    public void setMontant_total(Double montant_total) { this.montant_total = montant_total; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public Pack getPack() { return pack; }
    public void setPack(Pack pack) { this.pack = pack; }

    public List<Paiement> getPaiements() { return paiements; }
    public void setPaiements(List<Paiement> paiements) { this.paiements = paiements; }
}
