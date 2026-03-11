package com.example.smart_morocco.service;

import com.example.smart_morocco.model.Review;
import com.example.smart_morocco.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Optional<Review> getReviewById(Integer id) {
        return reviewRepository.findById(id);
    }

   public List<Review> getReviewsByUtilisateurId(Integer idUtilisateur) {
    return reviewRepository.findByUtilisateur_Id(idUtilisateur);
}

public List<Review> getReviewsByHotelId(Integer idHotel) {
    return reviewRepository.findByHotel_Id(idHotel);
}

public List<Review> getReviewsByRestaurantId(Integer idRestaurant) {
    return reviewRepository.findByRestaurant_Id(idRestaurant);
}

public List<Review> getReviewsByEvenementId(Integer idEvenement) {
    return reviewRepository.findByEvenement_Id(idEvenement);
}
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public void deleteReview(Integer id) {
        reviewRepository.deleteById(id);
    }
}