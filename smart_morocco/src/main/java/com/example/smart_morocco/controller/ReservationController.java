package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Reservation;
import com.example.smart_morocco.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Integer id) {
        return reservationService.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Reservation> getReservationsByUtilisateur(@PathVariable Integer idUtilisateur) {
        return reservationService.getReservationsByUtilisateurId(idUtilisateur);
    }

    @GetMapping("/pack/{idPack}")
    public List<Reservation> getReservationsByPack(@PathVariable Integer idPack) {
        return reservationService.getReservationsByPackId(idPack);
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.saveReservation(reservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Integer id, @RequestBody Reservation reservation) {
        return reservationService.getReservationById(id)
                .map(existing -> {
                    reservation.setId_reservation(id);
                    return ResponseEntity.ok(reservationService.saveReservation(reservation));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Integer id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}