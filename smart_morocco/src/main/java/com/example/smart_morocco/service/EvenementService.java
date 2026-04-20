package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Activite;
import com.example.smart_morocco.repository.EvenementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvenementService {

    private final EvenementRepository evenementRepository;

    public EvenementService(EvenementRepository evenementRepository) {
        this.evenementRepository = evenementRepository;
    }

    public List<Activite> getAllEvenements() {
        return evenementRepository.findAll();
    }

    public Optional<Activite> getEvenementById(Long id) {
        return evenementRepository.findById(id);
    }

    public List<Activite> getEvenementsByLieu(String lieu) {
        return evenementRepository.findByLieu(lieu);
    }

    public Activite saveEvenement(Activite evenement) {
        return evenementRepository.save(evenement);
    }

    public void deleteEvenement(Long id) {
        evenementRepository.deleteById(id);
    }
}
