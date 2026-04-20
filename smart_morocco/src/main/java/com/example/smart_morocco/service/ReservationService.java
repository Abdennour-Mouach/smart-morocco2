package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Pack;
import com.example.smart_morocco.model.Reservation;
import com.example.smart_morocco.model.Utilisateur;
import com.example.smart_morocco.repository.PackRepository;
import com.example.smart_morocco.repository.ReservationRepository;
import com.example.smart_morocco.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PackRepository packRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            UtilisateurRepository utilisateurRepository,
            PackRepository packRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.packRepository = packRepository;
    }

    public List<Reservation> getReservationsByUtilisateur(Integer idUtilisateur) {
        return reservationRepository.findByIdUtilisateurOrderByDateReservationDesc(idUtilisateur);
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public Reservation createReservation(CreateReservationRequest request) {
        if (request.idUtilisateur == null) {
            throw new IllegalArgumentException("Utilisateur requis");
        }
        if (request.idPack == null) {
            throw new IllegalArgumentException("Pack requis");
        }

        Utilisateur utilisateur = utilisateurRepository.findById(request.idUtilisateur)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        Pack pack = packRepository.findById(request.idPack)
                .orElseThrow(() -> new IllegalArgumentException("Pack introuvable"));

        LocalDate dateDebut = request.dateDebut != null && !request.dateDebut.isBlank()
                ? LocalDate.parse(request.dateDebut)
                : LocalDate.now();

        int persons = request.nbPersonnes != null && request.nbPersonnes > 0 ? request.nbPersonnes : 1;
        LocalDate dateFin = dateDebut.plusDays(Math.max(pack.getDuree() - 1, 0));
        double montantTotal = pack.getPrixTotal() * persons;

        Reservation reservation = new Reservation();
        reservation.setIdUtilisateur(utilisateur.getId_utilisateur());
        reservation.setIdPack(pack.getId());
        reservation.setDateReservation(LocalDateTime.now());
        reservation.setPackTitre(pack.getNomPack());
        reservation.setDestination(pack.getDestination());
        reservation.setNbPersonnes(persons);
        reservation.setDateDebut(dateDebut);
        reservation.setDateFin(dateFin);
        reservation.setMontantTotal(montantTotal);
        reservation.setModePaiement(
                request.modePaiement != null && !request.modePaiement.isBlank()
                        ? request.modePaiement
                        : "Carte bancaire"
        );
        reservation.setStatutPaiement("En attente");
        reservation.setStatut("En attente");

        return reservationRepository.save(reservation);
    }

    public static class CreateReservationRequest {
        public Integer idUtilisateur;
        public Long idPack;
        public Integer nbPersonnes;
        public String dateDebut;
        public String modePaiement;
    }
}
