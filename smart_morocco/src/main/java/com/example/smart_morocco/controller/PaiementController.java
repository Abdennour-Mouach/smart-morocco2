package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Paiement;
import com.example.smart_morocco.service.PaiementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @GetMapping
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable Integer id) {
        return paiementService.getPaiementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reservation/{idReservation}")
    public List<Paiement> getPaiementsByReservation(@PathVariable Integer idReservation) {
        return paiementService.getPaiementsByReservationId(idReservation);
    }

    @PostMapping
    public Paiement createPaiement(@RequestBody Paiement paiement) {
        return paiementService.savePaiement(paiement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paiement> updatePaiement(@PathVariable Integer id, @RequestBody Paiement paiement) {
        return paiementService.getPaiementById(id)
                .map(existing -> {
                    paiement.setId_paiement(id);
                    return ResponseEntity.ok(paiementService.savePaiement(paiement));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaiement(@PathVariable Integer id) {
        paiementService.deletePaiement(id);
        return ResponseEntity.noContent().build();
    }
}