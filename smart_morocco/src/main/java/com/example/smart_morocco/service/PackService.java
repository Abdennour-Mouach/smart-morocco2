package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Pack;
import com.example.smart_morocco.repository.PackRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PackService {

    private final PackRepository packRepository;

    public PackService(PackRepository packRepository) {
        this.packRepository = packRepository;
    }

    public List<Pack> getAllPacks() {
        return packRepository.findAll();
    }

    public Optional<Pack> getPackById(Integer id) {
        return packRepository.findById(id);
    }

    public Pack savePack(Pack pack) {
        return packRepository.save(pack);
    }

    public void deletePack(Integer id) {
        packRepository.deleteById(id);
    }
}