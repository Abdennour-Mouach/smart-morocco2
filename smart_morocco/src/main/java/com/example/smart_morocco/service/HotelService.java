package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Hotel;
import com.example.smart_morocco.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> getHotelById(Integer id) {
        return hotelRepository.findById(id);
    }

    public List<Hotel> getHotelsByVille(String ville) {
        return hotelRepository.findByVille(ville);
    }

    public List<Hotel> getHotelsByPackId(Integer idPack) {
        return hotelRepository.findByPack_Id(idPack);
    }

    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Integer id) {
        hotelRepository.deleteById(id);
    }
}