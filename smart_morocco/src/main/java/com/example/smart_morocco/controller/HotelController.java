package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Hotel;
import com.example.smart_morocco.service.HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Integer id) {
        return hotelService.getHotelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ville/{ville}")
    public List<Hotel> getHotelsByVille(@PathVariable String ville) {
        return hotelService.getHotelsByVille(ville);
    }

    @GetMapping("/pack/{idPack}")
    public List<Hotel> getHotelsByPack(@PathVariable Integer idPack) {
        return hotelService.getHotelsByPackId(idPack);
    }

    @PostMapping
    public Hotel createHotel(@RequestBody Hotel hotel) {
        return hotelService.saveHotel(hotel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Integer id, @RequestBody Hotel hotel) {
        return hotelService.getHotelById(id)
                .map(existing -> {
                    hotel.setId(id);
                    return ResponseEntity.ok(hotelService.saveHotel(hotel));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Integer id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }
}