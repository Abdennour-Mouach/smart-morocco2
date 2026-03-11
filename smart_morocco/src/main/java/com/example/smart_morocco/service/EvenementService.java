package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Evenement;
import com.example.smart_morocco.repository.EvenementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EvenementService {

    private final EvenementRepository evenementRepository;

    public EvenementService(EvenementRepository evenementRepository) {
        this.evenementRepository = evenementRepository;
    }

    public List<Evenement> getAllEvenements() {
        return evenementRepository.findAll();
    }

    public Optional<Evenement> getEvenementById(Integer id) {
        return evenementRepository.findById(id);
    }

    public List<Evenement> getEvenementsByLieu(String lieu) {
        return evenementRepository.findByLieu(lieu);
    }

    public List<Evenement> getEvenementsByDate(LocalDate date) {
        return evenementRepository.findByDate(date);
    }

   public List<Evenement> getEvenementsByPackId(Integer idPack) {
    return evenementRepository.findByPack_Id(idPack);
}
    public Evenement saveEvenement(Evenement evenement) {
        return evenementRepository.save(evenement);
    }

    public void deleteEvenement(Integer id) {
        evenementRepository.deleteById(id);
    }
}