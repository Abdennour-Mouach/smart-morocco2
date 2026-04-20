package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Reservation;
import com.example.smart_morocco.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping({"/reservations", "/api/reservations"})
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Reservation> getByUtilisateur(@PathVariable Integer idUtilisateur) {
        return reservationService.getReservationsByUtilisateur(idUtilisateur);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(@PathVariable Long id) {
        return reservationService.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationService.CreateReservationRequest request) {
        try {
            Reservation saved = reservationService.createReservation(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
