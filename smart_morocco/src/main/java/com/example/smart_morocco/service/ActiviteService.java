package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Activite;
import com.example.smart_morocco.repository.ActiviteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActiviteService {

    private final ActiviteRepository repository;

    public ActiviteService(ActiviteRepository repository) {
        this.repository = repository;
    }

    public List<Activite> getAll() {
        return repository.findAll();
    }

    public Optional<Activite> getById(Long id) {
        return repository.findById(id);
    }

    public List<Activite> getByLieu(String lieu) {
        return repository.findByLieu(lieu);
    }

    public Activite save(Activite item) {
        return repository.save(item);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
