package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Restaurant;
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

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(Integer id) {
        return restaurantRepository.findById(id);
    }

    public List<Restaurant> getRestaurantsByVille(String ville) {
        return restaurantRepository.findByVille(ville);
    }

    public List<Restaurant> getRestaurantsByPackId(Integer idPack) {
        return restaurantRepository.findByPack_Id(idPack);
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Integer id) {
        restaurantRepository.deleteById(id);
    }
}