package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Transport;
import com.example.smart_morocco.repository.TransportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransportService {

    private final TransportRepository repository;

    public TransportService(TransportRepository repository) {
        this.repository = repository;
    }

    public List<Transport> getAll() {
        return repository.findAll();
    }

    public Optional<Transport> getById(Long id) {
        return repository.findById(id);
    }

    public Transport save(Transport item) {
        return repository.save(item);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
