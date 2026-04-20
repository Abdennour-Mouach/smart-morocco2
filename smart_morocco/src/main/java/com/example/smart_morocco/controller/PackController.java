package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Pack;
import com.example.smart_morocco.service.PackService;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packs")
public class PackController {

    private final PackService service;

    public PackController(PackService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pack> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pack> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pack create(@RequestBody Pack item) {
        return service.save(item);
    }

    @PostMapping("/compose")
    public Pack createComposed(@RequestBody PackComposeRequest req) {
        Pack pack = new Pack();
        pack.setNomPack(req.nomPack);
        pack.setDestination(req.destination);
        pack.setDuree(req.duree);
        pack.setDescription(req.description);
        pack.setPlanning(req.planning);
        pack.setImageUrl(req.imageUrl);
        return service.createWithRelations(
                pack,
                req.hebergementId,
                req.restaurationId,
                req.activiteIds
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    public static class PackComposeRequest {
        public String nomPack;
        public String destination;
        public int duree;
        public String description;
        public String planning;
        @JsonProperty("imageUrl")
        @JsonAlias({"image_url", "imageURL"})
        public String imageUrl;
        public Long hebergementId;
        public Long restaurationId;
        public List<Long> activiteIds;
    }
}
