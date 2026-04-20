package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Activite;
import com.example.smart_morocco.service.ActiviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activites")
@CrossOrigin(origins = "*") 
public class ActiviteController {

    private final ActiviteService service;

    public ActiviteController(ActiviteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Activite> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activite> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Activite create(@RequestBody Activite item) {
        return service.save(item);
    }

    @PutMapping("/{id}") // 🔥 UPDATE
    public ResponseEntity<Activite> update(@PathVariable Long id, @RequestBody Activite item) {
        return service.getById(id)
                .map(existing -> {
                    existing.setNomActivity(item.getNomActivity());
                    existing.setDescription(item.getDescription());
                    existing.setLieu(item.getLieu());
                    existing.setDuree(item.getDuree());
                    existing.setPrix(item.getPrix());
                    existing.setImageUrl(item.getImageUrl());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
