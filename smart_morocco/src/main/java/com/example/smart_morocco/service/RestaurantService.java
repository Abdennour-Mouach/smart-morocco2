package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Restauration;
import com.example.smart_morocco.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public List<Restauration> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restauration> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    public Restauration saveRestaurant(Restauration restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }
}
