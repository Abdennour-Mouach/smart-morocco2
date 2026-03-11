package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Restaurant;
import com.example.smart_morocco.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Integer id) {
        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ville/{ville}")
    public List<Restaurant> getRestaurantsByVille(@PathVariable String ville) {
        return restaurantService.getRestaurantsByVille(ville);
    }

    @GetMapping("/pack/{idPack}")
    public List<Restaurant> getRestaurantsByPack(@PathVariable Integer idPack) {
        return restaurantService.getRestaurantsByPackId(idPack);
    }

    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.saveRestaurant(restaurant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Integer id, @RequestBody Restaurant restaurant) {
        return restaurantService.getRestaurantById(id)
                .map(existing -> {
                    restaurant.setId(id);
                    return ResponseEntity.ok(restaurantService.saveRestaurant(restaurant));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Integer id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }
}