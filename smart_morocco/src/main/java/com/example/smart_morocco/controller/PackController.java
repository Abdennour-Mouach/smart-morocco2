package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Pack;
import com.example.smart_morocco.service.PackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packs")
public class PackController {

    private final PackService packService;

    public PackController(PackService packService) {
        this.packService = packService;
    }

    @GetMapping
    public List<Pack> getAllPacks() {
        return packService.getAllPacks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pack> getPackById(@PathVariable Integer id) {
        return packService.getPackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pack createPack(@RequestBody Pack pack) {
        return packService.savePack(pack);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pack> updatePack(@PathVariable Integer id, @RequestBody Pack pack) {
        return packService.getPackById(id)
                .map(existing -> {
                    pack.setId(id);
                    return ResponseEntity.ok(packService.savePack(pack));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePack(@PathVariable Integer id) {
        packService.deletePack(id);
        return ResponseEntity.noContent().build();
    }
}