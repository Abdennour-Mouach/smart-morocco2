package com.example.smart_morocco.controller;

import com.example.smart_morocco.model.Review;
import com.example.smart_morocco.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Integer id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Review> getReviewsByUtilisateur(@PathVariable Integer idUtilisateur) {
        return reviewService.getReviewsByUtilisateurId(idUtilisateur);
    }

    @GetMapping("/hotel/{idHotel}")
    public List<Review> getReviewsByHotel(@PathVariable Integer idHotel) {
        return reviewService.getReviewsByHotelId(idHotel);
    }

    @GetMapping("/restaurant/{idRestaurant}")
    public List<Review> getReviewsByRestaurant(@PathVariable Integer idRestaurant) {
        return reviewService.getReviewsByRestaurantId(idRestaurant);
    }

    @GetMapping("/evenement/{idEvenement}")
    public List<Review> getReviewsByEvenement(@PathVariable Integer idEvenement) {
        return reviewService.getReviewsByEvenementId(idEvenement);
    }

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewService.saveReview(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Integer id, @RequestBody Review review) {
        return reviewService.getReviewById(id)
                .map(existing -> {
                    review.setId_review(id);
                    return ResponseEntity.ok(reviewService.saveReview(review));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}