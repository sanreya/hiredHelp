package com.project.hiredHelp.Controller;

import com.project.hiredHelp.DTO.CreateReviewRequest;
import com.project.hiredHelp.Entity.Review;
import com.project.hiredHelp.Repository.ReviewRepository;
import com.project.hiredHelp.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/{requestId}")
    public ResponseEntity<Review> createReview(
            @PathVariable Long requestId,
            @RequestBody CreateReviewRequest request
    ) {
        Review review = reviewService.createReview(requestId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long requestId,
            @RequestBody CreateReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.updateReview(requestId, request));
    }
}
