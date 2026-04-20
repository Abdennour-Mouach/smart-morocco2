package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Hebergement;
import com.example.smart_morocco.service.HebergementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hebergements")
public class HebergementController {

    private final HebergementService service;

    public HebergementController(HebergementService service) {
        this.service = service;
    }

    @GetMapping
    public List<Hebergement> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hebergement> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Hebergement create(@RequestBody Hebergement item) {
        return service.save(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
