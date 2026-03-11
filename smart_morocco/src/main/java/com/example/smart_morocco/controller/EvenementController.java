package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Evenement;
import com.example.smart_morocco.service.EvenementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/evenements")
public class EvenementController {

    private final EvenementService evenementService;

    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    @GetMapping
    public List<Evenement> getAllEvenements() {
        return evenementService.getAllEvenements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evenement> getEvenementById(@PathVariable Integer id) {
        return evenementService.getEvenementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lieu/{lieu}")
    public List<Evenement> getEvenementsByLieu(@PathVariable String lieu) {
        return evenementService.getEvenementsByLieu(lieu);
    }

    @GetMapping("/date/{date}")
    public List<Evenement> getEvenementsByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return evenementService.getEvenementsByDate(localDate);
    }

    @GetMapping("/pack/{idPack}")
    public List<Evenement> getEvenementsByPack(@PathVariable Integer idPack) {
        return evenementService.getEvenementsByPackId(idPack);
    }

    @PostMapping
    public Evenement createEvenement(@RequestBody Evenement evenement) {
        return evenementService.saveEvenement(evenement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evenement> updateEvenement(@PathVariable Integer id, @RequestBody Evenement evenement) {
        return evenementService.getEvenementById(id)
                .map(existing -> {
                    evenement.setId(id);
                    return ResponseEntity.ok(evenementService.saveEvenement(evenement));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Integer id) {
        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }
}