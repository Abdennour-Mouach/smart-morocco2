package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Activite;
import com.example.smart_morocco.model.Hebergement;
import com.example.smart_morocco.model.Pack;
import com.example.smart_morocco.model.Restauration;
import com.example.smart_morocco.repository.ActiviteRepository;
import com.example.smart_morocco.repository.HebergementRepository;
import com.example.smart_morocco.repository.PackRepository;
import com.example.smart_morocco.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PackService {

    private final PackRepository repository;
    private final HebergementRepository hebergementRepository;
    private final RestaurantRepository restaurantRepository;
    private final ActiviteRepository activiteRepository;

    public PackService(
            PackRepository repository,
            HebergementRepository hebergementRepository,
            RestaurantRepository restaurantRepository,
            ActiviteRepository activiteRepository
    ) {
        this.repository = repository;
        this.hebergementRepository = hebergementRepository;
        this.restaurantRepository = restaurantRepository;
        this.activiteRepository = activiteRepository;
    }

    public List<Pack> getAll() {
        return repository.findAll();
    }

    public Optional<Pack> getById(Long id) {
        return repository.findById(id);
    }

    public Pack save(Pack item) {
        return repository.save(item);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public Pack createWithRelations(
            Pack pack,
            Long hebergementId,
            Long restaurationId,
            List<Long> activiteIds
    ) {
        pack.setId_hebergement(hebergementId);
        pack.setId_restaurant(restaurationId);

        if (activiteIds != null && !activiteIds.isEmpty()) {
            pack.setId_activite(activiteIds.get(0));
        }

        double total = 0;

        if (hebergementId != null) {
            Hebergement hebergement = hebergementRepository.findById(hebergementId).orElse(null);
            if (hebergement != null) {
                int duree = pack.getDuree();
                total += hebergement.getPrixParNuit() * Math.max(duree, 1);
            }
        }

        if (restaurationId != null) {
            Restauration restauration = restaurantRepository.findById(restaurationId).orElse(null);
            if (restauration != null) {
                total += restauration.getPrix();
            }
        }

        if (activiteIds != null && !activiteIds.isEmpty()) {
            List<Activite> activites = activiteRepository.findAllById(activiteIds);
            total += activites.stream().mapToDouble(Activite::getPrix).sum();
        }

        pack.setPrixTotal(total);
        return repository.save(pack);
    }
}
