package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Paiement;
import com.example.smart_morocco.repository.PaiementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaiementService {

    private final PaiementRepository paiementRepository;

    public PaiementService(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
    }

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Optional<Paiement> getPaiementById(Integer id) {
        return paiementRepository.findById(id);
    }

    public List<Paiement> getPaiementsByReservationId(Integer idReservation) {
        return paiementRepository.findByReservation_Id(idReservation);
    }

    public Paiement savePaiement(Paiement paiement) {
        return paiementRepository.save(paiement);
    }

    public void deletePaiement(Integer id) {
        paiementRepository.deleteById(id);
    }
}