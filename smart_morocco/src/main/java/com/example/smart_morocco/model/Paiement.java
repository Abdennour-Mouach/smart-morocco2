package com.example.smart_morocco.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_paiement;

    private String mode_paiement;
    private String statut;
    private Double montant;
    private LocalDate date_paiement;
    private String transaction_id;

    @ManyToOne
    @JoinColumn(name = "id_reservation")
    private Reservation reservation;

    // Getters & Setters
    public Integer getId_paiement() { return id_paiement; }
    public void setId_paiement(Integer id_paiement) { this.id_paiement = id_paiement; }

    public String getMode_paiement() { return mode_paiement; }
    public void setMode_paiement(String mode_paiement) { this.mode_paiement = mode_paiement; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public LocalDate getDate_paiement() { return date_paiement; }
    public void setDate_paiement(LocalDate date_paiement) { this.date_paiement = date_paiement; }

    public String getTransaction_id() { return transaction_id; }
    public void setTransaction_id(String transaction_id) { this.transaction_id = transaction_id; }

    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }
}