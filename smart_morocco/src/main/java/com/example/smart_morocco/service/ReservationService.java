package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Reservation;
import com.example.smart_morocco.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(Integer id) {
        return reservationRepository.findById(id);
    }
    

public List<Reservation> getReservationsByUtilisateurId(Integer idUtilisateur) {
    return reservationRepository.findByUtilisateur_Id(idUtilisateur);
}

    public List<Reservation> getReservationsByPackId(Integer idPack) {
        return reservationRepository.findByPack_Id(idPack);
    }

    public Reservation saveReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Integer id) {
        reservationRepository.deleteById(id);
    }
}