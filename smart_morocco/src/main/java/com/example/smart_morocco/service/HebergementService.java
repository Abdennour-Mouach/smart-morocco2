package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Hebergement;
import com.example.smart_morocco.repository.HebergementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HebergementService {

    private final HebergementRepository repository;

    public HebergementService(HebergementRepository repository) {
        this.repository = repository;
    }

    public List<Hebergement> getAll() {
        return repository.findAll();
    }

    public Optional<Hebergement> getById(Long id) {
        return repository.findById(id);
    }

    public Hebergement save(Hebergement item) {
        return repository.save(item);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
