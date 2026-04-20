package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Activite;
import com.example.smart_morocco.service.EvenementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evenements")
public class EvenementController {

    private final EvenementService evenementService;

    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    @GetMapping
    public List<Activite> getAllEvenements() {
        return evenementService.getAllEvenements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activite> getEvenementById(@PathVariable Long id) {
        return evenementService.getEvenementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lieu/{lieu}")
    public List<Activite> getEvenementsByLieu(@PathVariable String lieu) {
        return evenementService.getEvenementsByLieu(lieu);
    }

    @PostMapping
    public Activite createEvenement(@RequestBody Activite evenement) {
        return evenementService.saveEvenement(evenement);
    }

    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }
}
